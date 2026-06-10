import type { AxiosResponse } from 'axios'
import { HttpService } from '@core/api/service'
import type {
  Shortlink,
  CreateShortlinkInput,
  ShortlinkPagination,
  ShortlinkStats
} from '../types/shortlink.type'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export class ShortlinkRepository {
  async adminList(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{ items: Shortlink[]; pagination: ShortlinkPagination }>> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ items: Shortlink[]; pagination: ShortlinkPagination }>>
      >('/admin/shortlinks', { page, limit })
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải danh sách shortlinks',
        data: {
          items: [],
          pagination: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1 }
        }
      }
    }
  }

  async adminCreate(
    data: CreateShortlinkInput
  ): Promise<ApiResponse<{ id: string; hash: string }>> {
    try {
      const response = await HttpService.post<
        CreateShortlinkInput,
        AxiosResponse<ApiResponse<{ id: string; hash: string }>>
      >('/admin/shortlinks', data)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tạo shortlink',
        data: { id: '', hash: '' }
      }
    }
  }

  async adminDelete(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.delete<AxiosResponse<ApiResponse<any>>>(
        `/admin/shortlinks/${id}`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi xóa shortlink',
        data: null
      }
    }
  }

  async adminStats(id: string): Promise<ApiResponse<ShortlinkStats>> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ShortlinkStats>>>(
        `/admin/shortlinks/${id}/stats`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải thống kê shortlink',
        data: {} as ShortlinkStats
      }
    }
  }

  async getPublicDetail(hash: string): Promise<ApiResponse<Shortlink>> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<Shortlink>>>(
        `/shortlinks/${hash}`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải chi tiết shortlink',
        data: {} as Shortlink
      }
    }
  }

  async recordClick(hash: string, referrer: string): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.post<
        { referrer: string },
        AxiosResponse<ApiResponse<any>>
      >(`/shortlinks/${hash}/click`, { referrer })
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi ghi nhận click',
        data: null
      }
    }
  }
}

export const shortlinkRepository = new ShortlinkRepository()
