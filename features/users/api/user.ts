import type { AxiosResponse } from 'axios'
import { HttpService } from '@core/api/service'
import type { UserDetailsResponse, UserProfile, UserProfileUpdatePayload } from '../types/user.type'

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export abstract class UserRepository {
  abstract getProfile(
    username: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<UserDetailsResponse>>

  abstract updateProfile(data: UserProfileUpdatePayload): Promise<ApiResponse<UserProfile>>
}

export class UserRepoImpl implements UserRepository {
  async getProfile(
    username: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<UserDetailsResponse>> {
    try {
      const response = await HttpService.get<
        { page?: number; limit?: number },
        AxiosResponse<ApiResponse<UserDetailsResponse>>
      >(`/users/${username}`, params)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi tải thông tin người dùng',
        data: {
          profile: { username },
          posts: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
    }
  }

  async updateProfile(data: UserProfileUpdatePayload): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await HttpService.post<
        UserProfileUpdatePayload,
        AxiosResponse<ApiResponse<UserProfile>>
      >('/users/profile', data)
      return response.data
    } catch (e: any) {
      return {
        success: false,
        error: e.response?.data?.error || e.message || 'Lỗi khi cập nhật thông tin cá nhân',
        data: {} as UserProfile
      }
    }
  }
}

export const userRepository = new UserRepoImpl()
