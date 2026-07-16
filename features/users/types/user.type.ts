export interface UserProfile {
  id?: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  dob?: string
  from_location?: string
  gender?: string
  created_at?: string
  post_count?: number
  like_count?: number
  email?: string // local store integration
  role?: string
}

export interface UserPost {
  title: string
  slug: string
  summary: string
  created_at: string
}

export interface UserPagination {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface UserDetailsResponse {
  profile: UserProfile
  posts: UserPost[]
  pagination: UserPagination
}

export interface UserProfileUpdatePayload {
  full_name?: string
  dob?: string
  from_location?: string
  gender?: string
  bio?: string
  avatar_url?: string
}

export interface TeamMember {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: 'admin' | 'mod'
}

export interface TeamResponse {
  team: TeamMember[]
}
