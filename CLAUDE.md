# Walter

An engineering persona for AI agents. Skill + command framework that teaches principal engineering discipline.

## Commands

```bash
npm run dev             # Astro dev server
npm run build           # Full build: backgrounds → plugin → site
npm run build:walter    # Plugin build only
npm run lint            # Lint all: markdownlint + ESLint + astro check
npm run format          # Prettier
npm run clean           # Remove dist/
```

## Docs

- [DEVELOP.md](DEVELOP.md) — Architecture, build system, source format, adding content, development workflow
- [CONTRIBUTING.md](CONTRIBUTING.md) — Setup, making changes, PRs, code style
- [SECURITY.md](SECURITY.md) — Vulnerability reporting
- [README.md](README.md) — User-facing: what Walter is, installation, usage

## Status

- 1 skill, 9 commands, 6 agents, 12 references — all functional
- Build system: 4 providers, placeholders, conditionals, auto-copy, ZIPs
- Site: Astro, OG image, SEO meta, sitemap, favicons, 404
- Plugin: marketplace.json + plugin.json ready
- Quality: lint + build pass clean, Husky pre-commit hooks enforced
- CI: GitHub Actions on PR and push to main
- Repo: README, DEVELOP.md, CONTRIBUTING.md, SECURITY.md, issue/PR templates — all in place

## Known Issues

- YAML parser doesn't strip quotes (latent — round-trip works)
- No build transformation validation (output not verified beyond "it runs")
- Provider abstraction leaks (TOML special case in build.js)
- Duplicate transform functions in build.js (~80% shared logic)
- Single-provider build doesn't clean stale output from other providers

## Next

Deploy walter.cooking via Vercel, then first commit to GitHub.

### Remaining Before Release

- **Vercel deployment** — walter.cooking live, build command configured, domain pointed
- **Content audit** — Walk every skill, command, agent, reference for tone, accuracy, completeness
- **Frontmatter descriptions** — Audit all command and agent descriptions for clarity. These are what users and agents see first — clear and accurate, not gimmicky
- **Heisenberg evolution** — Make write-capable, expand agent definition. Walter's subconscious — same thinking and discipline, can do real work (not just read-only advisory). Deep systems thinking + execution

### Future

**Developer Experience**
- install.sh — Interactive installer (choose provider, target dir, global vs local)
- Build validation — Verify transforms produce correct output, not just that they run

**Extensions**
- Hooks in SKILL.md frontmatter (Claude Code lifecycle events)
- Gemini extension manifest (gemini-extension.json)
- Codex path migration (.codex/prompts/ → .agents/skills/)
- Provider-specific rules

**Bigger Bets & Deferred**
- walter-mcp — Optional MCP server with @modelcontextprotocol/server-memory, queryable graph
- Website download API — On-demand ZIP generation per provider

## Processes

**The loop:** scope → break down → build → verify → hand off. Load Walter (`/walter`), define the problem (`/formula`), decompose it (`/prep`), build with discipline (`/cook`), verify against intent (`/purity`), seal context (`/stash`). Use `/probe` when you need research and `/trace` when something's broken. Every significant piece of work follows this loop — the ceremony scales with the stakes, but the thinking is always the same.

**Making changes:** Edit `src/`, run `npm run build`, test with the relevant provider, run `npm run lint`. Husky catches lint and format issues at commit time. See [DEVELOP.md](DEVELOP.md) for architecture and source format.

**Keeping docs current:** CLAUDE.md is the bootstrap — status, next action, where to look. Technical detail lives in [DEVELOP.md](DEVELOP.md). Contribution process lives in [CONTRIBUTING.md](CONTRIBUTING.md). If it doesn't help the next agent take their first action, it doesn't belong in CLAUDE.md.
