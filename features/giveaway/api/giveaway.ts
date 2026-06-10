import type { AxiosResponse } from 'axios'
import { HttpService } from '@core/api/service'
import type { Giveaway, GiveawayAdminDetail, CreateGiveawayInput } from '../types/giveaway.type'
import type { DashboardPagination } from '../../admin/types/dashboard.type'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export abstract class GiveawayRepository {
  abstract getPublicDetail(id: string): Promise<ApiResponse<Giveaway>>
  abstract claimKey(id: string): Promise<ApiResponse<{ activation_link: string }>>
  abstract adminList(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{ items: Giveaway[]; pagination: DashboardPagination }>>
  abstract adminGet(id: string): Promise<ApiResponse<GiveawayAdminDetail>>
  abstract adminCreate(data: CreateGiveawayInput): Promise<ApiResponse<{ id: string }>>
  abstract adminUpdate(id: string, data: Partial<CreateGiveawayInput>): Promise<ApiResponse<any>>
  abstract adminDelete(id: string): Promise<ApiResponse<any>>
}

export class GiveawayRepoImpl implements GiveawayRepository {
  async getPublicDetail(id: string): Promise<ApiResponse<Giveaway>> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<Giveaway>>>(
        `/giveaways/${id}`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải chi tiết chương trình',
        data: {} as Giveaway
      }
    }
  }

  async claimKey(id: string): Promise<ApiResponse<{ activation_link: string }>> {
    try {
      const response = await HttpService.post<
        unknown,
        AxiosResponse<ApiResponse<{ activation_link: string }>>
      >(`/giveaways/${id}/claim`)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi nhận key',
        data: { activation_link: '' }
      }
    }
  }

  async adminList(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ items: Giveaway[]; pagination: DashboardPagination }>> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<any>>>(
        '/admin/giveaways',
        { page, limit }
      )

      const respData = response.data
      if (respData.success && Array.isArray(respData.data)) {
        return {
          success: true,
          data: {
            items: respData.data,
            pagination: {
              current_page: page,
              per_page: limit,
              total_items: respData.data.length,
              total_pages: Math.ceil(respData.data.length / limit) || 1
            }
          }
        }
      }
      return respData
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải danh sách',
        data: {
          items: [],
          pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
        }
      }
    }
  }

  async adminGet(id: string): Promise<ApiResponse<GiveawayAdminDetail>> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<GiveawayAdminDetail>>
      >(`/admin/giveaways/${id}`)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải chi tiết',
        data: {} as GiveawayAdminDetail
      }
    }
  }

  async adminCreate(data: CreateGiveawayInput): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await HttpService.post<
        CreateGiveawayInput,
        AxiosResponse<ApiResponse<{ id: string }>>
      >('/admin/giveaways', data)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tạo chương trình',
        data: { id: '' }
      }
    }
  }

  async adminUpdate(id: string, data: Partial<CreateGiveawayInput>): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.put<
        Partial<CreateGiveawayInput>,
        AxiosResponse<ApiResponse<any>>
      >(`/admin/giveaways/${id}`, data)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi cập nhật chương trình',
        data: null
      }
    }
  }

  async adminDelete(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.delete<AxiosResponse<ApiResponse<any>>>(
        `/admin/giveaways/${id}`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi xóa chương trình',
        data: null
      }
    }
  }
}
