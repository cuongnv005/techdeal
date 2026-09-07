import type { AxiosResponse } from 'axios'
import { HttpService } from '@core/api/service'

export type TargetType = 'post' | 'thread' | 'comment' | 'user'

export interface SubmitReportPayload {
  target_type: TargetType
  target_id: string | number
  reason: string
  details?: string
}

export interface BlockedUser {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  blocked_at: string
}

export interface AdminReportItem {
  id: number
  reporter_user_id: string
  reporter_username?: string
  reporter_email?: string
  target_type: TargetType
  target_id: string
  reason: string
  details: string | null
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
  admin_notes: string | null
  created_at: string
  updated_at: string
  target_info?: any
}

export interface AdminReportsResponse {
  items: AdminReportItem[]
  pagination: {
    page: number
    limit: number
    total_items: number
    total_pages: number
  }
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export class ModerationRepository {
  /**
   * Client: Gửi báo cáo vi phạm (post, thread, comment, user)
   */
  async submitReport(
    payload: SubmitReportPayload
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await HttpService.post<SubmitReportPayload, AxiosResponse<ApiResponse<any>>>(
        '/moderation/reports',
        payload
      )
      return {
        success: response.data?.success ?? true,
        message: response.data?.message
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Lỗi khi gửi báo cáo'
      }
    }
  }

  /**
   * Client: Chặn một người dùng
   */
  async blockUser(
    blockedUserId: string | number
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await HttpService.post<
        { blocked_user_id: string | number },
        AxiosResponse<ApiResponse<any>>
      >('/moderation/block', { blocked_user_id: blockedUserId })
      return {
        success: response.data?.success ?? true,
        message: response.data?.message
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Lỗi khi chặn người dùng'
      }
    }
  }

  /**
   * Client: Bỏ chặn một người dùng
   */
  async unblockUser(
    blockedUserId: string | number
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await HttpService.delete<AxiosResponse<ApiResponse<any>>>(
        `/moderation/block/${blockedUserId}`
      )
      return {
        success: response?.data?.success ?? true,
        message: response?.data?.message
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Lỗi khi bỏ chặn người dùng'
      }
    }
  }

  /**
   * Client: Lấy danh sách những người dùng đã chặn
   */
  async getBlockedUsers(): Promise<BlockedUser[]> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<BlockedUser[]>>>(
        '/moderation/blocked-users'
      )
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch (err) {
      console.error('Error fetching blocked users:', err)
      return []
    }
  }

  /**
   * Admin: Lấy danh sách báo cáo vi phạm
   */
  async getAdminReports(params?: {
    status?: string
    target_type?: string
    page?: number
    limit?: number
  }): Promise<AdminReportsResponse> {
    const defaultRes: AdminReportsResponse = {
      items: [],
      pagination: { page: 1, limit: 20, total_items: 0, total_pages: 1 }
    }
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<AdminReportsResponse>>
      >('/admin/reports', params)
      if (response.data && response.data.success && response.data.data) {
        return response.data.data
      }
      return defaultRes
    } catch (err) {
      console.error('Error fetching admin reports:', err)
      return defaultRes
    }
  }

  /**
   * Admin: Cập nhật trạng thái xử lý report
   */
  async updateReportStatus(
    id: number | string,
    status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed',
    adminNotes?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await HttpService.patch<
        { status: string; admin_notes?: string },
        AxiosResponse<ApiResponse<any>>
      >(`/admin/reports/${id}`, { status, admin_notes: adminNotes })
      return {
        success: response.data?.success ?? true,
        message: response.data?.message
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Lỗi khi cập nhật trạng thái report'
      }
    }
  }

  /**
   * Admin: Gỡ bỏ nội dung vi phạm
   */
  async deleteReportContent(
    id: number | string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await HttpService.delete<AxiosResponse<ApiResponse<any>>>(
        `/admin/reports/${id}/content`
      )
      return {
        success: response?.data?.success ?? true,
        message: response?.data?.message
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Lỗi khi gỡ bỏ nội dung vi phạm'
      }
    }
  }

  /**
   * Admin: Khóa tài khoản người dùng vi phạm
   */
  async banUser(
    userId: string | number,
    reason?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await HttpService.post<{ reason?: string }, AxiosResponse<ApiResponse<any>>>(
        `/admin/users/${userId}/ban`,
        { reason }
      )
      return {
        success: response.data?.success ?? true,
        message: response.data?.message
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Lỗi khi khóa tài khoản'
      }
    }
  }
}

export const moderationRepository = new ModerationRepository()
