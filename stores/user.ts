import { defineStore } from 'pinia'

interface UserState {
  id: string | null
  username: string | null
  email: string | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    username: null,
    email: null,
    isAuthenticated: false
  }),

  getters: {
    getUserProfile: (state): Partial<UserState> => ({
      id: state.id,
      username: state.username,
      email: state.email
    })
  },

  actions: {}
})
