import { HttpService } from '@core/api/service'
import type { AxiosResponse } from 'axios'

export interface GiveawayWaitlistResult {
  queue_number: number
  batch_number: number
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  email: string
  is_existing?: boolean
  created_at?: string
  sent_at?: string | null
}

export interface GiveawayStatsResult {
  total_registered: number
  latest_queue: number
  current_batch: number
  total_sent: number
  total_pending: number
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export const giveawayRepository = {
  async joinWaitlist(email: string): Promise<GiveawayWaitlistResult> {
    const res = await HttpService.post<
      { email: string },
      AxiosResponse<ApiResponse<GiveawayWaitlistResult>>
    >('/giveaway/waitlist', { email })
    return res.data.data
  },

  async getWaitlistStatus(email: string): Promise<GiveawayWaitlistResult> {
    const res = await HttpService.get<
      { email: string },
      AxiosResponse<ApiResponse<GiveawayWaitlistResult>>
    >('/giveaway/waitlist/status', { email })
    return res.data.data
  },

  async getStats(): Promise<GiveawayStatsResult> {
    const res = await HttpService.get<undefined, AxiosResponse<ApiResponse<GiveawayStatsResult>>>(
      '/giveaway/stats'
    )
    return res.data.data
  }
}
