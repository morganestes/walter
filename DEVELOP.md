# Developer Guide

How to work on Walter. Architecture, build system, and contribution workflow.

---

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node.js)
- **zip** (system command — used for generating download archives; preinstalled on macOS and most Linux distros)

## Quick Start

```bash
git clone https://github.com/derekherman/walter.git
cd walter
npm install
npm run build
```

This generates provider-specific output and builds the website.

---

## Source Structure

The repo uses npm workspaces with two packages. Workspaces exist for monorepo merge compatibility — the plugin and site have no runtime dependencies on each other.

```
packages/
├── plugin/                 # @walter/plugin — skill, commands, agents, build system
│   ├── src/
│   │   ├── agents/         # Agent definitions (6 agents)
│   │   ├── commands/       # Command definitions (9 commands)
│   │   └── skills/walter/  # SKILL.md, references/, templates/
│   ├── scripts/
│   │   ├── build.js        # Plugin build system
│   │   ├── sync-version.js # Syncs version to .claude-plugin/ manifests
│   │   └── lib/            # config.js, format.js
│   ├── dist/               # Build output (gitignored)
│   └── package.json
│
└── site/                   # @walter/site — Astro marketing site
    ├── src/
    │   ├── components/     # *.astro components
    │   ├── data/           # providers.ts, site.ts
    │   ├── layouts/        # Base.astro
    │   ├── pages/          # index.astro, 404.astro, og.png.ts
    │   ├── styles/         # base.css, tokens.css
    │   └── assets/         # desert.jpg
    ├── scripts/
    │   ├── optimize-bg.js  # Background image optimization
    │   ├── generate-banner.js  # README banner from OG image
    │   └── generate-favicons.js
    ├── public/             # Static assets (favicons, robots.txt, downloads/)
    ├── dist/               # Astro build output (gitignored)
    ├── astro.config.mjs
    ├── tsconfig.json       # Extends ../../tsconfig.base.json
    └── package.json
```

## Generated Output

Each package builds to its own `dist/`:

```
packages/plugin/dist/
├── .claude/                # Claude Code provider
├── .cursor/                # Cursor provider
├── .gemini/                # Gemini CLI provider
├── .codex/                 # Codex CLI provider
└── downloads/              # ZIP archives for website

packages/site/dist/         # Astro website (Vercel serves from here)
```

Per-package `dist/` is gitignored — always generated from source.

---

## Scripts

Root scripts orchestrate via `npm run <script> -w @walter/<pkg>`. Each package defines its own scripts in its `package.json`.

```bash
# Development
npm run dev                 # Astro dev server (delegates to @walter/site)
npm run preview             # Preview built site

# Build
npm run build               # Full chain: sync → optimize → plugin → copy → site → banner
npm run build:plugin        # Plugin build only — all providers, local copy, ZIPs
npm run build:site          # Astro site build → packages/site/dist/
npm run build:claude        # Single provider build
npm run build:cursor
npm run build:gemini
npm run build:codex

# Quality
npm run lint                # All: markdownlint + ESLint + astro check
npm run lint:md             # Markdown lint (plugin src/ and root docs)
npm run lint:js             # ESLint (packages/)
npm run lint:types          # Astro type checker (delegates to @walter/site)
npm run format              # Prettier
npm run format:check        # Prettier check (CI)

# Assets
npm run optimize:bg         # Regenerate background images (skips if up to date)
npm run generate:banner     # Crop OG image into README banner (needs site build)
npm run generate:favicons   # Generate favicon PNGs from SVG

# Housekeeping
npm run clean               # Remove packages/*/dist/
```

**Build chain:** `sync:version` → `optimize:bg` → `build:plugin` → `copy:downloads` → `build:site` → `generate:banner`

The `copy:downloads` step copies ZIPs from `packages/plugin/dist/downloads/` to `packages/site/public/assets/downloads/`. This is the only cross-package data handoff — the plugin has no knowledge of the site.

Single-provider builds (`build:claude`, etc.) skip local copy and ZIP generation.

---

## Build System

The build system (`packages/plugin/scripts/build.js`) transforms plugin source into provider-specific formats:

1. **Parse** YAML frontmatter from source markdown
2. **Transform** placeholders (`{{config_file}}`, `{{version}}`, `{{ask_instruction}}`, `{{agents_stat}}`)
3. **Process** conditional blocks (`{{#agents}}...{{/agents}}` — kept or stripped per provider)
4. **Map arguments** (`$ARGUMENTS` → provider-specific syntax)
5. **Filter frontmatter** per provider whitelist
6. **Output** to provider-specific format and location
7. **Copy** Claude output to `.claude/` at repo root for local development
8. **ZIP** each provider's output into `packages/plugin/dist/downloads/` (root copies to site during build)

### Provider Configurations

Defined in `packages/plugin/scripts/lib/config.js`:

| Provider | Commands Dir | Extension | Agents | Arg Syntax | Config File |
| -------- | ----------- | --------- | ------ | ---------- | ----------- |
| Claude | `.claude/commands/` | `.md` | `.claude/agents/` | `$ARGUMENTS` | `CLAUDE.md` |
| Cursor | `.cursor/commands/` | `.md` | N/A | Stripped | `.cursorrules` |
| Gemini | `.gemini/commands/` | `.toml` | `.gemini/agents/` | `{{args}}` | `GEMINI.md` |
| Codex | `.codex/prompts/` | `.md` | N/A | `$ARGUMENTS` | `AGENTS.md` |

### Placeholders

| Placeholder | Replacement |
| ----------- | ----------- |
| `{{config_file}}` | Provider-specific config file name |
| `{{ask_instruction}}` | Provider-specific prompt instruction |
| `{{version}}` | Version from `package.json` |
| `{{agents_stat}}` | Agent count string (empty for providers without agents) |

---

## Source Format

### Commands (`packages/plugin/src/commands/*.md`)

```yaml
---
name: command-name
description: What this command does
argument-hint: Optional hint text
---

Command prompt body. Use $ARGUMENTS for user input.
Use {{config_file}} for provider-specific config reference.
```

### Agents (`packages/plugin/src/agents/*.md`)

```yaml
---
name: agent-name
description: What this agent does
tools: Tool1, Tool2, Tool3
model: model-name
---

Agent instructions and methodology.
```

Agents output only to providers with agent support (Claude, Gemini).

### Skills (`packages/plugin/src/skills/*/SKILL.md`)

```yaml
---
name: Skill Name
description: What this skill provides
---

Skill instructions. References in `references/` subdirectory.
Templates in `templates/` subdirectory.
```

### References (`packages/plugin/src/skills/*/references/*.md`)

Plain markdown — no frontmatter. Loaded by commands when deeper context is needed.

### Templates (`packages/plugin/src/skills/*/templates/*.md`)

Markdown with contextual placeholders that Walter fills at runtime. Processed through the same build pipeline as other files.

---

## Adding Content

### New Command

1. Create `packages/plugin/src/commands/{name}.md` with YAML frontmatter
2. Run `npm run build`
3. Test with your provider
4. Verify output in `packages/plugin/dist/` for each provider format

### New Agent

1. Create `packages/plugin/src/agents/{name}.md` with YAML frontmatter (`name`, `description`, `tools`, `model`)
2. Follow the shared template: identity, rules, methodology, output structure
3. Include read-only rule: "You never write, edit, or delete files"
4. Run `npm run build`
5. Agents only output to Claude and Gemini

### New Reference

1. Create `packages/plugin/src/skills/walter/references/{name}.md`
2. Reference it in `packages/plugin/src/skills/walter/SKILL.md` command or reference table
3. Run `npm run build`

---

## Development Workflow

### Pre-commit Hooks

Husky runs lint-staged on every commit:
- **ESLint** on `packages/plugin/scripts/**/*.js` and `packages/site/src/**/*.{ts,astro}`
- **Prettier** on `*.{js,ts,astro,css,json}`

Commits will be rejected if lint or formatting fails.

### Making Changes

1. Edit files in `packages/` (never edit `dist/` or `.claude/` directly)
2. Run `npm run build` to regenerate output
3. Test with the relevant provider
4. Run `npm run lint` to verify
5. Commit source files only — per-package `dist/` is gitignored

### Local Testing

The full build copies Claude output to `.claude/` at the repo root for local development. Any Walter command (`/formula`, `/cook`, etc.) runs against the latest build.

---

## Plugin Distribution

Walter ships as a Claude Code plugin via the marketplace.

- **Manifest**: `.claude-plugin/marketplace.json` (marketplace metadata)
- **Plugin**: `.claude-plugin/plugin.json` (plugin definition)
- **Source**: `.claude/` directory (built from `src/`)
- **Install**: `/plugin marketplace add derekherman/walter`

---

## Known Issues

- YAML parser doesn't strip quotes from quoted strings (latent — round-trip works)
- No build transformation validation (output not verified beyond "it runs")
- Provider abstraction leaks (TOML special case in build.js)
- Duplicate transform functions in build.js (~80% shared logic)
- Single-provider build doesn't clean stale output from other providers
