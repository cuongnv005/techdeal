import type {
  StatItem,
  ChartDataPoint,
  PostItem,
  CommentItem,
  UserItem
} from '../types/dashboard.type'

import { HttpService } from '@core/api/service'

export abstract class AdminRepository {
  abstract getOverviewStats(): Promise<StatItem[]>
  abstract getWeeklyChartData(): Promise<ChartDataPoint[]>
  abstract getMonthlyChartData(): Promise<ChartDataPoint[]>
  abstract getPosts(): Promise<PostItem[]>
  abstract deletePost(id: string): Promise<void>
  abstract getComments(): Promise<CommentItem[]>
  abstract deleteComment(id: string): Promise<void>
  abstract getUsers(): Promise<UserItem[]>
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
      const response = await HttpService.get<unknown, ApiResponse<WorkerStatsOverview>>(
        '/admin/stats/overview'
      )
      const stats = response.data
      return [
        {
          label: 'Tổng lượt xem bài viết',
          value: stats.top_post ? stats.top_post.views : '0',
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

  async getWeeklyChartData(): Promise<ChartDataPoint[]> {
    try {
      const response = await HttpService.get<unknown, ApiResponse<WorkerChartPoint[]>>(
        '/admin/stats/chart'
      )
      return response.data.map((item) => ({
        label: item.view_date,
        views: item.total_views,
        posts: 0
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getMonthlyChartData(): Promise<ChartDataPoint[]> {
    // Falls back to weekly chart or empty as we don't have separate monthly chart endpoint in worker
    return this.getWeeklyChartData()
  }

  async getPosts(): Promise<PostItem[]> {
    try {
      const response = await HttpService.get<unknown, ApiResponse<WorkerPost[]>>('/admin/posts')
      return response.data.map((post) => ({
        id: post.id,
        title: post.title,
        author: post.author_name,
        category: post.category_name,
        publishDate: new Date(post.created_at).toLocaleDateString('vi-VN'),
        views: post.views,
        comments: 0, // database schema details view/comment separately
        status: post.status
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async deletePost(id: string): Promise<void> {
    await HttpService.delete(`/admin/posts/${id}`)
  }

  async getComments(): Promise<CommentItem[]> {
    try {
      const response = await HttpService.get<unknown, ApiResponse<WorkerComment[]>>(
        '/admin/comments'
      )
      return response.data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author: comment.author_name,
        postTitle: comment.post_title,
        date: new Date(comment.created_at).toLocaleString('vi-VN')
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async deleteComment(id: string): Promise<void> {
    await HttpService.delete(`/admin/comments/${id}`)
  }

  async getUsers(): Promise<UserItem[]> {
    try {
      const response = await HttpService.get<unknown, ApiResponse<WorkerUser[]>>('/admin/users')
      return response.data.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: new Date(user.created_at).toLocaleDateString('vi-VN')
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async updateUserRole(id: string, role: 'admin' | 'mod' | 'user'): Promise<unknown> {
    return await HttpService.patch(`/admin/users/${id}/role`, { role })
  }

  async toggleUserStatus(id: string): Promise<unknown> {
    return await HttpService.patch(`/admin/users/${id}/toggle-status`, {})
  }
}
