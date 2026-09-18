import { useCookie } from '#app'
import { defineStore } from 'pinia'

import { HttpService } from '@core/api/service'
import { moderationRepository } from '@features/moderation/api/moderation'

interface UserState {
  id: string | null
  username: string | null
  email: string | null
  role: 'admin' | 'mod' | 'user' | null
  isAuthenticated: boolean
  blockedUserIds: string[]
  blockedUsersLoaded: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    username: null,
    email: null,
    role: null,
    isAuthenticated: false,
    blockedUserIds: [],
    blockedUsersLoaded: false
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

    async fetchBlockedUserIds(force = false): Promise<string[]> {
      if (!this.isAuthenticated) {
        this.blockedUserIds = []
        this.blockedUsersLoaded = false
        return []
      }
      if (this.blockedUsersLoaded && !force) {
        return this.blockedUserIds
      }
      try {
        const list = await moderationRepository.getBlockedUsers()
        this.blockedUserIds = list.map((u) => String(u.id))
        this.blockedUsersLoaded = true
        return this.blockedUserIds
      } catch (e) {
        console.error('Error fetching blocked users in store:', e)
        return this.blockedUserIds
      }
    },

    addBlockedUserId(id: string | number) {
      const strId = String(id)
      if (!this.blockedUserIds.includes(strId)) {
        this.blockedUserIds.push(strId)
      }
    },

    removeBlockedUserId(id: string | number) {
      const strId = String(id)
      this.blockedUserIds = this.blockedUserIds.filter((x) => x !== strId)
    },

    logout() {
      this.id = null
      this.username = null
      this.email = null
      this.role = null
      this.isAuthenticated = false
      this.blockedUserIds = []
      this.blockedUsersLoaded = false

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
