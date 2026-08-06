export interface BlogPost {
  id: string
  title: string
  titleEn?: string
  category: string
  categoryId?: string
  author: string
  publishDate: string
  views: number
  comments: number
  imageUrl: string
  summary: string
  summaryEn?: string
  slug: string
  slugEn?: string
  slugVi?: string
  content?: string
  contentEn?: string
  authorId?: string
  authorAvatar?: string
  authorBio?: string
  scheduledAt?: string | null
  createdAt?: string
  updatedAt?: string
  status?: string
  isHidden?: boolean
}
