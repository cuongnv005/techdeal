export interface Shortlink {
  id: string
  name: string
  target_url: string
  hash: string
  created_at: string
  updated_at: string
  clicks_count: number
  deal_thread_id?: string | null
  guide_image_url?: string | null
  deal_app_name?: string | null
  deal_image_url?: string | null
}

export interface ShortlinkPagination {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface CreateShortlinkInput {
  name: string
  target_url: string
  hash?: string
  deal_thread_id?: string | null
  guide_image_url?: string | null
}

export interface UpdateShortlinkInput {
  name?: string
  target_url?: string
  deal_thread_id?: string | null
  guide_image_url?: string | null
}

export interface ShortlinkReferrer {
  source: string
  count: number
}

export interface ShortlinkDailyStat {
  date: string
  count: number
}

export interface ShortlinkDevices {
  mobile: number
  desktop: number
}

export interface ShortlinkStats {
  shortlink: {
    id: string
    name: string
    target_url: string
    hash: string
  }
  total_clicks: number
  referrers: ShortlinkReferrer[]
  daily_stats: ShortlinkDailyStat[]
  devices: ShortlinkDevices
}
