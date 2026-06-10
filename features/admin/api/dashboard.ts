import type { AxiosResponse } from 'axios'
import type {
  StatItem,
  ChartDataPoint,
  PostItem,
  CommentItem,
  UserItem,
  PaginatedResult
} from '../types/dashboard.type'

import { HttpService } from '@core/api/service'

export abstract class AdminRepository {
  abstract getOverviewStats(): Promise<StatItem[]>
  abstract getWeeklyChartData(range?: 'week' | 'month'): Promise<ChartDataPoint[]>
  abstract getMonthlyChartData(): Promise<ChartDataPoint[]>
  abstract getPostsChartData(range?: 'week' | 'month'): Promise<ChartDataPoint[]>
  abstract getPosts(page?: number, limit?: number): Promise<PaginatedResult<PostItem>>
  abstract deletePost(id: string): Promise<void>
  abstract getComments(page?: number, limit?: number): Promise<PaginatedResult<CommentItem>>
  abstract deleteComment(id: string): Promise<void>
  abstract getUsers(page?: number, limit?: number): Promise<PaginatedResult<UserItem>>
  abstract updateUserRole(id: string, role: 'admin' | 'mod' | 'user'): Promise<unknown>
  abstract toggleUserStatus(id: string): Promise<unknown>
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

interface WorkerStatsOverview {
  total_published_posts: number
  total_pending_posts: number
  total_users: number
  total_comments: number
  total_views: number
  top_post?: {
    title: string
    slug: string
    views: number
  } | null
}

interface WorkerChartPoint {
  view_date: string
  total_views: number
}

interface WorkerPost {
  id: string
  title: string
  slug: string
  status: 'pending' | 'published' | 'unpublished'
  views: number
  created_at: string
  author_name: string
  category_name: string
}

interface WorkerComment {
  id: string
  content: string
  created_at: string
  author_name: string
  post_title: string
  post_slug: string
}

interface WorkerUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'mod' | 'user'
  status: 'active' | 'blocked'
  created_at: string
}

export class AdminRepoImpl implements AdminRepository {
  async getOverviewStats(): Promise<StatItem[]> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<WorkerStatsOverview>>
      >('/admin/stats/overview')
      const stats = response.data?.data
      if (!stats || typeof stats !== 'object' || !('total_published_posts' in stats)) {
        console.error('getOverviewStats: response.data.data is not a valid stats object', stats)
        throw new Error('Invalid overview stats format')
      }
      return [
        {
          label: 'Tổng lượt xem bài viết',
          value: stats.total_views !== undefined ? stats.total_views : 0,
          trend: 0,
          isPositive: true
        },
        {
          label: 'Tổng số bài viết',
          value: stats.total_published_posts + stats.total_pending_posts,
          trend: 0,
          isPositive: true
        },
        { label: 'Tổng số bình luận', value: stats.total_comments, trend: 0, isPositive: true },
        { label: 'Tổng số thành viên', value: stats.total_users, trend: 0, isPositive: true }
      ]
    } catch (e) {
      console.error(e)
      return [
        { label: 'Tổng lượt xem bài viết', value: '0', trend: 0, isPositive: true },
        { label: 'Tổng số bài viết', value: 0, trend: 0, isPositive: true },
        { label: 'Tổng số bình luận', value: 0, trend: 0, isPositive: true },
        { label: 'Tổng số thành viên', value: 0, trend: 0, isPositive: true }
      ]
    }
  }

  async getWeeklyChartData(range: 'week' | 'month' = 'week'): Promise<ChartDataPoint[]> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<any[]>>>(
        `/admin/stats/chart?range=${range}`
      )
      const list = response.data?.data
      if (!Array.isArray(list)) {
        console.error('getWeeklyChartData: response.data.data is not an array', list)
        return []
      }
      const groupedMap = new Map<string, { label: string; views: number; posts: number }>()

      list.forEach((item) => {
        const label = item.view_date || item.post_date || ''
        const views = item.total_views || 0
        const posts = item.total_posts || 0

        if (groupedMap.has(label)) {
          const existing = groupedMap.get(label)!
          existing.views += views
          existing.posts += posts
        } else {
          groupedMap.set(label, { label, views, posts })
        }
      })

      return Array.from(groupedMap.values())
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getMonthlyChartData(): Promise<ChartDataPoint[]> {
    return this.getWeeklyChartData('month')
  }

  async getPostsChartData(range: 'week' | 'month' = 'week'): Promise<ChartDataPoint[]> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<any[]>>>(
        `/admin/stats/posts-chart?range=${range}`
      )
      const list = response.data?.data
      if (!Array.isArray(list)) {
        console.error('getPostsChartData: response.data.data is not an array', list)
        return []
      }

      const groupedMap = new Map<string, { label: string; views: number; posts: number }>()

      list.forEach((item) => {
        const label = item.post_date || item.view_date || ''
        const views = item.total_views || 0
        const posts = item.total_posts || 0

        if (groupedMap.has(label)) {
          const existing = groupedMap.get(label)!
          existing.views += views
          existing.posts += posts
        } else {
          groupedMap.set(label, { label, views, posts })
        }
      })

      return Array.from(groupedMap.values())
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getPosts(page: number = 1, limit: number = 10): Promise<PaginatedResult<PostItem>> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ items: WorkerPost[]; pagination?: any }>>
      >('/admin/posts', { page, limit })
      const data = response.data?.data
      const list =
        data && 'items' in data && Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : []

      if (!Array.isArray(list)) {
        console.error('getPosts: response.data.data is not a valid list', list)
        return {
          items: [],
          pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
        }
      }

      const items = list.map((post) => ({
        id: post.id,
        title: post.title,
        author: post.author_name,
        category: post.category_name,
        publishDate: new Date(post.created_at).toLocaleDateString('vi-VN'),
        views: post.views,
        comments: 0,
        status: post.status
      }))

      const pagination =
        data && 'pagination' in data && data.pagination
          ? data.pagination
          : {
              current_page: page,
              per_page: limit,
              total_items: items.length,
              total_pages: Math.ceil(items.length / limit) || 1
            }

      return { items, pagination }
    } catch (e) {
      console.error(e)
      return {
        items: [],
        pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
      }
    }
  }

  async deletePost(id: string): Promise<void> {
    await HttpService.delete(`/admin/posts/${id}`)
  }

  async getComments(page: number = 1, limit: number = 10): Promise<PaginatedResult<CommentItem>> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ items: WorkerComment[]; pagination?: any }>>
      >('/admin/comments', { page, limit })
      const data = response.data?.data
      const list =
        data && 'items' in data && Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : []

      if (!Array.isArray(list)) {
        console.error('getComments: response.data.data is not a valid list', list)
        return {
          items: [],
          pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
        }
      }

      const items = list.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author: comment.author_name,
        postTitle: comment.post_title,
        date: new Date(comment.created_at).toLocaleString('vi-VN')
      }))

      const pagination =
        data && 'pagination' in data && data.pagination
          ? data.pagination
          : {
              current_page: page,
              per_page: limit,
              total_items: items.length,
              total_pages: Math.ceil(items.length / limit) || 1
            }

      return { items, pagination }
    } catch (e) {
      console.error(e)
      return {
        items: [],
        pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
      }
    }
  }

  async deleteComment(id: string): Promise<void> {
    await HttpService.delete(`/admin/comments/${id}`)
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResult<UserItem>> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ items: WorkerUser[]; pagination?: any }>>
      >('/admin/users', { page, limit })
      const data = response.data?.data
      const list =
        data && 'items' in data && Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : []

      if (!Array.isArray(list)) {
        console.error('getUsers: response.data.data is not a valid list', list)
        return {
          items: [],
          pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
        }
      }

      const items = list.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: new Date(user.created_at).toLocaleDateString('vi-VN')
      }))

      const pagination =
        data && 'pagination' in data && data.pagination
          ? data.pagination
          : {
              current_page: page,
              per_page: limit,
              total_items: items.length,
              total_pages: Math.ceil(items.length / limit) || 1
            }

      return { items, pagination }
    } catch (e) {
      console.error(e)
      return {
        items: [],
        pagination: { current_page: 1, per_page: limit, total_items: 0, total_pages: 1 }
      }
    }
  }

  async updateUserRole(id: string, role: 'admin' | 'mod' | 'user'): Promise<unknown> {
    return await HttpService.patch(`/admin/users/${id}/role`, { role })
  }

  async toggleUserStatus(id: string): Promise<unknown> {
    return await HttpService.patch(`/admin/users/${id}/toggle-status`, {})
  }
}
