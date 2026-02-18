/**
 * @fileoverview Provider configurations for Walter build system
 *
 * Each provider has different requirements for how commands and skills
 * should be formatted. This module defines those differences.
 *
 * Based on actual provider documentation:
 * - Claude Code: https://code.claude.com/docs/en/skills
 * - Cursor: https://cursor.com/docs/context/commands
 * - Gemini CLI: https://geminicli.com/docs/cli/skills/
 * - Codex CLI: https://developers.openai.com/codex/custom-prompts/
 *
 * @module config
 */

/**
 * @typedef {Object} ProviderConfig
 * @property {string} name - Human-readable provider name
 * @property {string} commandsDir - Directory for commands output
 * @property {string} commandExt - File extension for commands
 * @property {string} skillsDir - Directory for skills output
 * @property {boolean} commandFrontmatter - Whether commands keep frontmatter
 * @property {boolean} skillFrontmatter - Whether skills keep frontmatter
 * @property {string[]} [frontmatterFields] - Whitelist of allowed frontmatter fields (if set, others are stripped)
 * @property {string|null} [agentsDir] - Directory for agents output (null if provider doesn't support agents)
 * @property {string[]} [agentFrontmatterFields] - Whitelist of allowed agent frontmatter fields
 * @property {Object<string, string>} placeholders - Map of placeholder to replacement value
 * @property {function(string): string} processArgs - Transform argument references
 */

/**
 * Provider-specific configurations
 * @type {Object<string, ProviderConfig>}
 */
const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');

// Count agents from source
const agentsSrcDir = path.join(__dirname, '../../src/agents');
const agentCount = fs.existsSync(agentsSrcDir)
  ? fs.readdirSync(agentsSrcDir).filter((f) => f.endsWith('.md')).length
  : 0;
const agentsStat = agentCount > 0 ? ` · ${agentCount} agents` : '';

const providers = {
  claude: {
    name: 'Claude',
    // .claude/commands/{name}.md
    commandsDir: '.claude/commands',
    commandExt: '.md',
    // .claude/skills/{name}/SKILL.md + references/
    skillsDir: '.claude/skills',
    commandFrontmatter: true,
    skillFrontmatter: true,
    frontmatterFields: ['name', 'description', 'argument-hint'],
    // .claude/agents/{name}.md
    agentsDir: '.claude/agents',
    agentFrontmatterFields: ['name', 'description', 'tools', 'model'],

    placeholders: {
      '{{ask_instruction}}': 'STOP and use the AskUserQuestion tool to ask',
      '{{config_file}}': 'CLAUDE.md',
      '{{version}}': pkg.version,
      '{{agents_stat}}': agentsStat
    },

    // Claude Code uses $ARGUMENTS natively — keep as-is
    processArgs: (content) => content
  },

  cursor: {
    name: 'Cursor',
    // .cursor/commands/{name}.md (body only, no frontmatter)
    commandsDir: '.cursor/commands',
    commandExt: '.md',
    // .cursor/skills/{name}/SKILL.md
    skillsDir: '.cursor/skills',
    commandFrontmatter: false,
    skillFrontmatter: true,

    placeholders: {
      '{{ask_instruction}}': 'Ask the user directly:',
      '{{config_file}}': '.cursorrules',
      '{{version}}': pkg.version,
      '{{agents_stat}}': ''
    },

    // Cursor doesn't support $ARGUMENTS — strip references
    // (Cursor appends user text to end of prompt automatically)
    processArgs: (content) => content.replace(/^\$ARGUMENTS\n?/gm, '')
  },

  gemini: {
    name: 'Gemini',
    // .gemini/commands/{name}.toml
    commandsDir: '.gemini/commands',
    commandExt: '.toml',
    // .gemini/skills/{name}/SKILL.md + references/
    skillsDir: '.gemini/skills',
    commandFrontmatter: false, // TOML format, not YAML frontmatter
    skillFrontmatter: true,
    // .gemini/agents/{name}.md (experimental)
    agentsDir: '.gemini/agents',
    agentFrontmatterFields: ['name', 'description', 'tools', 'model'],

    placeholders: {
      '{{ask_instruction}}': 'Ask the user directly:',
      '{{config_file}}': 'GEMINI.md',
      '{{version}}': pkg.version,
      '{{agents_stat}}': agentsStat
    },

    // Gemini uses {{args}} for argument substitution
    processArgs: (content) => content.replace(/\$ARGUMENTS/g, '{{args}}')
  },

  codex: {
    name: 'Codex',
    // .codex/prompts/{name}.md
    // Note: Codex prompts are typically global (~/.codex/prompts/)
    // Users will need to copy to ~/.codex/prompts/ for global access
    commandsDir: '.codex/prompts',
    commandExt: '.md',
    // .codex/skills/{name}/SKILL.md
    skillsDir: '.codex/skills',
    commandFrontmatter: true,
    skillFrontmatter: true,
    frontmatterFields: ['description', 'argument-hint'],

    placeholders: {
      '{{ask_instruction}}': 'Ask the user directly:',
      '{{config_file}}': 'AGENTS.md',
      '{{version}}': pkg.version,
      '{{agents_stat}}': ''
    },

    // Codex uses $ARGUMENTS natively — keep as-is
    processArgs: (content) => content
  }
};

module.exports = { providers };
