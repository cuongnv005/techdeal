import type { AxiosResponse } from 'axios'
import axios, { type AxiosError, type AxiosInstance } from 'axios'

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
        if (response?.status !== 200) {
          Toast.error({ message: response.data.message })
          if (response?.status === 404) {
            showError({ statusCode: 404 })
          } else if (response?.status === 500) {
            showError({ statusCode: 500 })
          } else if (response?.status === 401) {
            console.log('UNAUTHORIZED')
            // StorageService.clearStorage()
            // window.location.reload()
          }
        }
        return response
      },
      (error: AxiosError) => {
        const message: string | undefined = (error?.response?.data as HttpErrorPayload)?.message
        if (message) {
          Toast.error({ message })
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
