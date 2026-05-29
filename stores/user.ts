import { defineStore } from 'pinia'
import { useCookie } from '#app'

import { HttpService } from '@core/api/service'

interface UserState {
  id: string | null
  username: string | null
  email: string | null
  role: 'admin' | 'mod' | 'user' | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    username: null,
    email: null,
    role: null,
    isAuthenticated: false
  }),

  getters: {
    getUserProfile: (state): Partial<UserState> => ({
      id: state.id,
      username: state.username,
      email: state.email,
      role: state.role
    })
  },

  actions: {
    initializeAuth() {
      const tokenCookie = useCookie<string | null>('token')
      const userCookie = useCookie<any>('user_info')
      const token = tokenCookie.value
      const savedUser = userCookie.value

      if (token && savedUser) {
        try {
          const parsed = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser
          this.id = parsed.id
          this.username = parsed.username
          this.email = parsed.email
          this.role = parsed.role
          this.isAuthenticated = true
          
          if (process.client) {
            HttpService.setHeaders({
              Authorization: `Bearer ${token}`
            })
          }
        } catch (e) {
          this.logout()
        }
      }
    },

    setAuth(
      token: string,
      user: { id: string; username: string; email: string; role: 'admin' | 'mod' | 'user' }
    ) {
      this.id = user.id
      this.username = user.username
      this.email = user.email
      this.role = user.role
      this.isAuthenticated = true

      const tokenCookie = useCookie('token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie('user_info', { maxAge: 60 * 60 * 24 * 7 })
      tokenCookie.value = token
      userCookie.value = JSON.stringify(user)

      if (process.client) {
        HttpService.setHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    },

    logout() {
      this.id = null
      this.username = null
      this.email = null
      this.role = null
      this.isAuthenticated = false

      const tokenCookie = useCookie('token')
      const userCookie = useCookie('user_info')
      tokenCookie.value = null
      userCookie.value = null

      if (process.client) {
        HttpService.setHeaders({})
      }
    }
  }
})
