# Architecture

This document describes how the codebase is layered, how data flows through a typical feature, and where global concerns live. For a shorter summary, see [overview.md](./overview.md).

## Goals

- Keep **domain logic** inside `features/<name>/`.
- Keep the **Nuxt shell** (`app/`) thin: routing and layout only.
- Share **generic building blocks** via `shared/`.
- Isolate **HTTP, storage, and adapters** in `core/`.

## Layer model

```text
app → features → shared → core
```

| Layer         | Depends on             | Must not                      |
| ------------- | ---------------------- | ----------------------------- |
| `app/`        | features, shared, core | Contain heavy business logic  |
| `features/*/` | shared, core           | Be imported by shared or core |
| `shared/`     | core (sparingly)       | Import features               |
| `core/`       | —                      | Import features or shared     |

**Invariant:** `shared` and `core` never depend on `features`.

## Directory roles

### `app/`

Nuxt entry surface: `app.vue`, `error.vue`, layouts, global assets, and **`app/pages/`** route files.

Route files should **only** wire URLs to feature pages (import + render). No API calls or repository logic here.

### `features/<feature>/`

Vertical slice per domain. Reference layout (see `features/posts/`):

```text
features/<feature>/
├── types/        # Domain interfaces (<entity>.type.ts)
├── api/          # Repository contract + Impl (HttpService)
├── composables/  # useAsyncData + repo (use-<entity>.ts)
├── components/   # Feature-scoped UI
└── pages/        # Screens consumed by app/pages
```

- **Types** — Named `interface` per entity; no `any`.
- **API** — Abstract repository + implementation class using `HttpService` from `@core/api/service` (not raw `axios` in features).
- **Composables** — Async composables wrapping `useAsyncData` with stable keys and `{ server: true }` where appropriate.
- **Pages** — Full screens; matched from thin `app/pages` routes.

### `shared/`

Cross-feature code: composables, UI primitives, utils, types, constants. Parts of `shared/utils` and `shared/ui` are auto-imported (see `nuxt.config.ts`).

### `core/`

Infrastructure: Axios module, `HttpService`, storage adapters. No product rules or feature-specific URLs beyond generic client configuration.

### Other roots

| Path         | Purpose                                                               |
| ------------ | --------------------------------------------------------------------- |
| `stores/`    | Pinia stores for cross-cutting app state                              |
| `i18n/`      | Locale files and i18n config                                          |
| `server/`    | Nitro API routes and middleware                                       |
| `public/`    | Static assets; icons under `public/icons` feed `generated/icons.json` |
| `generated/` | Generated artifacts (do not hand-edit without knowing the pipeline)   |

## Typical request flow (feature CRUD)

1. User opens a route → **`app/pages/...vue`** renders a feature page from **`features/.../pages/...vue`**.
2. The page calls **`use<Entity>()`** (or similar) from **`features/.../composables/`**.
3. The composable uses **`useAsyncData`** and a **repository Impl** from **`features/.../api/`**.
4. The repository calls **`HttpService`** → **`core/api`** → backend **`VITE_API_URL`**.
5. UI shows loading / error / data per composable contract.

## State and i18n

- **Pinia** — Global state in `stores/`; feature-local state can stay in composables or feature stores if you introduce them consistently.
- **i18n** — Strings and locale switching via `@nuxtjs/i18n` under `i18n/`.

## Related docs

- [setup.md](./setup.md) — Environment and run commands.
- [conventions.md](./conventions.md) — Naming, imports, TypeScript and Vue rules.
- [feature-implementation skill](../.agents/skills/feature-implementation/SKILL.md) — Step-by-step feature scaffolding.
