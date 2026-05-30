import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

interface HttpErrorPayload {
  message?: string
}

class HttpModule {
  private readonly instance: AxiosInstance

  constructor(baseURL: string, timeout: number = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout
    })

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Handle custom success: false response from API for invalid/expired tokens
        if (response?.data && response.data.success === false) {
          const err = response.data.error || response.data.message
          if (err === 'Token không hợp lệ hoặc đã hết hạn') {
            if (process.client) {
              import('@stores/user').then(({ useUserStore }) => {
                const userStore = useUserStore()
                userStore.logout()
                window.location.reload()
              })
            }
          }
        }

        if (response?.status !== 200) {
          Toast.error({ message: response.data.message })
          if (response?.status === 404) {
            showError({ statusCode: 404 })
          } else if (response?.status === 500) {
            showError({ statusCode: 500 })
          } else if (response?.status === 401) {
            if (process.client) {
              import('@stores/user').then(({ useUserStore }) => {
                const userStore = useUserStore()
                userStore.logout()
                window.location.reload()
              })
            }
          }
        }
        return response
      },
      (error: AxiosError) => {
        const message: string | undefined = (error?.response?.data as HttpErrorPayload)?.message
        if (message) {
          Toast.error({ message })
        }
        if (error.response?.status === 401) {
          if (process.client) {
            import('@stores/user').then(({ useUserStore }) => {
              const userStore = useUserStore()
              userStore.logout()
              window.location.reload()
            })
          }
        }
        return Promise.reject(error)
      }
    )
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

export default HttpModule
