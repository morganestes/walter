#!/usr/bin/env node

/**
 * @fileoverview Walter Build System
 *
 * Transforms source files from src/ into provider-specific formats in dist/.
 * Each provider (Claude Code, Cursor, Gemini, Codex) has different requirements
 * for file locations, frontmatter, and syntax.
 *
 * @example
 * // Build all providers
 * node scripts/build.js
 *
 * @example
 * // Build specific provider
 * node scripts/build.js claude
 *
 * @module build
 */

import fs from 'fs';
import path from 'path';
import { providers } from './lib/config.js';
import { filterFrontmatter } from './lib/format.js';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const PKG = path.resolve(import.meta.dirname, '..');
const SRC = path.join(PKG, 'src');
const DIST = path.join(PKG, 'dist');
const LOCAL_CLAUDE = path.join(ROOT, '.claude');
const DOWNLOADS = path.join(DIST, 'downloads');

// -----------------------------------------------------------------------------
// YAML Frontmatter Parsing
// -----------------------------------------------------------------------------

/**
 * Parse a markdown file with YAML frontmatter
 *
 * @param {string} content - Raw file content
 * @returns {{frontmatter: Object|null, body: string}}
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: content };

  const [, yaml, body] = match;
  return { frontmatter: parseYAML(yaml), body };
}

/**
 * Parse simple YAML (handles our frontmatter format)
 *
 * @param {string} yaml - Raw YAML content
 * @returns {Object}
 */
function parseYAML(yaml) {
  const result = {};
  const lines = yaml.split('\n');
  let currentArray = null;
  let currentObject = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    // Array item: "  - name: value"
    const arrayMatch = line.match(/^\s+-\s+(\w+):\s*(.*)$/);
    if (arrayMatch && currentArray) {
      const [, key, value] = arrayMatch;
      currentObject = { [key]: value };
      result[currentArray].push(currentObject);
      continue;
    }

    // Nested property: "    key: value"
    const nestedMatch = line.match(/^\s{4,}(\w+):\s*(.*)$/);
    if (nestedMatch && currentObject) {
      const [, key, value] = nestedMatch;
      currentObject[key] = value === 'true' ? true : value === 'false' ? false : value;
      continue;
    }

    // Array start: "key:"
    const arrayStart = line.match(/^(\w+):$/);
    if (arrayStart) {
      currentArray = arrayStart[1];
      result[currentArray] = [];
      currentObject = null;
      continue;
    }

    // Simple key-value: "key: value" (supports hyphenated keys like argument-hint)
    const kv = line.match(/^([\w-]+):\s*(.+)$/);
    if (kv) {
      result[kv[1]] = kv[2];
      currentArray = null;
      currentObject = null;
    }
  }

  return result;
}

// -----------------------------------------------------------------------------
// Content Transformation
// -----------------------------------------------------------------------------

/**
 * Process conditional blocks based on provider capabilities
 * {{#agents}}...{{/agents}} blocks are kept for providers with agentsDir,
 * removed entirely for providers without.
 *
 * @param {string} content - Content with conditional blocks
 * @param {string} provider - Provider key
 * @returns {string}
 */
function processConditionals(content, provider) {
  const config = providers[provider];

  // {{#agents}}...{{/agents}} — keep content if provider has agents, strip otherwise
  if (config.agentsDir) {
    content = content.replace(/\{\{#agents\}\}\n?/g, '');
    content = content.replace(/\{\{\/agents\}\}\n?/g, '');
  } else {
    content = content.replace(/\{\{#agents\}\}[\s\S]*?\{\{\/agents\}\}\n?/g, '');
  }

  return content;
}

/**
 * Transform content for a provider.
 *
 * Unified pipeline: parse frontmatter → replace placeholders → process
 * conditionals → process args → filter frontmatter → format output.
 * Content type and format differences are handled by provider config.
 *
 * @param {string} content - Raw file content
 * @param {string} provider - Provider key
 * @param {string} contentType - 'command', 'agent', or 'skill'
 * @returns {string}
 */
function transform(content, provider, contentType) {
  const config = providers[provider];
  const { frontmatter, body: rawBody } = parseFrontmatter(content);
  let body = rawBody;

  // Replace placeholders
  for (const [placeholder, replacement] of Object.entries(config.placeholders)) {
    body = body.split(placeholder).join(replacement);
  }

  // Process conditional blocks
  body = processConditionals(body, provider);

  // Process args syntax ($ARGUMENTS → provider-specific)
  body = config.processArgs(body);

  // Filter frontmatter based on content type
  const fields = config.fields[contentType];
  const filtered = fields === false ? null : filterFrontmatter(frontmatter, fields);

  // Format output (provider decides the format)
  return config.formatOutput(filtered, body, contentType);
}

// -----------------------------------------------------------------------------
// File Operations
// -----------------------------------------------------------------------------

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Recursively copy a directory
 *
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy Claude Code build output to local .claude/ directory
 * Only overwrites Walter-owned files, preserves other commands/skills
 */
function copyToLocal() {
  console.log('Copying to .claude/...');

  const claudeDist = path.join(DIST, '.claude');

  if (!fs.existsSync(claudeDist)) {
    console.log('  ⚠ No Claude Code build found, skipping local copy');
    return;
  }

  const localCommands = path.join(LOCAL_CLAUDE, 'commands');
  const localSkills = path.join(LOCAL_CLAUDE, 'skills');
  const localAgents = path.join(LOCAL_CLAUDE, 'agents');
  const distCommands = path.join(claudeDist, 'commands');
  const distSkills = path.join(claudeDist, 'skills');
  const distAgents = path.join(claudeDist, 'agents');

  // Only remove Walter-owned commands (not the whole directory)
  if (fs.existsSync(distCommands)) {
    const walterCommands = fs.readdirSync(distCommands);
    for (const cmd of walterCommands) {
      const localCmd = path.join(localCommands, cmd);
      if (fs.existsSync(localCmd)) {
        fs.unlinkSync(localCmd);
      }
    }
  }

  // Only remove Walter-owned skills (not the whole directory)
  if (fs.existsSync(distSkills)) {
    const walterSkills = fs.readdirSync(distSkills);
    for (const skill of walterSkills) {
      const localSkill = path.join(localSkills, skill);
      if (fs.existsSync(localSkill)) {
        fs.rmSync(localSkill, { recursive: true });
      }
    }
  }

  // Only remove Walter-owned agents (not the whole directory)
  if (fs.existsSync(distAgents)) {
    const walterAgents = fs.readdirSync(distAgents);
    for (const agent of walterAgents) {
      const localAgent = path.join(localAgents, agent);
      if (fs.existsSync(localAgent)) {
        fs.unlinkSync(localAgent);
      }
    }
  }

  // Copy from dist

  if (fs.existsSync(distCommands)) {
    copyDir(distCommands, localCommands);
  }
  if (fs.existsSync(distSkills)) {
    copyDir(distSkills, localSkills);
  }
  if (fs.existsSync(distAgents)) {
    copyDir(distAgents, localAgents);
  }

  console.log('  ✓ .claude/commands');
  console.log('  ✓ .claude/skills');
  console.log('  ✓ .claude/agents');
}

/**
 * Create ZIP archives for each provider's distribution
 * Zips contain walter/ directory with commands/ and skills/ inside
 * Output to dist/downloads/ for root to copy to site
 */
function createZips() {
  console.log('Creating ZIP archives...');

  ensureDir(DOWNLOADS);

  let zipErrors = 0;

  for (const provider of Object.keys(providers)) {
    const config = providers[provider];

    // Config directory is now directly in dist (e.g., dist/.claude/)
    const configDir = config.commandsDir.split('/')[0];
    const configDirPath = path.join(DIST, configDir);

    if (!fs.existsSync(configDirPath)) {
      continue;
    }

    // Create walter/ directory in public/assets for zipping
    const walterDir = path.join(DOWNLOADS, 'walter');
    if (fs.existsSync(walterDir)) {
      fs.rmSync(walterDir, { recursive: true });
    }
    ensureDir(walterDir);

    // Copy commands, skills, and agents into walter/
    const commandsSubdir = config.commandsDir.split('/').slice(1).join('/') || 'commands';
    const srcCommands = path.join(configDirPath, commandsSubdir);
    const srcSkills = path.join(configDirPath, 'skills');
    const srcAgents = path.join(configDirPath, 'agents');
    if (fs.existsSync(srcCommands)) {
      copyDir(srcCommands, path.join(walterDir, commandsSubdir));
    }
    if (fs.existsSync(srcSkills)) {
      copyDir(srcSkills, path.join(walterDir, 'skills'));
    }
    if (fs.existsSync(srcAgents)) {
      copyDir(srcAgents, path.join(walterDir, 'agents'));
    }

    const zipName = `walter-${provider}.zip`;
    const zipPath = path.join(DOWNLOADS, zipName);

    // Remove existing zip
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    // Create zip using system zip command
    try {
      execSync(`zip -rq "${zipName}" walter`, {
        cwd: DOWNLOADS,
        stdio: 'pipe'
      });
      console.log(`  ✓ ${path.relative(ROOT, zipPath)}`);
    } catch (err) {
      console.error(`  ✗ Failed to create ${zipName}: ${err.message}`);
      zipErrors++;
    }

    // Clean up temporary walter/ directory
    fs.rmSync(walterDir, { recursive: true });
  }

  if (zipErrors > 0) {
    console.error(`\n${zipErrors} ZIP archive(s) failed to create.`);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------

/**
 * Build output for a specific provider
 *
 * @param {string} provider - Provider key
 */
function buildProvider(provider) {
  const config = providers[provider];
  if (!config) {
    console.error(`Unknown provider: ${provider}`);
    process.exit(1);
  }

  console.log(`Building for ${config.name}...`);

  // Output directly to dist/ (config paths already include .claude/, .cursor/, etc.)
  const providerDist = DIST;

  // Clean provider's output directory to prevent stale files
  const configDir = config.commandsDir.split('/')[0];
  const configDirPath = path.join(DIST, configDir);
  if (fs.existsSync(configDirPath)) {
    fs.rmSync(configDirPath, { recursive: true });
  }

  // Build commands
  const commandsSrc = path.join(SRC, 'commands');
  if (fs.existsSync(commandsSrc)) {
    const commandsDest = path.join(providerDist, config.commandsDir);
    ensureDir(commandsDest);

    const files = fs.readdirSync(commandsSrc).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(commandsSrc, file), 'utf-8');
      const transformed = transform(content, provider, 'command');
      const outName = file.replace('.md', config.commandExt);
      fs.writeFileSync(path.join(commandsDest, outName), transformed);
    }
    console.log(`  ✓ Commands (${files.length})`);
  }

  // Build skills
  const skillsSrc = path.join(SRC, 'skills');
  if (fs.existsSync(skillsSrc)) {
    const skillDirs = fs
      .readdirSync(skillsSrc, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const skillDir of skillDirs) {
      const skillName = skillDir.name;
      const skillSrcPath = path.join(skillsSrc, skillName);

      // All providers use directory format: skills/{name}/SKILL.md + references/
      const skillDestPath = path.join(providerDist, config.skillsDir, skillName);
      ensureDir(skillDestPath);

      const skillMd = path.join(skillSrcPath, 'SKILL.md');
      if (fs.existsSync(skillMd)) {
        const content = fs.readFileSync(skillMd, 'utf-8');
        const transformed = transform(content, provider, 'skill');
        fs.writeFileSync(path.join(skillDestPath, 'SKILL.md'), transformed);
      }

      // Copy references
      const refsDir = path.join(skillSrcPath, 'references');
      if (fs.existsSync(refsDir)) {
        const refsDest = path.join(skillDestPath, 'references');
        ensureDir(refsDest);
        const refs = fs.readdirSync(refsDir).filter((f) => f.endsWith('.md'));
        for (const ref of refs) {
          const refContent = fs.readFileSync(path.join(refsDir, ref), 'utf-8');
          const transformed = transform(refContent, provider, 'skill');
          fs.writeFileSync(path.join(refsDest, ref), transformed);
        }
      }

      // Copy templates (with placeholder + conditional transforms)
      const templatesDir = path.join(skillSrcPath, 'templates');
      if (fs.existsSync(templatesDir)) {
        const templatesDest = path.join(skillDestPath, 'templates');
        ensureDir(templatesDest);
        const templates = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.md'));
        for (const template of templates) {
          const templateContent = fs.readFileSync(path.join(templatesDir, template), 'utf-8');
          const transformed = transform(templateContent, provider, 'skill');
          fs.writeFileSync(path.join(templatesDest, template), transformed);
        }
      }
    }
    console.log(`  ✓ Skills (${skillDirs.length})`);
  }

  // Build agents (only for providers that support them)
  if (config.agentsDir) {
    const agentsSrc = path.join(SRC, 'agents');
    if (fs.existsSync(agentsSrc)) {
      const agentsDest = path.join(providerDist, config.agentsDir);
      ensureDir(agentsDest);

      const files = fs.readdirSync(agentsSrc).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(agentsSrc, file), 'utf-8');
        const transformed = transform(content, provider, 'agent');
        fs.writeFileSync(path.join(agentsDest, file), transformed);
      }
      console.log(`  ✓ Agents (${files.length})`);
    }
  }

  console.log(`  → ${path.relative(ROOT, providerDist)}`);
}

/**
 * Build output for all providers
 */
function buildAll() {
  console.log('Walter Build System\n');

  ensureDir(DIST);

  for (const provider of Object.keys(providers)) {
    buildProvider(provider);
    console.log();
  }

  copyToLocal();
  console.log();

  createZips();
  console.log();

  console.log('Done.');
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

/**
 * Validate build output for structural correctness.
 * Checks that each provider produced the expected directories, file counts,
 * and file formats.
 *
 * @returns {string[]} Array of error messages (empty = valid)
 */
function validateOutput() {
  const errors = [];

  // Count source files
  const srcCommands = path.join(SRC, 'commands');
  const srcAgents = path.join(SRC, 'agents');
  const srcSkills = path.join(SRC, 'skills');
  const commandCount = fs.existsSync(srcCommands)
    ? fs.readdirSync(srcCommands).filter((f) => f.endsWith('.md')).length
    : 0;
  const agentCount = fs.existsSync(srcAgents)
    ? fs.readdirSync(srcAgents).filter((f) => f.endsWith('.md')).length
    : 0;
  const skillCount = fs.existsSync(srcSkills)
    ? fs.readdirSync(srcSkills, { withFileTypes: true }).filter((d) => d.isDirectory()).length
    : 0;

  for (const [provider, config] of Object.entries(providers)) {
    const configDir = config.commandsDir.split('/')[0];
    const configDirPath = path.join(DIST, configDir);

    // Provider directory exists
    if (!fs.existsSync(configDirPath)) {
      errors.push(`${provider}: missing output directory ${configDir}/`);
      continue;
    }

    // Commands directory and count
    const commandsPath = path.join(DIST, config.commandsDir);
    if (!fs.existsSync(commandsPath)) {
      errors.push(`${provider}: missing commands directory`);
    } else {
      const outFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(config.commandExt));
      if (outFiles.length !== commandCount) {
        errors.push(`${provider}: expected ${commandCount} commands, got ${outFiles.length}`);
      }

      // Format check: TOML files should not start with ---, markdown with frontmatter should
      for (const file of outFiles) {
        const content = fs.readFileSync(path.join(commandsPath, file), 'utf-8');
        if (config.commandExt === '.toml') {
          if (content.startsWith('---')) {
            errors.push(`${provider}: ${file} is TOML but starts with YAML frontmatter`);
          }
        }
        const fields = config.fields.command;
        if (fields !== false && config.commandExt !== '.toml' && !content.startsWith('---\n')) {
          errors.push(`${provider}: ${file} should have frontmatter but doesn't`);
        }
        if (fields === false && content.startsWith('---\n')) {
          errors.push(`${provider}: ${file} should not have frontmatter but does`);
        }
      }
    }

    // Skills directory and count
    const skillsPath = path.join(DIST, config.skillsDir);
    if (!fs.existsSync(skillsPath)) {
      errors.push(`${provider}: missing skills directory`);
    } else {
      const outDirs = fs
        .readdirSync(skillsPath, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      if (outDirs.length !== skillCount) {
        errors.push(`${provider}: expected ${skillCount} skills, got ${outDirs.length}`);
      }
    }

    // Agents directory and count (if provider supports them)
    if (config.agentsDir) {
      const agentsPath = path.join(DIST, config.agentsDir);
      if (!fs.existsSync(agentsPath)) {
        errors.push(`${provider}: missing agents directory`);
      } else {
        const outFiles = fs.readdirSync(agentsPath).filter((f) => f.endsWith('.md'));
        if (outFiles.length !== agentCount) {
          errors.push(`${provider}: expected ${agentCount} agents, got ${outFiles.length}`);
        }
      }
    }
  }

  return errors;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.length === 0) {
  buildAll();

  console.log('Validating output...');
  const errors = validateOutput();
  if (errors.length > 0) {
    console.error(`\n${errors.length} validation error(s):`);
    for (const err of errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  }
  console.log('  ✓ All output valid\n');
} else {
  for (const provider of args) {
    buildProvider(provider);
  }

  console.log('\nValidating output...');
  const errors = validateOutput();
  if (errors.length > 0) {
    console.error(`\n${errors.length} validation error(s):`);
    for (const err of errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  }
  console.log('  ✓ All output valid');
}
