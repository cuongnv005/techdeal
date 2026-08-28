export interface AffiliateAdItem {
  id: string
  name: string
  ad_type: 'floating' | 'square_banner' | 'vertical_banner'
  platform: 'shopee' | 'lazada' | 'tiktok' | 'tiki' | 'other'
  image_url: string
  image_thumb_url: string | null
  image_delete_url: string | null
  target_url: string
  title?: string | null
  description?: string | null
  product_image_url?: string | null
  background_image_url?: string | null
  target_pages?: string | null
  side_position?: 'left' | 'right' | 'both' | null
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
  ad_type: 'floating' | 'square_banner' | 'vertical_banner'
  platform: 'shopee' | 'lazada' | 'tiktok' | 'tiki' | 'other'
  image_url?: string
  image_thumb_url?: string
  image_delete_url?: string
  target_url: string
  title?: string
  description?: string
  product_image_url?: string
  background_image_url?: string
  target_pages?: string[] | string
  side_position?: 'left' | 'right' | 'both'
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
