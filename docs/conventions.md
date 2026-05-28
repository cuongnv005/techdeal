# Conventions

Coding and naming standards for this Nuxt 4 base. ESLint and Prettier enforce many of these automatically (`yarn lint`).

## Files and folders

| Artifact                | Convention         | Example                      |
| ----------------------- | ------------------ | ---------------------------- |
| Directories             | kebab-case         | `features/user-profile/`     |
| Vue components          | PascalCase.vue     | `Button.vue`, `FormItem.vue` |
| Feature pages           | kebab-case.vue     | `list.vue`, `login.page.vue` |
| Domain types            | `<entity>.type.ts` | `post.type.ts`               |
| Composables             | `use-<entity>.ts`  | `use-post.ts`                |
| Repository / API module | `<entity>.ts`      | `post.ts`                    |
| Pinia store file        | `<entity>.ts`      | `user.ts`                    |

README also mentions **`<feature>.page.vue`** for feature-owned pages; align with existing features in the repo.

## Path aliases

Use aliases instead of long relative paths across layers:

| Alias         | Points to                                            |
| ------------- | ---------------------------------------------------- |
| `@features`   | `features/`                                          |
| `@core`       | `core/`                                              |
| `#shared/...` | `shared/` (e.g. `#shared/composables/use-translate`) |
| `@validation` | `shared/validation`                                  |
| `@i18n`       | `i18n/`                                              |

Pinia stores under `stores/` are usually **auto-imported** (e.g. `useUserStore`)—no alias required.

Do not use `../../../` to reach another feature or layer.

## Import order

Group imports in this order, **alphabetically within each group**, with a **blank line** between groups:

1. External (vue, dayjs, …)
2. `@core`, `#shared/...`, store composables if imported explicitly
3. `@features/...`
4. Sibling / relative
5. `import type` last

## TypeScript

- Prefer **`interface`** for object shapes; **`type`** for unions and aliases.
- Use **`import type`** for type-only imports.
- Annotate **return types** on public functions, class methods, and store actions.
- Avoid **`any`** in app code; use explicit types or generics.
- Use **`const` / `let`** only; never `var`.

## Prettier (summary)

- No semicolons, single quotes, no trailing commas (project Prettier config).
- Print width 100, 2 spaces, LF line endings.

## Vue SFCs

- Every script block: **`<script setup lang="ts">`**.
- Block order: **script → template** (per `vue/block-order`).
- **Props** — Define a typed `interface` + `defineProps` / `withDefaults`.
- **Async data** — When the composable exposes `isLoading` / `error`, the template should handle loading and error states before main content.

Template events: **kebab-case** (`@update:model-value`).

## Shared UI primitives

- Keep reusable primitives under `shared/ui/<component>/`.
- Export each primitive from a local `index.ts` (`export { default as Button } from './Button.vue'`).
- Prefer importing from the component barrel (`@shared/ui/button`, `@shared/ui/form`) instead of deep paths.
- Keep variant logic in the same module as the primitive (for example `buttonVariants` in `shared/ui/button/index.ts`).

## Forms and validation

- Use `vee-validate` + `zod` for form validation.
- Keep generic field primitives in `shared/ui/form/` (`FormItem`, `FormLabel`, `FormControl`, `FormMessage`).
- Use `@vee-validate/zod` when binding a zod schema to a form.
- Keep feature-specific rules and schemas in the feature folder; `shared/ui/form` should stay domain-agnostic.

## Naming (runtime)

| Kind                 | Style                                |
| -------------------- | ------------------------------------ |
| Composable functions | `useSomething`                       |
| Pinia store          | `useXxxStore`                        |
| Booleans             | `isLoading`, `hasError`, `canSubmit` |
| Handlers             | `handleSubmit`, `onValueChange`      |

## Features vs shared

- Put code in **`features/<name>/`** if it describes one product domain or is only used there.
- Put code in **`shared/`** if two or more features need it and it has no domain-specific rules.
- **`core/`** stays free of business vocabulary (HTTP, cookies, low-level adapters only).

## Commits

Follow **Conventional Commits** expected by commitlint (e.g. `feat:`, `fix:`, `docs:`).

## Related docs

- [architecture.md](./architecture.md)
- [clean-code skill](../.agents/skills/clean-code/SKILL.md) — Full Prettier, ESLint, and Vue rules.
- [feature-implementation skill](../.agents/skills/feature-implementation/SKILL.md) — Repository and composable patterns.
