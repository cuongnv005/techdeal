import type { AxiosResponse } from 'axios'

import { HttpService } from '@core/api/service'

export interface UserProfile {
  id: string
  username: string
  email: string
  role: 'admin' | 'mod' | 'user'
}

interface AuthResponse {
  success: boolean
  message?: string
  data: {
    token: string
    user: UserProfile
  }
}

interface RegisterResponse {
  success: boolean
  message?: string
  data: UserProfile
}

export class AuthRepository {
  async login(email: string, password: string): Promise<AuthResponse['data']> {
    const response = await HttpService.post<unknown, AxiosResponse<AuthResponse>>('/auth/login', {
      email,
      password
    })
    return response.data.data
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<RegisterResponse['data']> {
    const response = await HttpService.post<unknown, AxiosResponse<RegisterResponse>>(
      '/auth/register',
      {
        username,
        email,
        password
      }
    )
    return response.data.data
  }
}
