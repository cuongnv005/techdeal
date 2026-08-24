export type ThreadPlatform = 'android' | 'ios' | 'windows' | 'game'

export interface Thread {
  id: string
  app_name: string
  image_url?: string | null
  original_price?: string | null
  summary: string
  summary_en?: string | null
  content?: string
  content_en?: string | null
  deal_link?: string
  platform_type: ThreadPlatform
  is_vip_only: number
  deal_ends_at: string | null
  max_claims: number | null
  claims_count: number
  like_count: number
  status: string
  author_id?: string
  author_name?: string
  created_at: string
  updated_at?: string
}

export interface CreateThreadInput {
  app_name: string
  summary: string
  summary_en?: string | null
  content: string
  content_en?: string | null
  deal_link: string
  platform_type: ThreadPlatform
  image_url?: string
  original_price?: string | null
  is_vip_only?: boolean
  deal_ends_at?: string | null
  max_claims?: number | null
  status?: string
}
