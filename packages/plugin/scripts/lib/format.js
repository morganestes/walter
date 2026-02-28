/**
 * @fileoverview Shared formatting utilities for the Walter build system.
 *
 * Used by both config.js (provider formatOutput) and build.js (transform pipeline).
 *
 * @module format
 */

/**
 * Serialize frontmatter object to YAML string
 *
 * @param {Object} frontmatter
 * @returns {string}
 */
function toYAML(frontmatter) {
  let yaml = '';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      yaml += `${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          const entries = Object.entries(item);
          yaml += `  - ${entries[0][0]}: ${entries[0][1]}\n`;
          for (let i = 1; i < entries.length; i++) {
            yaml += `    ${entries[i][0]}: ${entries[i][1]}\n`;
          }
        } else {
          yaml += `  - ${item}\n`;
        }
      }
    } else {
      yaml += `${key}: ${value}\n`;
    }
  }
  return yaml.trimEnd();
}

/**
 * Filter frontmatter to only include allowed fields
 *
 * @param {Object} frontmatter - Parsed frontmatter object
 * @param {string[]|null} allowedFields - Whitelist of field names. null = pass all through.
 * @returns {Object} Filtered frontmatter
 */
function filterFrontmatter(frontmatter, allowedFields) {
  if (!allowedFields || !frontmatter) return frontmatter;
  const filtered = {};
  for (const field of allowedFields) {
    if (field in frontmatter) {
      filtered[field] = frontmatter[field];
    }
  }
  return filtered;
}

module.exports = { toYAML, filterFrontmatter };
