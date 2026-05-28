# Setup

How to run the project locally, configure environment variables, and use common scripts.

## Prerequisites

| Tool    | Version                                            |
| ------- | -------------------------------------------------- |
| Node.js | 18+ (20+ recommended for Nuxt 4)                   |
| Yarn    | 1.x (`packageManager` is pinned in `package.json`) |

## Clone and install

```bash
git clone <repository-url>
cd nuxt-3-base-v2
yarn install
```

`postinstall` runs `nuxt prepare` (generates types and Nitro stubs).

## Environment variables

Copy the example file and adjust values:

```bash
cp .env.example .env
```

### Application and SEO (`process.env`)

Used at build/runtime for `nuxt.config` head metadata, site URL, and dev server port.

| Variable          | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `APP_NAME`        | Site / app title                              |
| `APP_URL`         | Canonical base URL (OG, Twitter, sitemap)     |
| `APP_DESCRIPTION` | Default meta description                      |
| `APP_AUTHOR`      | Meta author                                   |
| `APP_KEYWORDS`    | Meta keywords                                 |
| `APP_IMAGE`       | Default OG / Twitter image URL                |
| `FB_APP_ID`       | Facebook app id meta                          |
| `TWITTER_CREATOR` | Twitter creator handle                        |
| `APP_PORT`        | Dev server port (fallback in config if unset) |

### Client API base (`import.meta.env`)

| Variable        | Purpose                                                |
| --------------- | ------------------------------------------------------ |
| `VITE_API_URL`  | Base URL for `HttpService` (see `core/api/service.ts`) |
| `VITE_DEV_MODE` | Project-specific dev flag (optional)                   |

### Observability

| Variable     | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `SENTRY_DSN` | Sentry client/server DSN (see `sentry.*.config.ts`) |

Never commit secrets. Keep `.env` local; commit `.env.example` only.

## Run the app

```bash
yarn dev
```

Open the URL shown in the terminal (port follows `APP_PORT` / Nuxt defaults).

## Other scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `yarn build`    | Production build                    |
| `yarn preview`  | Serve production build locally      |
| `yarn generate` | Static generation (if used)         |
| `yarn lint`     | Prettier write + ESLint on the repo |

## Git hooks

`prepare` installs Husky. Commits may run **commitlint** (conventional commits). Follow the repo’s commit message format.

## E2E tests (optional)

Playwright is a dev dependency. Run tests per `playwright.config.ts` when you add or maintain specs (e.g. `npx playwright test`).

## Troubleshooting

- **Port in use** — Change `APP_PORT` in `.env` or stop the process using the port.
- **API errors** — Confirm `VITE_API_URL` matches your backend and CORS allows the dev origin.
- **Types after pull** — Run `yarn install` (triggers `nuxt prepare`) or `npx nuxt prepare`.

## Related docs

- [overview.md](./overview.md)
- [architecture.md](./architecture.md)
