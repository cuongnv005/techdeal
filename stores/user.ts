import { defineStore } from 'pinia'

interface UserState {
  id: string | null
  username: string | null
  email: string | null
  role: 'admin' | 'mod' | 'user' | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: '1',
    username: 'Admin',
    email: 'admin@techdeal.vn',
    role: 'admin',
    isAuthenticated: true
  }),

  getters: {
    getUserProfile: (state): Partial<UserState> => ({
      id: state.id,
      username: state.username,
      email: state.email,
      role: state.role
    })
  },

  actions: {}
})
