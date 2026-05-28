# Nuxt 4 Base

Feature-based Nuxt 4 starter. **Details live in [`docs/`](docs/overview.md)** — avoid duplicating them here.

## Documentation

- [Overview](docs/overview.md) — stack, structure, dev entry
- [Architecture](docs/architecture.md) — layers, data flow, rules
- [Setup](docs/setup.md) — env, scripts, troubleshooting
- [Conventions](docs/conventions.md) — code style, naming, imports
- [`.agents/skills/`](.agents/skills/) — AI / team playbooks (features, forms, etc.)

## Quick start

```bash
cp .env.example .env
yarn install
yarn dev
```

Node 18+ and Yarn 1.x. Configure `.env` and other commands → [docs/setup.md](docs/setup.md).

## UI and forms

- UI primitives are organized under `shared/ui/*` (for example `button`, `input`, `form`).
- The project uses `shadcn-nuxt` + Tailwind CSS 4 for primitive generation/styling.
- Form handling and validation use `vee-validate` + `zod`.
