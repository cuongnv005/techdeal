export interface BlogPost {
  id: string
  title: string
  category: string
  categoryId?: string
  author: string
  publishDate: string
  views: number
  comments: number
  imageUrl: string
  summary: string
  slug: string
  content?: string
  authorId?: string
  authorAvatar?: string
  authorBio?: string
  scheduledAt?: string | null
  createdAt?: string
  updatedAt?: string
  status?: string
  isHidden?: boolean
}
