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

const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');
const { toYAML } = require('./format');

// Count agents from source
const agentsSrcDir = path.join(__dirname, '../../src/agents');
const agentCount = fs.existsSync(agentsSrcDir)
  ? fs.readdirSync(agentsSrcDir).filter((f) => f.endsWith('.md')).length
  : 0;
const agentsStat = agentCount > 0 ? ` · ${agentCount} agents` : '';

// -----------------------------------------------------------------------------
// Output Formatters
// -----------------------------------------------------------------------------

/**
 * Default output formatter — YAML frontmatter + markdown body.
 * When frontmatter is null (stripped by fields config), returns body only.
 *
 * @param {Object|null} frontmatter - Filtered frontmatter (null = no frontmatter)
 * @param {string} body - Markdown body
 * @returns {string}
 */
function defaultFormat(frontmatter, body) {
  if (!frontmatter) return body;
  return `---\n${toYAML(frontmatter)}\n---\n${body}`;
}

/**
 * Gemini command formatter — TOML with description and prompt.
 *
 * @param {Object|null} frontmatter - Filtered frontmatter
 * @param {string} body - Command body
 * @returns {string}
 */
function geminiCommandFormat(frontmatter, body) {
  const description = frontmatter?.description || '';
  const prompt = body.trim().replace(/"/g, '\\"');
  return `description = "${description}"\nprompt = """\n${prompt}\n"""`;
}

// -----------------------------------------------------------------------------
// Provider Configurations
// -----------------------------------------------------------------------------

/**
 * @typedef {Object} ProviderConfig
 * @property {string} name - Human-readable provider name
 * @property {string} commandsDir - Directory for commands output
 * @property {string} commandExt - File extension for commands
 * @property {string} skillsDir - Directory for skills output
 * @property {string|null} [agentsDir] - Directory for agents output (null if unsupported)
 * @property {Object<string, string[]|null|false>} fields - Per-content-type frontmatter field whitelist.
 *   string[] = keep only these fields, null = pass all through, false = strip frontmatter entirely.
 * @property {function(Object|null, string, string): string} formatOutput - Produce final file content
 *   from filtered frontmatter, body, and content type.
 * @property {Object<string, string>} placeholders - Map of placeholder to replacement value
 * @property {function(string): string} processArgs - Transform argument references
 */

const providers = {
  claude: {
    name: 'Claude',
    commandsDir: '.claude/commands',
    commandExt: '.md',
    skillsDir: '.claude/skills',
    agentsDir: '.claude/agents',

    fields: {
      command: ['name', 'description', 'argument-hint'],
      agent: ['name', 'description', 'tools', 'model'],
      skill: null
    },

    formatOutput: defaultFormat,

    placeholders: {
      '{{ask_instruction}}': 'STOP and use the AskUserQuestion tool to ask',
      '{{config_file}}': 'CLAUDE.md',
      '{{version}}': pkg.version,
      '{{agents_stat}}': agentsStat
    },

    processArgs: (content) => content
  },

  cursor: {
    name: 'Cursor',
    commandsDir: '.cursor/commands',
    commandExt: '.md',
    skillsDir: '.cursor/skills',

    fields: {
      command: false,
      skill: null
    },

    formatOutput: defaultFormat,

    placeholders: {
      '{{ask_instruction}}': 'Ask the user directly:',
      '{{config_file}}': '.cursorrules',
      '{{version}}': pkg.version,
      '{{agents_stat}}': ''
    },

    processArgs: (content) => content.replace(/^\$ARGUMENTS\n?/gm, '')
  },

  gemini: {
    name: 'Gemini',
    commandsDir: '.gemini/commands',
    commandExt: '.toml',
    skillsDir: '.gemini/skills',
    agentsDir: '.gemini/agents',

    fields: {
      command: ['description'],
      agent: ['name', 'description', 'tools', 'model'],
      skill: null
    },

    formatOutput(frontmatter, body, contentType) {
      if (contentType === 'command') {
        return geminiCommandFormat(frontmatter, body);
      }
      return defaultFormat(frontmatter, body);
    },

    placeholders: {
      '{{ask_instruction}}': 'Ask the user directly:',
      '{{config_file}}': 'GEMINI.md',
      '{{version}}': pkg.version,
      '{{agents_stat}}': agentsStat
    },

    processArgs: (content) => content.replace(/\$ARGUMENTS/g, '{{args}}')
  },

  codex: {
    name: 'Codex',
    commandsDir: '.codex/prompts',
    commandExt: '.md',
    skillsDir: '.codex/skills',

    fields: {
      command: ['description', 'argument-hint'],
      skill: null
    },

    formatOutput: defaultFormat,

    placeholders: {
      '{{ask_instruction}}': 'Ask the user directly:',
      '{{config_file}}': 'AGENTS.md',
      '{{version}}': pkg.version,
      '{{agents_stat}}': ''
    },

    processArgs: (content) => content
  }
};

module.exports = { providers };
