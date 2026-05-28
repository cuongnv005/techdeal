---
name: clean-code
description: Enforce clean code standards in this Nuxt 4 codebase. USE THIS SKILL whenever the user asks to refactor code, fix code quality issues, review style/naming, or write new code that must follow project conventions. Apply these rules to every file you create or modify — TypeScript, Vue, or utility classes.
---

# Clean Code Skill

All rules are derived from the actual conventions in this codebase (`eslint.config.cjs`, `.prettierrc`, `commitlint.config.ts`, and the patterns found in `features/`, `shared/`, `stores/`, and `core/`).

---

## 1. Formatting (Prettier)

The project enforces Prettier automatically. Never fight the formatter — match these settings in every file you write:

| Setting         | Value                                 |
| --------------- | ------------------------------------- |
| `semi`          | `false` — no semicolons               |
| `singleQuote`   | `true` — always single quotes         |
| `trailingComma` | `none` — no trailing commas           |
| `printWidth`    | `100`                                 |
| `tabWidth`      | `2` spaces, no tabs                   |
| `arrowParens`   | `always` — `(x) => x`, never `x => x` |
| `endOfLine`     | `lf`                                  |

```ts
// BAD
const greet = (name) => {
  return 'Hello ' + name
}

// GOOD
const greet = (name: string): string => {
  return 'Hello ' + name
}
```

---

## 2. TypeScript

### 2.1 Never use `any` for domain types

`any` is allowed only in `eslint.config.cjs` tool configuration. In application code — types, stores, features, shared utils — always use explicit types.

```ts
// BAD
const user: any = {}
function handle(data: any) {}

// GOOD
interface UserState {
  id: string | null
  username: string | null
  email: string | null
  isAuthenticated: boolean
}
```

### 2.2 Always type imports separately

ESLint enforces `@typescript-eslint/consistent-type-imports`. Type-only imports must use `import type`.

```ts
// BAD
import { Post } from '@features/posts/types/post.type'
import { AxiosResponse } from 'axios'

// GOOD
import type { Post } from '@features/posts/types/post.type'
import type { AxiosResponse } from 'axios'
```

### 2.3 Return types on class methods and functions

Always annotate return types on class methods, store actions, and utility functions. Inference alone is not enough for maintainability.

```ts
// BAD
startLoading() {
  this.isLoading = true
}

// GOOD
startLoading(): void {
  this.isLoading = true
}
```

### 2.4 Use `interface` for object shapes, `type` for unions/aliases

```ts
// Shape of a domain entity → interface
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

// Alias / union → type
export type Future<T> = Promise<AxiosResponse<ResponseData<T>>>
```

### 2.5 No `var`

ESLint rule `no-var: error`. Always use `const` or `let`.

---

## 3. Import Order

ESLint (`import-x/order`) enforces alphabetical ordering with mandatory blank lines between groups:

```
1. builtin / external  (vue, axios, dayjs, …)
2. @core / @shared / @stores
3. @features/…
4. Sibling / relative
5. type imports (last)
```

```ts
// BAD — mixed, no blank lines
import { PostRepoImpl } from '@features/posts/api/post'
import { HttpService } from '@core/api/service'
import type { Post } from '@features/posts/types/post.type'

// GOOD
import { HttpService } from '@core/api/service'

import { PostRepoImpl } from '@features/posts/api/post'

import type { Post } from '@features/posts/types/post.type'
```

Never use relative `../../../` imports to cross feature/layer boundaries — always use path aliases (`@core`, `@features`, `@shared`, `@stores`).

---

## 4. Naming Conventions

### Files

| Artifact        | Convention                 | Example                           |
| --------------- | -------------------------- | --------------------------------- |
| Vue component   | `kebab-case.vue`           | `card-post.vue`                   |
| Feature page    | `kebab-case.vue`           | `list.vue`, `login.page.vue`      |
| Type file       | `<entity>.type.ts`         | `post.type.ts`, `common.type.ts`  |
| Composable      | `use-<entity>.ts`          | `use-post.ts`, `use-translate.ts` |
| Constants file  | `<scope>.contants.ts`      | `app.contants.ts`                 |
| Store           | `<entity>.ts`              | `user.ts`, `ui.ts`                |
| Utility service | `<name>.ts` (class inside) | `formatter.ts`, `helper.ts`       |
| Repository      | `<entity>.ts`              | `post.ts`                         |

### Variables & Functions

```ts
// Composables — camelCase, prefixed use-
export async function usePost() { … }
export function useTranslate() { … }

// Store — camelCase, prefixed use, suffixed Store
export const useUserStore = defineStore('user', { … })

// Utility singletons — PascalCase class exported as PascalCase const
class FormatterService { … }
export const Formatter = new FormatterService()

// Booleans — prefix is / has / can
isLoading, isAuthenticated, hasError, canSubmit

// Events in templates — kebab-case
@click="handleSubmit"
@update:model-value="onValueChange"
```

---

## 5. Vue Component Rules

### 5.1 Block order in `.vue` files

ESLint rule `vue/block-order` enforces this exact order:

```vue
<script setup lang="ts">
// 1. imports
// 2. interface Props / interface Emits
// 3. defineProps / defineEmits / withDefaults
// 4. composables / stores
// 5. reactive state (ref, reactive, computed)
// 6. functions / handlers
// 7. lifecycle hooks (onMounted, watch, …)
</script>

<template>
  <!-- markup -->
</template>
```

### 5.2 Props always typed with interface

```vue
<!-- BAD -->
<script setup>
defineProps(['data', 'loading'])
</script>

<!-- GOOD -->
<script setup lang="ts">
import type { Post } from '@features/posts/types/post.type'

interface Props {
  data: Post
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})
</script>
```

### 5.3 Template must handle loading and error states

When data comes from a composable that exposes `isLoading` / `error`, the template must handle them:

```vue
<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <template v-else>
    <!-- actual content -->
  </template>
</template>
```

### 5.4 `lang="ts"` is mandatory on every `<script setup>`

```vue
<!-- BAD -->
<script setup>

<!-- GOOD -->
<script setup lang="ts">
```

---

## 6. Shared Utility Classes

Cross-feature utilities live in `shared/utils/`. They are **class-based singletons** with JSDoc on every method — never loose exported functions.

```ts
// BAD — loose function
export function formatCoin(value: number): string { … }

// GOOD — service class, exported as singleton
class FormatterService {
  /**
   * Formats a number as a coin value with appropriate decimals
   * @param value - The number to format
   * @param digits - Number of decimal places to keep
   * @returns Formatted string representation of the number
   */
  formatCoin(value: number, digits = 2): string {
    if (value === undefined || value === null || isNaN(value)) {
      return '0'
    }
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: digits
    }).format(value)
  }
}

export const Formatter = new FormatterService()
```

Usage: `Formatter.formatCoin(1234.5)` — never re-instantiate.

---

## 7. Pinia Stores

```ts
// Pattern: defineStore with typed state interface, explicit return types on actions
import { defineStore } from 'pinia'

interface UiState {
  isLoading: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    isLoading: false
  }),

  actions: {
    startLoading(): void {
      this.isLoading = true
    },
    stopLoading(): void {
      this.isLoading = false
    }
  }
})
```

- State typed with a local `interface`, never inline object type.
- Actions always have explicit `void` / return-type annotation.
- Getters return typed values: `(state): Partial<UserState> => ({ … })`.
- Store name matches file name (`'user'` → `user.ts`, `'ui'` → `ui.ts`).

---

## 8. Dead Code & Comments

- **Remove commented-out code before committing.** The codebase uses version control; dead code in comments adds noise.
- Exception: a `// TODO: reason` comment with a ticket reference is acceptable.
- Never leave `console.log` in production paths — use `console.error` only inside catch blocks where the error is genuinely unrecoverable.

```ts
// BAD — committed dead code
// export const timeLocal = (value: string) => { … }
// dayjs.extend(utc)

// GOOD — deleted, or tracked in a TODO
// TODO(PROJ-123): re-enable UTC formatting once dayjs plugin is configured
```

---

## 9. Commit Message Format

Project uses Conventional Commits via `commitlint`:

```
<type>(<scope>): <subject>

Types: feat | fix | refactor | chore | docs | test | style | ci | perf
```

```
# BAD
git commit -m "fix stuff"
git commit -m "Update post component"

# GOOD
git commit -m "feat(posts): add detail page with useAsyncData"
git commit -m "fix(auth): handle 401 redirect on token expiry"
git commit -m "refactor(shared): extract Formatter as singleton service"
```

---

## 10. Clean Code Checklist

- [ ] No semicolons, single quotes, no trailing commas, 2-space indent
- [ ] All `import type` for type-only imports
- [ ] Import groups separated by blank lines, alphabetical within group
- [ ] No `var` — use `const` / `let` only
- [ ] No `any` in domain code (features, shared, stores, core)
- [ ] Every class method and store action has an explicit return type
- [ ] Vue `<script setup>` always has `lang="ts"`
- [ ] Props typed with a local `interface Props` + `withDefaults(defineProps<Props>(), {})`
- [ ] Templates handle `isLoading` + `error` states when data is async
- [ ] Shared utilities are class-based singletons in `shared/utils/` with JSDoc
- [ ] Pinia store state typed with a named interface, actions typed with return type
- [ ] No commented-out dead code committed
- [ ] Commit messages follow Conventional Commits: `type(scope): subject`
