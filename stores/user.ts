import { defineStore } from 'pinia'

import { HttpService } from '@core/api/service'
import { CookieStorage } from '@core/storage'

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
      if (process.client) {
        const token = CookieStorage.getStorage('token')
        const savedUser = CookieStorage.getStorage('user_info')
        if (token && savedUser) {
          try {
            const parsed = JSON.parse(savedUser)
            this.id = parsed.id
            this.username = parsed.username
            this.email = parsed.email
            this.role = parsed.role
            this.isAuthenticated = true
            // Set header cho HttpService Axios instance
            HttpService.setHeaders({
              Authorization: `Bearer ${token}`
            })
          } catch (e) {
            this.logout()
          }
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

      if (process.client) {
        CookieStorage.setStorage('token', token)
        CookieStorage.setStorage('user_info', JSON.stringify(user))
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

      if (process.client) {
        CookieStorage.deleteStorage('token')
        CookieStorage.deleteStorage('user_info')
        HttpService.setHeaders({})
      }
    }
  }
})
