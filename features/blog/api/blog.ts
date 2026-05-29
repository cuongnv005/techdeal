import type { BlogPost } from '../types/post.type'
import type { AxiosResponse } from 'axios'

import { HttpService } from '@core/api/service'

export interface ApiPost {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  category_id: string
  category_name: string
  author_name: string
  views: number
  created_at: string
  updated_at: string
  comment_count?: number
}

export interface ApiComment {
  id: string
  post_id: string
  author_id: string
  author_name: string
  avatar_url?: string
  content: string
  created_at: string
}

export interface ApiPostDetail extends ApiPost {
  tags: string[]
  related_similar_posts?: ApiPost[]
  comments?: ApiComment[]
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface GetPostsParams {
  category?: string
  tag?: string
  page?: number
  limit?: number
  q?: string
}

export function mapApiPostToBlogPost(post: ApiPost): BlogPost {
  // Extract first image from BBCode [img]...[/img] if content exists
  let imageUrl =
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  if (post.content) {
    const imgMatch = post.content.match(/\[img\]([\s\S]*?)\[\/img\]/i)
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1].trim()
    }
  }

  return {
    id: post.id,
    title: post.title,
    category: post.category_name || post.category_id || 'Technology',
    author: post.author_name || 'Admin',
    publishDate: new Date(post.created_at).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    views: post.views || 0,
    comments: post.comment_count || 0,
    imageUrl: imageUrl,
    summary: post.summary || '',
    slug: post.slug,
    content: post.content
  }
}

export class BlogRepository {
  async getPosts(params?: GetPostsParams): Promise<BlogPost[]> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ApiPost[]>>>(
        '/posts',
        params
      )
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map(mapApiPostToBlogPost)
      }
      return []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  async getPostBySlug(slug: string): Promise<{
    post: BlogPost
    tags: string[]
    relatedPosts: BlogPost[]
    comments: ApiComment[]
  } | null> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ApiPostDetail>>>(
        `/posts/${slug}`
      )
      if (response.data && response.data.success && response.data.data) {
        const detail = response.data.data
        const blogPost = mapApiPostToBlogPost(detail)
        const related = (detail.related_similar_posts || []).map(mapApiPostToBlogPost)
        return {
          post: blogPost,
          tags: detail.tags || [],
          relatedPosts: related,
          comments: detail.comments || []
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching post by slug ${slug}:`, error)
      return null
    }
  }

  async submitComment(postId: string, content: string): Promise<ApiComment | null> {
    try {
      const response = await HttpService.post<
        { content: string },
        AxiosResponse<ApiResponse<ApiComment>>
      >(`/posts/${postId}/comments`, { content })
      if (response.data && response.data.success) {
        return response.data.data
      }
      return null
    } catch (error) {
      console.error(`Error submitting comment for post ${postId}:`, error)
      return null
    }
  }

  async createPost(postData: {
    title: string
    content: string
    category: string
    tags: string[]
    scheduledAt: string | null
  }): Promise<{ success: boolean; message?: string } | null> {
    try {
      const response = await HttpService.post<unknown, AxiosResponse<ApiResponse<unknown>>>(
        '/posts',
        {
          title: postData.title,
          content: postData.content,
          category_id: postData.category,
          tags: postData.tags,
          scheduled_at: postData.scheduledAt
        }
      )
      if (response.data) {
        return {
          success: response.data.success,
          message: response.data.message
        }
      }
      return null
    } catch (error: any) {
      console.error('Error creating post:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng bài viết!'
      }
    }
  }
}

export const blogRepository = new BlogRepository()
