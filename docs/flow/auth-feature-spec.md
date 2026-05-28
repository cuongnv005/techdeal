# 🔐 Auth Feature — AI Executable Spec

## 1. Scope (STRICT)

This feature ONLY includes:

- login
- logout
- get current user (`/api/me`)
- auth middleware

❌ Excluded:

- register
- refresh token
- roles/permissions

---

## 2. Source of Truth

`useAuth()` = SINGLE SOURCE OF TRUTH

- All auth state and logic MUST live here
- No duplication allowed anywhere else

---

## 3. Module Structure

```bash
features/auth/
├── api/auth.api.ts
├── composables/use-auth.ts
├── middleware/auth.ts
├── pages/login.vue
├── types/auth.type.ts
```

---

## 4. Data Model

```ts
export interface User {
  id: number
  name: string
  email: string
}
```

```ts
export interface LoginDto {
  email: string
  password: string
}
```

---

## 5. API Binding (DO NOT CHANGE)

```ts
const API = {
  LOGIN: '/api/login',
  ME: '/api/me',
  LOGOUT: '/api/logout'
}
```

---

## 6. API Contract

`POST /api/login`

Request:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "type": "token",
  "access_token": "string"
}
```

---

`GET /api/me`

Response:

```json
{
  "id": 1,
  "name": "string",
  "email": "string"
}
```

---

`POST /api/logout`

Response:

```json
{
  "success": true
}
```

---

## 7. State Contract

```ts
type AuthState = {
  user: User | null
  isAuthenticated: boolean
}
```

---

## 8. Behavior Contract (STRICT)

`login()`

INPUT: `LoginDto`  
OUTPUT: `void`

SIDE EFFECT:

- set cookie `"access_token"`
- set access_token to call `HttpService.setHeaders({Authorization: 'Bearer ' + access_token})`
- call `me()`
- redirect `"/"`

ERROR:

- throw error.message

---

`me()`

INPUT: none  
OUTPUT: `User`

SIDE EFFECT:

- set user state

ERROR:

- if 401 → clear user

---

`logout()`

INPUT: none  
OUTPUT: `void`

SIDE EFFECT:

- call API
- clear user
- remove cookie
- redirect `"/login"`

---

## 9. Implementation Blueprint

`auth.api.ts`

```ts
export const loginApi = (payload: LoginDto) => HttpService.post(API.LOGIN, payload)

export const meApi = () => HttpService.get<User>(API.ME)

export const logoutApi = () => HttpService.post(API.LOGOUT)
```

---

`use-auth.ts`

```ts
export const useAuth = () => {
  const user = useState<User | null>('user', () => null)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (payload: LoginDto) => {
    try {
      const { access_token } = await loginApi(payload)

      useCookie('access_token').value = access_token

      await me()

      await navigateTo('/')
    } catch (err: any) {
      throw new Error(err?.message || 'Login failed')
    }
  }

  const me = async () => {
    try {
      const data = await meApi()
      user.value = data
      return data
    } catch (err: any) {
      if (err?.status === 401) {
        user.value = null
      }
      throw err
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      user.value = null
      useCookie('access_token').value = null
      await navigateTo('/login')
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    me,
    logout
  }
}
```

---

## 10. App Initialization (CRITICAL)

```ts
onMounted(async () => {
  const token = useCookie('access_token').value

  if (token) {
    try {
      await useAuth().me()
    } catch (_) {}
  }
})
```

---

## 11. Hard Constraints (MUST NOT BREAK)

- Do NOT call API outside `auth.api.ts`
- Do NOT create state outside `useAuth()`
- Do NOT skip `me()` after login
- Do NOT use localStorage
- Do NOT call API in template

---

## 12. Acceptance Criteria

- Login success → redirect `"/"`
- Refresh → user persists
- Protected route → requires auth
- Logout → clears session
- Invalid token → auto logout

---

## 13. AI Execution Order

1. types
2. api
3. composable
4. middleware
5. page
6. app init
