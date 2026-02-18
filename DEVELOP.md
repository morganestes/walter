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

This generates provider-specific output in `dist/` and builds the website.

---

## Source Structure

```
src/
├── agents/                 # Agent definitions (6 agents)
│   ├── gus.md
│   ├── hank.md
│   ├── heisenberg.md
│   ├── jesse.md
│   ├── mike.md
│   └── skyler.md
│
├── commands/               # Command definitions (9 commands)
│   ├── adapt.md
│   ├── cook.md
│   ├── formula.md
│   ├── prep.md
│   ├── probe.md
│   ├── purity.md
│   ├── stash.md
│   ├── trace.md
│   └── vent.md
│
├── skills/walter/          # The skill
│   ├── SKILL.md            # Main skill file
│   ├── references/         # Domain knowledge (12 references)
│   │   ├── change.md
│   │   ├── debugging.md
│   │   ├── decomposition.md
│   │   ├── execution.md
│   │   ├── foundations.md
│   │   ├── frontend-design.md
│   │   ├── handoff.md
│   │   ├── operations.md
│   │   ├── planning.md
│   │   ├── process.md
│   │   ├── quality.md
│   │   └── sdlc.md
│   └── templates/          # Build-time templates
│       └── intro.md
│
├── components/             # Astro site components
│   ├── Chrome.astro
│   ├── Credits.astro
│   ├── Footer.astro
│   ├── Logo.astro
│   ├── ProviderPanel.astro
│   ├── Tabs.astro
│   └── Terminal.astro
│
├── data/                   # Site data
│   ├── providers.ts        # Provider install configs
│   └── site.ts             # Shared constants
│
├── layouts/
│   └── Base.astro          # HTML shell, fonts, global styles
│
├── pages/
│   ├── 404.astro           # Branded 404 page
│   ├── index.astro         # Landing page
│   └── og.png.ts           # OG image generation (build-time)
│
└── styles/
    ├── base.css            # Reset, typography, utilities
    └── tokens.css          # Design tokens
```

## Generated Output

```
dist/
├── .claude/                # Claude Code provider
│   ├── agents/
│   ├── commands/
│   ├── skills/walter/
│   └── .claude-plugin/     # Plugin manifest
│
├── .cursor/                # Cursor provider
│   ├── commands/
│   └── skills/walter/
│
├── .gemini/                # Gemini CLI provider
│   ├── agents/
│   ├── commands/           # TOML format
│   └── skills/walter/
│
├── .codex/                 # Codex CLI provider
│   ├── prompts/            # Commands as prompts
│   └── skills/walter/
│
└── site/                   # Astro website
```

`dist/` is gitignored — always generated from source.

---

## Scripts

```bash
# Development
npm run dev                 # Astro dev server
npm run preview             # Preview built site

# Build
npm run build               # Full build: backgrounds → plugin → site
npm run build:walter        # Plugin build only — all providers, local copy, ZIPs
npm run build:site          # Astro site build → dist/site/
npm run build:claude        # Single provider build
npm run build:cursor
npm run build:gemini
npm run build:codex

# Quality
npm run lint                # All: markdownlint + ESLint + astro check
npm run lint:md             # Markdown lint (src/ and root)
npm run lint:js             # ESLint (scripts/ and src/)
npm run lint:types          # Astro type checker
npm run format              # Prettier (scripts/ and src/)
npm run format:check        # Prettier check (CI)

# Assets
npm run optimize:bg         # Regenerate background images (skips if up to date)
npm run generate:favicons   # Generate favicon PNGs from SVG

# Housekeeping
npm run clean               # Remove dist/
```

The `build` script chain: `optimize:bg` → `build:walter` → `build:site`.

Single-provider builds (`build:claude`, etc.) skip local copy and ZIP generation.

---

## Build System

The build system (`scripts/build.js`) transforms `src/` into provider-specific formats:

1. **Parse** YAML frontmatter from source markdown
2. **Transform** placeholders (`{{config_file}}`, `{{version}}`, `{{ask_instruction}}`, `{{agents_stat}}`)
3. **Process** conditional blocks (`{{#agents}}...{{/agents}}` — kept or stripped per provider)
4. **Map arguments** (`$ARGUMENTS` → provider-specific syntax)
5. **Filter frontmatter** per provider whitelist
6. **Output** to provider-specific format and location
7. **Copy** Claude output to `.claude/` for local development
8. **ZIP** each provider's output into `public/assets/downloads/` for website distribution

### Provider Configurations

Defined in `scripts/lib/config.js`:

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

### Commands (`src/commands/*.md`)

```yaml
---
name: command-name
description: What this command does
argument-hint: Optional hint text
---

Command prompt body. Use $ARGUMENTS for user input.
Use {{config_file}} for provider-specific config reference.
```

### Agents (`src/agents/*.md`)

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

### Skills (`src/skills/*/SKILL.md`)

```yaml
---
name: Skill Name
description: What this skill provides
---

Skill instructions. References in `references/` subdirectory.
Templates in `templates/` subdirectory.
```

### References (`src/skills/*/references/*.md`)

Plain markdown — no frontmatter. Loaded by commands when deeper context is needed.

### Templates (`src/skills/*/templates/*.md`)

Markdown with contextual placeholders that Walter fills at runtime. Processed through the same build pipeline as other files.

---

## Adding Content

### New Command

1. Create `src/commands/{name}.md` with YAML frontmatter
2. Run `npm run build`
3. Test with your provider
4. Verify output in `dist/` for each provider format

### New Agent

1. Create `src/agents/{name}.md` with YAML frontmatter (`name`, `description`, `tools`, `model`)
2. Follow the shared template: identity, rules, methodology, output structure
3. Include read-only rule: "You never write, edit, or delete files"
4. Run `npm run build`
5. Agents only output to Claude and Gemini

### New Reference

1. Create `src/skills/walter/references/{name}.md`
2. Reference it in `src/skills/walter/SKILL.md` command or reference table
3. Run `npm run build`

---

## Development Workflow

### Pre-commit Hooks

Husky runs lint-staged on every commit:
- **ESLint** on `scripts/**/*.js` and `src/**/*.{ts,astro}`
- **Prettier** on `*.{js,ts,astro,css,json}`

Commits will be rejected if lint or formatting fails.

### Making Changes

1. Edit files in `src/` (never edit `dist/` or `.claude/` directly)
2. Run `npm run build` to regenerate output
3. Test with the relevant provider
4. Run `npm run lint` to verify
5. Commit source files only — `dist/` is gitignored

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
