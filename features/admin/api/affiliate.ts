import type {
  AffiliateAdItem,
  AffiliateAdFormPayload,
  AffiliateListResult
} from '../types/affiliate.type'
import type { AxiosResponse } from 'axios'

import { HttpService } from '@core/api/service'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export class AffiliateAdminRepository {
  // Lấy danh sách quảng cáo affiliate (admin)
  async getAds(params?: {
    page?: number
    limit?: number
    platform?: string
    status?: number | string
    q?: string
  }): Promise<AffiliateListResult> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<AffiliateListResult>>
      >('/admin/affiliate/ads', { params })

      return (
        response.data.data || {
          items: [],
          pagination: { page: 1, limit: 20, total: 0, total_pages: 1 }
        }
      )
    } catch (e) {
      console.error('getAds error:', e)
      return {
        items: [],
        pagination: { page: 1, limit: 20, total: 0, total_pages: 1 }
      }
    }
  }

  // Lấy chi tiết quảng cáo
  async getAdById(id: string): Promise<AffiliateAdItem> {
    const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<AffiliateAdItem>>>(
      `/admin/affiliate/ads/${id}`
    )
    return response.data.data
  }

  // Tạo mới quảng cáo
  async createAd(payload: AffiliateAdFormPayload): Promise<AffiliateAdItem> {
    const response = await HttpService.post<unknown, AxiosResponse<ApiResponse<AffiliateAdItem>>>(
      '/admin/affiliate/ads',
      payload
    )
    return response.data.data
  }

  // Cập nhật quảng cáo
  async updateAd(id: string, payload: Partial<AffiliateAdFormPayload>): Promise<AffiliateAdItem> {
    const response = await HttpService.put<unknown, AxiosResponse<ApiResponse<AffiliateAdItem>>>(
      `/admin/affiliate/ads/${id}`,
      payload
    )
    return response.data.data
  }

  // Bật/tắt trạng thái
  async toggleAdStatus(id: string, isActive: number): Promise<{ id: string; is_active: number }> {
    const response = await HttpService.patch<
      unknown,
      AxiosResponse<ApiResponse<{ id: string; is_active: number }>>
    >(`/admin/affiliate/ads/${id}/status`, { is_active: isActive })
    return response.data.data
  }

  // Xóa quảng cáo
  async deleteAd(id: string): Promise<void> {
    await HttpService.delete(`/admin/affiliate/ads/${id}`)
  }

  // Tải ảnh lên ImgBB
  async uploadImage(
    file: File
  ): Promise<{ url: string; display_url: string; thumb_url: string; delete_url: string }> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await HttpService.post<
      unknown,
      AxiosResponse<
        ApiResponse<{ url: string; display_url: string; thumb_url: string; delete_url: string }>
      >
    >('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  }
}
