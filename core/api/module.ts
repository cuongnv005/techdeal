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
        if (process.client) {
          const isEn =
            window.location.pathname === '/en' || window.location.pathname.startsWith('/en/')
          config.headers['Accept-Language'] = isEn ? 'en' : 'vi'
        }
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

        if (response?.status === 200 && process.client) {
          import('@shared/composables/use-maintenance').then(({ useMaintenance }) => {
            const { isMaintenanceActive, resetMaintenance } = useMaintenance()
            if (isMaintenanceActive.value) {
              resetMaintenance()
            }
          })
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
        const url = error.config?.url || ''
        const status = error.response?.status
        const msg = (
          (error?.response?.data as HttpErrorPayload)?.message ||
          error.message ||
          ''
        ).toLowerCase()

        // 1. Tuyệt đối không kích hoạt màn hình bảo trì với:
        // - Request bị hủy (user chuyển trang / abort)
        // - Request bị trình duyệt hoặc AdBlock / Brave Shields chặn (ERR_BLOCKED_BY_CLIENT / net::ERR_BLOCKED_BY_CLIENT)
        // - Thiết bị người dùng offline / mất mạng cục bộ
        // - Các request phụ / quảng cáo (affiliate, ads, impression, click, tracking, views, stats)
        // - Cấu hình request có cờ skipMaintenance = true
        const isCanceled =
          axios.isCancel(error) ||
          error.code === 'ERR_CANCELED' ||
          error.name === 'CanceledError'
        const isClientBlocked =
          error.code === 'ERR_BLOCKED_BY_CLIENT' ||
          msg.includes('blocked by client') ||
          msg.includes('err_blocked_by_client')
        const isOffline =
          process.client && typeof navigator !== 'undefined' && !navigator.onLine
        const isAuxiliaryRequest =
          url.includes('/affiliate/') ||
          url.includes('/ads/') ||
          url.includes('/impression') ||
          url.includes('/click') ||
          url.includes('/views') ||
          url.includes('/stats') ||
          (error.config as any)?.skipMaintenance === true

        if (isCanceled || isClientBlocked || isOffline || isAuxiliaryRequest) {
          return Promise.reject(error)
        }

        // 2. Chỉ kích hoạt bảo trì khi server Cloudflare Worker sập thật sự:
        // - Cloudflare Worker / Gateway trả về 502, 503, 504
        // - Server trả về lỗi chạm trần D1 row read / rate limit
        const isMaintenanceError =
          [502, 503, 504].includes(status as number) ||
          msg.includes('d1_error') ||
          msg.includes('row read') ||
          msg.includes('rate limit') ||
          (status === 500 && (msg.includes('d1') || msg.includes('database quota')))

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
