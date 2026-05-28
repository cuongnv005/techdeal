# Project overview

## What this is

**Nuxt 4 Base** is a starter / template for product apps. It uses a **feature-based layout**: domain code lives under `features/`, while routing and Nuxt shell stay in `app/`. Shared UI and helpers sit in `shared/`; HTTP, storage, and other adapters live in `core/`.

## Technology stack

| Area               | Choice                                      |
| ------------------ | ------------------------------------------- |
| Framework          | Nuxt 4                                      |
| State              | Pinia                                       |
| Styling            | Tailwind CSS 4, SCSS                        |
| UI primitives      | `shadcn-nuxt`, `reka-ui`, `lucide-vue-next` |
| Forms & validation | `vee-validate`, `@vee-validate/zod`, `zod`  |
| HTTP               | Axios (via `core/api`)                      |
| i18n               | `@nuxtjs/i18n`                              |
| Observability      | Sentry                                      |

## Architecture at a glance

```text
app → features → shared → core
```

- **`app/`** — Routes, layouts, `app.vue`, app-scoped assets. Pages should stay thin and delegate to feature pages.
- **`features/<name>/`** — One folder per domain (e.g. `auth`, `posts`): pages, components, composables, feature APIs.
- **`shared/`** — Reusable composables, UI primitives (`shared/ui/*`), utils, types, constants (no single-feature business rules).
- **`core/`** — Infrastructure only (e.g. `HttpService`, storage). No product/domain logic.

**Dependency rule:** `shared` and `core` must not import from `features`.

## Repository map (short)

| Path          | Role                                             |
| ------------- | ------------------------------------------------ |
| `app/pages/`  | Route files → usually render feature pages       |
| `features/*/` | Business modules                                 |
| `shared/`     | Cross-feature code (partially auto-imported)     |
| `core/`       | API & storage adapters                           |
| `stores/`     | Global Pinia stores                              |
| `i18n/`       | Locales                                          |
| `server/`     | Nitro server routes / middleware                 |
| `public/`     | Static assets; icons feed `generated/icons.json` |

For naming and coding rules, see **[docs/conventions.md](./conventions.md)**.

## Local development

**Requirements:** Node.js 18+ (20+ recommended), Yarn 1.x.

```bash
yarn install && yarn dev
```

Other scripts: `yarn build`, `yarn preview`, `yarn lint`.

## Further reading

- **[docs/architecture.md](./architecture.md)** — Layers, data flow, dependency rules.
- **[docs/setup.md](./setup.md)** — Environment variables and scripts.
- **[docs/conventions.md](./conventions.md)** — Naming, TypeScript, Vue, imports.
- **README.md** — Full source tree and technical notes.
- **`.agents/skills/`** — Features, forms, metadata, clean code.
