export interface AffiliateAdItem {
  id: string
  name: string
  platform: 'shopee' | 'lazada' | 'tiktok' | 'tiki' | 'other'
  image_url: string
  image_thumb_url: string | null
  image_delete_url: string | null
  target_url: string
  animation: 'zoom' | 'shake' | 'bounce' | 'pulse' | 'none'
  position_vertical: 'top' | 'bottom' | 'middle'
  position_horizontal: 'left' | 'right'
  offset_vertical: string
  offset_horizontal: string
  open_delay_ms: number
  auto_close_seconds: number
  is_active: number
  priority: number
  clicks_count: number
  impressions_count: number
  created_at: string
  updated_at: string
}

export interface AffiliateAdFormPayload {
  name: string
  platform: 'shopee' | 'lazada' | 'tiktok' | 'tiki' | 'other'
  image_url: string
  image_thumb_url?: string
  image_delete_url?: string
  target_url: string
  animation: 'zoom' | 'shake' | 'bounce' | 'pulse' | 'none'
  position_vertical: 'top' | 'bottom' | 'middle'
  position_horizontal: 'left' | 'right'
  offset_vertical: string
  offset_horizontal: string
  open_delay_ms: number
  auto_close_seconds: number
  is_active: number
  priority: number
}

export interface AffiliatePagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface AffiliateListResult {
  items: AffiliateAdItem[]
  pagination: AffiliatePagination
}
