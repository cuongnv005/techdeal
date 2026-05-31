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
  author_id?: string
  scheduled_at?: string | null
  thumbnail?: string
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

export interface ApiPagination {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface GetPostsParams {
  category?: string
  tag?: string
  page?: number
  limit?: number
  q?: string
  title?: string
  enrich?: boolean
}

export function mapApiPostToBlogPost(post: ApiPost): BlogPost {
  // Use backend thumbnail directly if available, fallback to extraction or default
  let imageUrl = post.thumbnail ||
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  if (!post.thumbnail && post.content) {
    const imgMatch = post.content.match(/\[img\]([\s\S]*?)\[\/img\]/i)
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1].trim()
    }
  }

  let summary = post.summary || ''
  if (summary) {
    // Basic cleaning of BBCode tags in summary to show clean text in list cards
    summary = summary
      .replace(/\[center\][\s\S]*?\[\/center\]/gi, '')
      .replace(/\[img\][\s\S]*?\[\/img\]/gi, '')
      .replace(/\[b\]/gi, '')
      .replace(/\[\/b\]/gi, '')
      .replace(/\[i\]/gi, '')
      .replace(/\[\/i\]/gi, '')
      .replace(/\[u\]/gi, '')
      .replace(/\[\/u\]/gi, '')
      .replace(/\[url=['"]?[^\]'"]+?['"]?\]([\s\S]*?)\[\/url\]/gi, '$1')
      .replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '$1')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  if (!summary && post.content) {
    const prebreakIndex = post.content.indexOf('[prebreak]')
    if (prebreakIndex !== -1) {
      const rawSummary = post.content.substring(0, prebreakIndex).trim()
      summary = rawSummary
        .replace(/\[center\]/gi, '')
        .replace(/\[\/center\]/gi, '')
        .replace(/\[left\]/gi, '')
        .replace(/\[\/left\]/gi, '')
        .replace(/\[right\]/gi, '')
        .replace(/\[\/right\]/gi, '')
        .replace(/\[b\]/gi, '')
        .replace(/\[\/b\]/gi, '')
        .replace(/\[i\]/gi, '')
        .replace(/\[\/i\]/gi, '')
        .replace(/\[u\]/gi, '')
        .replace(/\[\/u\]/gi, '')
        .replace(/\[img\][\s\S]*?\[\/img\]/gi, '') // Remove img tags
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
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
    summary: summary,
    slug: post.slug,
    content: post.content,
    authorId: post.author_id,
    scheduledAt: post.scheduled_at
  }
}

export class BlogRepository {
  private detailCache = new Map<string, Promise<{
    post: BlogPost
    tags: string[]
    relatedPosts: BlogPost[]
    comments: ApiComment[]
  } | null>>()

  async getPosts(params?: GetPostsParams): Promise<{ items: BlogPost[]; pagination?: ApiPagination }> {
    try {
      const { enrich = false, ...apiParams } = params || {}
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ items: ApiPost[]; pagination?: ApiPagination }>>
      >('/posts', apiParams)

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data.items)
      ) {
        const posts = response.data.data.items.map(mapApiPostToBlogPost)
        
        let finalPosts = posts
        if (enrich) {
          // Parallel fetch details to enrich list items with image and summary from content
          finalPosts = await Promise.all(
            posts.map(async (post) => {
              try {
                const detail = await this.getPostBySlug(post.slug)
                if (detail && detail.post) {
                  return {
                    ...post,
                    imageUrl: detail.post.imageUrl,
                    summary: detail.post.summary,
                    content: detail.post.content
                  }
                }
              } catch (err) {
                console.error(`Error enriching post ${post.slug}:`, err)
              }
              return post
            })
          )
        }

        return {
          items: finalPosts,
          pagination: response.data.data.pagination
        }
      }
      
      // Fallback for old array style response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return {
          items: response.data.data.map(mapApiPostToBlogPost)
        }
      }
      
      return { items: [] }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return { items: [] }
    }
  }

  async getComments(postId: string): Promise<ApiComment[]> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ items: ApiComment[]; pagination?: ApiPagination }>>
      >(`/posts/${postId}/comments`)

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data.items)
      ) {
        return response.data.data.items
      }

      // Fallback for old array style response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data
      }

      return []
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error)
      return []
    }
  }

  async getPostBySlug(slug: string): Promise<{
    post: BlogPost
    tags: string[]
    relatedPosts: BlogPost[]
    comments: ApiComment[]
  } | null> {
    if (this.detailCache.has(slug)) {
      return this.detailCache.get(slug)!
    }

    const promise = (async () => {
      try {
        let querySlug = slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
        if (isUuid) {
          const postsRes = await this.getPosts({ limit: 1000 })
          const found = postsRes.items.find((p) => p.id === slug)
          if (found && found.slug) {
            querySlug = found.slug
          } else {
            return null
          }
        }

        const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ApiPostDetail>>>(
          `/posts/${querySlug}`
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
    })()

    this.detailCache.set(slug, promise)
    return promise
  }

  async submitComment(postId: string, content: string): Promise<ApiComment | null> {
    try {
      const response = await HttpService.post<
        { content: string },
        AxiosResponse<ApiResponse<{ id: string }>>
      >(`/posts/${postId}/comments`, { content })
      if (response.data && response.data.success && response.data.data) {
        const { useUserStore } = await import('@stores/user')
        const userStore = useUserStore()
        return {
          id: response.data.data.id,
          post_id: postId,
          author_id: userStore.id || '',
          author_name: userStore.username || 'Thành viên',
          avatar_url: undefined,
          content: content,
          created_at: new Date().toISOString()
        }
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
  }): Promise<{ success: boolean; message?: string; data?: { id: string; slug: string; status: string } } | null> {
    try {
      const response = await HttpService.post<unknown, AxiosResponse<ApiResponse<{ id: string; slug: string; status: string }>>>(
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
          message: response.data.message,
          data: response.data.data
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

  async updatePost(
    id: string,
    postData: {
      title: string
      content: string
      category: string
      tags: string[]
      scheduledAt: string | null
    }
  ): Promise<{ success: boolean; message?: string; data?: { id: string; slug: string; status: string } } | null> {
    try {
      const response = await HttpService.put<unknown, AxiosResponse<ApiResponse<{ id: string; slug: string; status: string }>>>(
        `/posts/${id}`,
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
          message: response.data.message,
          data: response.data.data
        }
      }
      return null
    } catch (error: any) {
      console.error('Error updating post:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết!'
      }
    }
  }
}

export const blogRepository = new BlogRepository()
