import type { BlogPost } from '../types/post.type'
import type { AxiosResponse } from 'axios'

import { HttpService } from '@core/api/service'

export interface ApiPost {
  id: string
  title: string
  title_en?: string
  slug: string
  slug_en?: string
  slug_vi?: string
  content: string
  content_en?: string
  summary: string
  summary_en?: string
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
  thumbnail_url?: string
  author_avatar?: string
  author_bio?: string
  status?: string
  is_hidden?: boolean
}

export interface ApiCommentReplyTo {
  comment_id: string
  username: string
}

export interface ApiComment {
  id: string
  author_id?: string
  author_name: string
  author_avatar?: string | null
  content: string
  created_at: string
  parent_comment_id: string | null
  like_count: number
  liked_by_me: boolean
  reply_to: ApiCommentReplyTo | null
  // Chỉ có ở bình luận gốc (cấp 1) - tối đa 3 trả lời mới nhất, xem thêm qua getReplies()
  replies?: {
    items: ApiComment[]
    total: number
    has_more: boolean
  }
}

export interface CommentsPage {
  items: ApiComment[]
  pagination: ApiPagination
}

export interface ApiPostDetail extends ApiPost {
  tags: string[]
  related_similar_posts?: ApiPost[]
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
  lang?: string
}

export function mapApiPostToBlogPost(post: ApiPost): BlogPost {
  // Use backend thumbnail directly if available, fallback to extraction or default
  let imageUrl =
    post.thumbnail ||
    post.thumbnail_url ||
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  if (!post.thumbnail && !post.thumbnail_url && post.content) {
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
    titleEn: post.title_en,
    category: post.category_name || post.category_id || 'Technology',
    categoryId: post.category_id,
    author: post.author_name || 'Admin',
    // Chỉ định rõ timeZone: nếu không, kết quả phụ thuộc múi giờ mặc định của môi trường đang
    // chạy code (server SSR trên Vercel thường chạy UTC, còn browser dùng giờ máy người dùng) -
    // gây lệch giờ giữa bản render server và client. Site phục vụ người đọc Việt Nam nên luôn
    // hiển thị theo giờ Việt Nam, bất kể code chạy ở đâu.
    publishDate: new Date(post.created_at).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    }),
    views: post.views || 0,
    comments: post.comment_count || 0,
    imageUrl: imageUrl,
    summary: summary,
    summaryEn: post.summary_en,
    slug: post.slug,
    slugEn: post.slug_en,
    slugVi: post.slug_vi,
    content: post.content,
    contentEn: post.content_en,
    authorId: post.author_id,
    authorAvatar: post.author_avatar,
    authorBio: post.author_bio,
    scheduledAt: post.scheduled_at,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    status: post.status,
    isHidden: post.is_hidden
  }
}

export class BlogRepository {
  async getPosts(
    params?: GetPostsParams
  ): Promise<{ items: BlogPost[]; pagination?: ApiPagination }> {
    try {
      const { enrich = false, ...apiParams } = params || {}

      if (apiParams.tag) {
        apiParams.tag = apiParams.tag.normalize('NFC')
      }
      if (apiParams.q) {
        apiParams.q = apiParams.q.normalize('NFC')
      }
      if (apiParams.title) {
        apiParams.title = apiParams.title.normalize('NFC')
      }

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

  // Bình luận gốc (cấp 1) của bài viết, phân trang 5/lần - mỗi gốc kèm tối đa 3 trả lời mới nhất
  async getComments(
    postId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CommentsPage> {
    const emptyPage: CommentsPage = {
      items: [],
      pagination: { current_page: 1, per_page: 5, total_items: 0, total_pages: 0 }
    }
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<CommentsPage>>>(
        `/posts/${postId}/comments`,
        { page: params?.page ?? 1, limit: params?.limit ?? 5 }
      )
      if (response.data && response.data.success && response.data.data) {
        return response.data.data
      }
      return emptyPage
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error)
      return emptyPage
    }
  }

  // Toàn bộ trả lời (cấp 2) của 1 bình luận gốc - dùng khi bấm "Xem thêm trả lời"
  async getReplies(
    postId: string,
    commentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CommentsPage> {
    const emptyPage: CommentsPage = {
      items: [],
      pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 0 }
    }
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<CommentsPage>>>(
        `/posts/${postId}/comments/${commentId}/replies`,
        { page: params?.page ?? 1, limit: params?.limit ?? 10 }
      )
      if (response.data && response.data.success && response.data.data) {
        return response.data.data
      }
      return emptyPage
    } catch (error) {
      console.error(`Error fetching replies for comment ${commentId}:`, error)
      return emptyPage
    }
  }

  // Toggle like/unlike 1 bình luận (gốc hoặc trả lời)
  async likeComment(
    postId: string,
    commentId: string
  ): Promise<{ liked: boolean; like_count: number } | null> {
    try {
      const response = await HttpService.post<
        unknown,
        AxiosResponse<ApiResponse<{ liked: boolean; like_count: number }>>
      >(`/posts/${postId}/comments/${commentId}/like`)
      if (response.data && response.data.success && response.data.data) {
        return response.data.data
      }
      return null
    } catch (error) {
      console.error(`Error toggling like for comment ${commentId}:`, error)
      return null
    }
  }

  async getPostBySlug(
    slug: string,
    lang?: string
  ): Promise<{
    post: BlogPost
    tags: string[]
    relatedPosts: BlogPost[]
  } | null> {
    try {
      let querySlug = slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
      if (isUuid) {
        const postsRes = await this.getPosts({ limit: 1000, lang })
        const found = postsRes.items.find((p) => p.id === slug)
        if (found && found.slug) {
          querySlug = found.slug
        } else {
          return null
        }
      }

      const path = lang === 'en' ? `/posts/en/${querySlug}` : `/posts/${querySlug}?lang=vi`
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ApiPostDetail>>>(
        path
      )
      if (response.data && response.data.success && response.data.data) {
        const detail = response.data.data
        const blogPost = mapApiPostToBlogPost(detail)
        const related = (detail.related_similar_posts || []).map(mapApiPostToBlogPost)
        return {
          post: blogPost,
          tags: detail.tags || [],
          relatedPosts: related
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching post by slug ${slug}:`, error)
      return null
    }
  }

  // Đăng bình luận/trả lời - trả về đúng comment server đã tạo (không tự dựng từ user store)
  async submitComment(
    postId: string,
    payload: { content: string; parentCommentId?: string; replyToCommentId?: string }
  ): Promise<ApiComment | null> {
    try {
      const response = await HttpService.post<
        { content: string; parent_comment_id?: string; reply_to_comment_id?: string },
        AxiosResponse<ApiResponse<ApiComment>>
      >(`/posts/${postId}/comments`, {
        content: payload.content,
        parent_comment_id: payload.parentCommentId,
        reply_to_comment_id: payload.replyToCommentId
      })
      if (response.data && response.data.success && response.data.data) {
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
    title_en?: string | null
    content_en?: string | null
    category: string
    tags: string[]
    scheduledAt: string | null
  }): Promise<{
    success: boolean
    message?: string
    data?: { id: string; slug: string; status: string }
  } | null> {
    try {
      const response = await HttpService.post<
        unknown,
        AxiosResponse<ApiResponse<{ id: string; slug: string; status: string }>>
      >('/posts', {
        title: postData.title,
        content: postData.content,
        title_en: postData.title_en,
        content_en: postData.content_en,
        category_id: postData.category,
        tags: postData.tags,
        scheduled_at: postData.scheduledAt
      })
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
      title_en?: string | null
      content_en?: string | null
      category: string
      tags: string[]
      scheduledAt: string | null
    }
  ): Promise<{
    success: boolean
    message?: string
    data?: { id: string; slug: string; status: string }
  } | null> {
    try {
      const response = await HttpService.put<
        unknown,
        AxiosResponse<ApiResponse<{ id: string; slug: string; status: string }>>
      >(`/posts/${id}`, {
        title: postData.title,
        content: postData.content,
        title_en: postData.title_en,
        content_en: postData.content_en,
        category_id: postData.category,
        tags: postData.tags,
        scheduled_at: postData.scheduledAt
      })
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

  async getCategories(): Promise<{ id: string; name: string; description?: string }[]> {
    try {
      const response = await HttpService.get<
        unknown,
        AxiosResponse<ApiResponse<{ id: string; name: string; description?: string }[]>>
      >('/posts/categories')
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  async getPopularPosts(limit: number = 10, lang?: string): Promise<BlogPost[]> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ApiPost[]>>>(
        '/posts/popular',
        { limit, lang }
      )

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map(mapApiPostToBlogPost)
      }
      return []
    } catch (error) {
      console.error('Error fetching popular posts:', error)
      return []
    }
  }

  async getDealByPlatform(platform: string): Promise<{
    post: BlogPost
    tags: string[]
  } | null> {
    try {
      const response = await HttpService.get<unknown, AxiosResponse<ApiResponse<ApiPostDetail>>>(
        `/posts/deals/${platform}`
      )
      if (response.data && response.data.success && response.data.data) {
        const detail = response.data.data
        const blogPost = mapApiPostToBlogPost(detail)
        return {
          post: blogPost,
          tags: detail.tags || []
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching deal post for ${platform}:`, error)
      return null
    }
  }
}

export const blogRepository = new BlogRepository()
