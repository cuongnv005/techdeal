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
