import type { DashboardPagination } from '../../admin/types/dashboard.type'
import type { Thread, CreateThreadInput } from '../types/thread.type'
import type { AxiosResponse } from 'axios'

import { HttpService } from '@core/api/service'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export abstract class ThreadRepository {
  abstract adminList(
    page?: number,
    limit?: number,
    filters?: { q?: string }
  ): Promise<ApiResponse<{ items: Thread[]; pagination: DashboardPagination }>>
  abstract adminGet(id: string): Promise<ApiResponse<Thread>>
  abstract adminCreate(data: CreateThreadInput): Promise<ApiResponse<{ id: string }>>
  abstract adminUpdate(id: string, data: Partial<CreateThreadInput>): Promise<ApiResponse<any>>
  abstract adminExpire(id: string): Promise<ApiResponse<any>>
  abstract adminDelete(id: string): Promise<ApiResponse<any>>
}

export class ThreadRepoImpl implements ThreadRepository {
  async adminList(
    page: number = 1,
    limit: number = 10,
    filters?: { q?: string }
  ): Promise<ApiResponse<{ items: Thread[]; pagination: DashboardPagination }>> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<any>>>(
        '/admin/threads',
        { page, limit, ...(filters?.q ? { q: filters.q } : {}) }
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải danh sách thread',
        data: {
          items: [],
          pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
        }
      }
    }
  }

  async adminGet(id: string): Promise<ApiResponse<Thread>> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<Thread>>>(
        `/admin/threads/${id}`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải chi tiết thread',
        data: {} as Thread
      }
    }
  }

  async adminCreate(data: CreateThreadInput): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await HttpService.post<
        CreateThreadInput,
        AxiosResponse<ApiResponse<{ id: string }>>
      >('/admin/threads', data)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tạo thread',
        data: { id: '' }
      }
    }
  }

  async adminUpdate(id: string, data: Partial<CreateThreadInput>): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.put<
        Partial<CreateThreadInput>,
        AxiosResponse<ApiResponse<any>>
      >(`/admin/threads/${id}`, data)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi cập nhật thread',
        data: null
      }
    }
  }

  async adminExpire(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.patch<unknown, AxiosResponse<ApiResponse<any>>>(
        `/admin/threads/${id}/expire`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi kết thúc deal',
        data: null
      }
    }
  }

  async adminDelete(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await HttpService.delete<AxiosResponse<ApiResponse<any>>>(
        `/admin/threads/${id}`
      )
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi xóa thread',
        data: null
      }
    }
  }
}
