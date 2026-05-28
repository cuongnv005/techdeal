---
name: feature-implementation
description: Implement new features in Nuxt projects following feature-based architecture. USE THIS SKILL whenever the user asks to add a feature, create a new page, implement CRUD operations, build a listing/detail/form page, or scaffold any new domain module in Nuxt. Also trigger when the user mentions repository pattern, composables, useAsyncData, or asks how to structure a Nuxt feature. Do NOT skip this skill for "simple" features — the architecture rules apply universally.
---

# Feature Implementation Skill

Feature-based vertical-slice architecture. Every feature is self-contained under `features/<feature>/`. The real reference implementation is `features/posts/`.

---

## 1. Directory Structure

```
features/<feature>/
├── types/
│   └── <entity>.type.ts          # TypeScript interfaces for the domain
├── api/
│   └── <entity>.ts               # Abstract repository + Impl class
├── composables/
│   └── use-<entity>.ts           # async composable wrapping useAsyncData
├── components/
│   └── <component-name>.vue      # Typed, self-contained UI components
└── pages/
    └── <view>.vue                # Feature page, consumed by app/pages/
```

App router entry: `app/pages/<route>.vue` — imports and renders the feature page only. Zero logic.

---

## 2. Layer Rules & Real Code

### 2.1 Type — `types/<entity>.type.ts`

Define a named `interface` for every domain entity. No `any`, no loose objects.

```ts
// features/posts/types/post.type.ts
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}
```

---

### 2.2 API / Repository — `api/<entity>.ts`

- Abstract class declares the contract.
- `Impl` class implements it using `HttpService` from `@core/api/service`.
- Methods return `Promise<Future<Entity[]>>` (Axios response wrapper).
- Always type the `endpoint` as a `private readonly` string.
- All CRUD methods go here: `list`, `get`, `create`, `update`, `delete`.

```ts
// features/posts/api/post.ts
import { HttpService } from '@core/api/service'
import type { Post } from '@features/posts/types/post.type'

export abstract class PostRepository {
  abstract list(query: Record<string, any>): Promise<Future<Post[]>>
  abstract get(id: number): Promise<Future<Post>>
  abstract create(data: Partial<Post>): Promise<Future<Post>>
  abstract update(id: number, data: Partial<Post>): Promise<Future<Post>>
  abstract delete(id: number): Promise<Future<void>>
}

export class PostRepoImpl implements PostRepository {
  private readonly endpoint = '/posts'

  list(query: Record<string, any>): Promise<Future<Post[]>> {
    return HttpService.get(this.endpoint, query)
  }

  get(id: number): Promise<Future<Post>> {
    return HttpService.get(`${this.endpoint}/${id}`)
  }

  create(data: Partial<Post>): Promise<Future<Post>> {
    return HttpService.post(this.endpoint, data)
  }

  update(id: number, data: Partial<Post>): Promise<Future<Post>> {
    return HttpService.put(`${this.endpoint}/${id}`, data)
  }

  delete(id: number): Promise<Future<void>> {
    return HttpService.delete(`${this.endpoint}/${id}`)
  }
}
```

> `HttpService` is a singleton `HttpAxiosService` from `@core/api/service`. Never import `axios` directly in feature code.

---

### 2.3 Composable — `composables/use-<entity>.ts`

- Always `async` function (so the feature page can `await` it with Suspense).
- Instantiate Repo inside the composable.
- Wrap calls in `useAsyncData` with a **unique string key** and `{ server: true }`.
- Expose `data`, `isLoading`, `error` — rename destructured fields immediately.
- Return only what the page/component needs.

```ts
// features/posts/composables/use-post.ts
import { PostRepoImpl } from '@features/posts/api/post'

export async function usePost() {
  const postRepo = new PostRepoImpl()

  const {
    data: posts,
    pending: isLoading,
    error
  } = await useAsyncData(
    'posts',
    async () => {
      const resp = await postRepo.list({})
      return resp.data
    },
    { server: true, default: () => [] }
  )

  return { posts, isLoading, error }
}
```

**Key rules:**

- `useAsyncData` key must be globally unique — use `'<feature>-<action>'` convention, e.g. `'posts-list'`, `'posts-detail'`.
- `default: () => []` (or `null`) prevents undefined during SSR hydration.
- Do **not** call `useFetch` or raw `fetch()` in composables.

---

### 2.4 Component — `components/<name>.vue`

- `<script setup lang="ts">` always.
- Import type from `@features/<feature>/types/<entity>.type`.
- Define a local `interface Props` and pass it to `defineProps<Props>()`.
- Use `withDefaults(defineProps<Props>(), {})` when you need defaults.
- No prop defined as a plain string (`defineProps(['data'])` is forbidden).

```vue
<!-- features/posts/components/card-post.vue -->
<script setup lang="ts">
import type { Post } from '@features/posts/types/post.type'

interface Props {
  data: Post
}

withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div>
    <el-text>{{ data.title }}</el-text>
    <el-text>{{ data.body }}</el-text>
  </div>
</template>
```

---

### 2.5 Feature Page — `pages/<view>.vue`

- `await` the composable (Nuxt Suspense handles SSR).
- Import components with `@features` alias.
- Handle `isLoading` / `error` states.
- **No business logic here** — only layout + wiring.

```vue
<!-- features/posts/pages/list.vue -->
<script setup lang="ts">
import CardPost from '@features/posts/components/card-post.vue'
import { usePost } from '@features/posts/composables/use-post'

const { posts, isLoading, error } = await usePost()
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <template v-else>
    <card-post v-for="post in posts" :key="post.id" :data="post" />
  </template>
</template>
```

---

### 2.6 App Router Entry — `app/pages/<route>.vue`

One import. One component. Nothing else.

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import ListPostPage from '@features/posts/pages/list.vue'
</script>

<template>
  <list-post-page />
</template>
```

---

## 3. Import Rules

| Context             | Correct                           | Forbidden               |
| ------------------- | --------------------------------- | ----------------------- |
| Feature → core      | `@core/api/service`               | `../../../core/...`     |
| Feature → own files | `@features/posts/types/post.type` | `../../types/post.type` |
| App page → feature  | `@features/posts/pages/list.vue`  | `../../features/...`    |

---

## 4. HttpService Reference

`HttpService` (from `@core/api/service`) exposes: `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`. All methods are generic — always provide type params when the return type is not inferred:

```ts
HttpService.get<Params, Future<Post[]>>(url, params)
```

Never import `axios` directly inside a `features/` file.

---

## 5. Bad vs Good Quick Reference

### Feature location

```
BAD:  components/PostCard.vue  /  pages/PostList.vue
GOOD: features/posts/components/card-post.vue  /  features/posts/pages/list.vue
```

### API call

```ts
// BAD — direct fetch in component
const { data } = await useFetch('/api/posts')

// GOOD — through repository in composable
const resp = await postRepo.list({})
return resp.data
```

### Props

```ts
// BAD
defineProps(['data'])

// GOOD
interface Props {
  data: Post
}
withDefaults(defineProps<Props>(), {})
```

### Types

```ts
// BAD
const post: any = {}

// GOOD
import type { Post } from '@features/posts/types/post.type'
const post: Post = { ... }
```

---

## 6. Checklist Before Submitting

- [ ] `features/<feature>/` has all 5 sub-folders: `types/`, `api/`, `composables/`, `components/`, `pages/`
- [ ] Type file exports named `interface`, not `type` alias, no `any`
- [ ] Repository: abstract class + `Impl` class; only `HttpService`, no bare `axios`
- [ ] All CRUD methods present on the abstract class that are needed
- [ ] Composable is `async`, uses `useAsyncData` with unique key, `server: true`, and a `default`
- [ ] Composable renames `data →` meaningful name (`posts`, `user`, …) and `pending → isLoading`
- [ ] Feature page `await`s composable, handles `isLoading` + `error` states
- [ ] `app/pages/<route>.vue` contains only one import and renders one component — zero logic
- [ ] All imports use `@features` / `@core` alias — no relative `../` paths across boundaries
- [ ] All component props typed with a local `interface Props` + `defineProps<Props>()`
