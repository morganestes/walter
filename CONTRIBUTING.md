# Contributing to Walter

Thanks for your interest in Walter. Here's how to get involved.

---

## Getting Started

```bash
git clone https://github.com/derekherman/walter.git
cd walter
npm install
npm run build
```

See [DEVELOP.md](DEVELOP.md) for the full architecture, build system, and source format.

---

## Making Changes

1. Edit files in `src/` — never edit `dist/` or `.claude/` directly
2. Run `npm run build` to regenerate output
3. Test with the relevant provider
4. Run `npm run lint` to verify

Husky pre-commit hooks enforce lint and formatting automatically.

---

## Adding Content

| What | Where | Guide |
| ---- | ----- | ----- |
| Command | `src/commands/{name}.md` | [DEVELOP.md — Adding Content](DEVELOP.md#adding-content) |
| Agent | `src/agents/{name}.md` | [DEVELOP.md — Adding Content](DEVELOP.md#adding-content) |
| Reference | `src/skills/walter/references/{name}.md` | [DEVELOP.md — Adding Content](DEVELOP.md#adding-content) |

---

## Pull Requests

- Keep PRs focused — one concern per PR
- Use a descriptive title that explains what and why
- Fill out the PR template checklist
- Ensure `npm run lint` and `npm run build` pass

---

## Code Style

- **JavaScript** (scripts/): CommonJS, ESLint enforced
- **TypeScript** (src/): Strict mode, ESLint + typescript-eslint
- **Astro** (src/): eslint-plugin-astro
- **Formatting**: Prettier for all file types
- **Markdown**: markdownlint

Match existing patterns. Husky catches issues at commit time.

---

## Reporting Issues

- **Bugs and feature requests**: [GitHub Issues](https://github.com/derekherman/walter/issues)
- **Security vulnerabilities**: See [SECURITY.md](SECURITY.md)

---

## License

By contributing, you agree that your contributions will be licensed under the [Apache 2.0 License](LICENSE).
