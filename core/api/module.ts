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

    // Tắt keep-alive cho các request phía server (SSR trên Vercel gọi sang Cloudflare Worker).
    // Lý do: môi trường serverless "đóng băng" instance giữa các lần gọi, khiến socket keep-alive
    // cũ có thể đã bị phía xa đóng âm thầm — lần gọi sau tái sử dụng đúng socket chết đó và treo
    // tới khi hết timeout (triệu chứng: "reusedSocket: true" trong lỗi ECONNABORTED).
    // QUAN TRỌNG: 'http'/'https' là module Node, không tồn tại trong trình duyệt. File này chạy
    // cả ở client lẫn server nên KHÔNG được import tĩnh ở đầu file (Vite sẽ "externalize" và
    // crash ngay khi truy cập http.Agent trong bundle client). Dùng dynamic import + process.server
    // để module này chỉ được tải khi chạy trong Node (SSR), không bao giờ chạy ở trình duyệt.
    if (process.server) {
      Promise.all([import('http'), import('https')]).then(([http, https]) => {
        this.instance.defaults.httpAgent = new http.Agent({ keepAlive: false })
        this.instance.defaults.httpsAgent = new https.Agent({ keepAlive: false })
      })
    }

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
        const status = error.response?.status
        const msg = (
          (error?.response?.data as HttpErrorPayload)?.message ||
          error.message ||
          ''
        ).toLowerCase()

        // Kiểm tra lỗi Backend sập, timeout, network error hoặc chạm trần D1 row read
        const isMaintenanceError =
          !error.response ||
          [500, 502, 503, 504].includes(status as number) ||
          msg.includes('d1') ||
          msg.includes('row read') ||
          msg.includes('rate limit') ||
          msg.includes('network error') ||
          msg.includes('econnrefused') ||
          msg.includes('etimedout')

        if (isMaintenanceError) {
          if (process.client) {
            import('@shared/composables/use-maintenance').then(({ useMaintenance }) => {
              const { triggerMaintenance } = useMaintenance()
              triggerMaintenance()
            })
          }
        }

        if (status === 401) {
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
