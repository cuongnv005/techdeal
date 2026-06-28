export interface StatItem {
  label: string
  value: string | number
  trend: number // percentage, e.g. 12.5 means +12.5%
  isPositive: boolean
}

export interface ChartDataPoint {
  label: string // e.g. "Mon", "Tue" or "Week 1", "Week 2"
  views: number
  posts: number
}

export interface PostItem {
  id: string
  title: string
  slug: string
  author: string
  category: string
  publishDate: string
  views: number
  comments: number
  status: 'pending' | 'published' | 'unpublished'
  is_hidden: number
}

export interface CommentItem {
  id: string
  content: string
  author: string
  postTitle: string
  date: string
}

export interface UserItem {
  id: string
  username: string
  email: string
  role: 'admin' | 'mod' | 'user'
  status: 'active' | 'blocked'
  joinDate: string
}

export interface DashboardPagination {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: DashboardPagination
}
