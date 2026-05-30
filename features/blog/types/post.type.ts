export interface BlogPost {
  id: string
  title: string
  category: string
  author: string
  publishDate: string
  views: number
  comments: number
  imageUrl: string
  summary: string
  slug: string
  content?: string
  authorId?: string
  scheduledAt?: string | null
}
