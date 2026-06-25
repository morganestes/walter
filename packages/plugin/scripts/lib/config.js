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

import fs from 'fs';
import path from 'path';
import pkg from '../../../../package.json' with { type: 'json' };
import { toYAML } from './format.js';

// Count agents from source
const agentsSrcDir = path.join(import.meta.dirname, '..', '..', 'src', 'agents');
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

/**
  * Processes agent frontmatter for Gemini CLI format.
  *
  * @link https://geminicli.com/docs/core/subagents/#configuration-schema
  *
  * @param {Object} frontmatter - The frontmatter object containing agent metadata.
  * @param {string} body - The body content (not directly used in return).
  * @returns {string} The formatted agent string.
  * @throws {Error} If required properties are missing in the frontmatter or validation fails.
  */
function geminiAgentFormat(frontmatter, body) {
  // Bail early if required fields are missing.
  // This throws an error instead of returning a value.
  geminiCheckRequiredFields(frontmatter);

  const { tools, name, model, kind = 'local' } = frontmatter;
  const newFrontmatter = {
    ...frontmatter,
    display_name: name,
    name: `walter_${name.replace(/\s/g, '_').toLowerCase()}`,
    tools: geminiToolsRemap(tools),
    model: geminiModelRemap(model),
    kind
  };

  // Filter out properties with no value to avoid errors with the agent.
  const cleanedFrontmatter = Object.fromEntries(
    Object.entries(newFrontmatter).filter(
      ([, value]) => {
        return value !== null
          && value !== ''
          && (!Array.isArray(value) || value.length !== 0)
      }
    )
  );

  // Validate the final agent configuration.
  const validationErrors = validateGeminiAgent(cleanedFrontmatter);
  if (validationErrors.length > 0) {
    const errorDetails = validationErrors.join('\n- ');
    throw new Error(`
      Gemini agent validation failed for "${cleanedFrontmatter.name || name}":
        ${errorDetails}
      `);
  }

  return defaultFormat(cleanedFrontmatter, body);
}

/**
 * Remaps tool names from a comma-separated string to Gemini CLI compatible tool names.
 *
 * @param {string|undefined} tools - Comma-separated string of tool names (e.g., "Read, Write, WebSearch").
 * @returns {string[]} An array of remapped tool names.
 */
function geminiToolsRemap(tools) {
  if (!tools || typeof tools !== 'string') {
    return [];
  }

  const toolMap = {
    Read: 'read_file',
    Glob: 'glob',
    Grep: 'grep_search',
    Bash: 'run_shell_command',
    WebSearch: 'google_web_search',
    WebFetch: 'web_fetch'
  };

  return tools
    .split(/,\s*/)
    .map((t) => toolMap[t] || t)
    .filter(Boolean); // Remove any empty strings that might result from splitting.
}

/**
 * Remaps model names for Gemini CLI.
 *
 * @param {string} [model] - The model name to remap. Defaults to an empty string.
 * @returns {string} The remapped model name or the Gemini default 'inherit'.
 */
function geminiModelRemap(model = '') {
  return model?.startsWith('gemini') ? model : 'inherit';
}

function geminiCheckRequiredFields(frontmatter) {
  console.log({ frontmatter });
  const requiredFields = ['name', 'description'];

  for (const field of requiredFields) {
    if (!Object.hasOwn(frontmatter, field) || typeof frontmatter[field] !== 'string') {
      throw new Error(`"${field}" is a required Agent field.`);
    }
  }
}

/**
  * Validates a Gemini agent configuration object against the official schema.
  *
  * @see {@link https://geminicli.com/docs/core/subagents/#configuration-schema}
  *
  * @param {object} agentConfig - The agent configuration object to validate.
  * @returns {string[]} An array of error messages. The array is empty if the configuration is valid.
  */
function validateGeminiAgent(agentConfig) {
  const errors = [];

  // Required fields
  if (!agentConfig.name || typeof agentConfig.name !== 'string') {
    errors.push('`name` is required and must be a string.');
  } else if (!/^[a-z0-9_-]+$/.test(agentConfig.name)) {
    // Name format
    errors.push('`name` must contain only lowercase letters, numbers, hyphens, and underscores.');
  }

  if (!agentConfig.description || typeof agentConfig.description !== 'string') {
    errors.push('`description` is required and must be a string.');
  }

  // Optional fields type, value, and range validation
  if (agentConfig.kind && !['local', 'remote'].includes(agentConfig.kind)) {
    errors.push('`kind` must be either "local" or "remote".');
  }

  if (agentConfig.tools &&
    (
      !Array.isArray(agentConfig.tools) ||
      !agentConfig.tools.every((t) => typeof t === 'string')
    )
  ) {
    errors.push('`tools` must be an array of strings.');
  }

  if (agentConfig.mcpServers &&
    (
      typeof agentConfig.mcpServers !== 'object' ||
      Array.isArray(agentConfig.mcpServers) ||
      agentConfig.mcpServers === null
    )
  ) {
    errors.push('`mcpServers` must be an object.');
  }

  if (agentConfig.model && typeof agentConfig.model !== 'string') {
    errors.push('`model` must be a string.');
  }

  if (agentConfig.temperature !== undefined) {
    if (typeof agentConfig.temperature !== 'number') {
      errors.push('`temperature` must be a number.');
    } else if (agentConfig.temperature < 0.0 || agentConfig.temperature > 2.0) {
      errors.push('`temperature` must be between 0.0 and 2.0.');
    }
  }

  if (agentConfig.max_turns !== undefined && typeof agentConfig.max_turns !== 'number') {
    errors.push('`max_turns` must be a number.');
  }

  if (agentConfig.timeout_mins !== undefined && typeof agentConfig.timeout_mins !== 'number') {
    errors.push('`timeout_mins` must be a number.');
  }

  return errors;
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
      agent: ['name', 'display_name', 'description', 'tools', 'model'],
      skill: null
    },

    formatOutput(frontmatter, body, contentType) {
      const formatters = {
        command: geminiCommandFormat,
        agent: geminiAgentFormat,
        skill: defaultFormat
      };

      return formatters[contentType]?.(frontmatter, body);
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

export { providers };
