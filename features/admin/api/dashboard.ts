import type { StatItem, ChartDataPoint, PostItem, CommentItem, UserItem } from '../types/dashboard.type'

export abstract class AdminRepository {
  abstract getOverviewStats(): Promise<StatItem[]>
  abstract getWeeklyChartData(): Promise<ChartDataPoint[]>
  abstract getMonthlyChartData(): Promise<ChartDataPoint[]>
  abstract getPosts(): Promise<PostItem[]>
  abstract deletePost(id: string): Promise<void>
  abstract getComments(): Promise<CommentItem[]>
  abstract deleteComment(id: string): Promise<void>
  abstract getUsers(): Promise<UserItem[]>
  abstract updateUserRole(id: string, role: 'admin' | 'mod' | 'user'): Promise<UserItem>
  abstract toggleUserStatus(id: string): Promise<UserItem>
}

// In-memory mock databases to simulate state changes on the client
let mockPosts: PostItem[] = [
  { id: '1', title: 'realme 16 Pro và realme 16 5G ra mắt: camera đa tiêu cự 200MP', author: 'Mr.X', category: 'Technology', publishDate: '2026-05-28', views: 406, comments: 1 },
  { id: '2', title: 'Tai nghe soundcore R60i NC: tai nghe chống ồn dưới 1 triệu', author: 'TRKD', category: 'Gadget', publishDate: '2026-05-28', views: 1355, comments: 2 },
  { id: '3', title: 'Tim Cook hé lộ tính năng Apple Intelligence được yêu thích nhất', author: 'Mr.X', category: 'Technology', publishDate: '2026-05-28', views: 210, comments: 0 },
  { id: '4', title: 'Google ra mắt bản thử nghiệm Android 16: Tập trung vào bảo mật', author: 'Admin', category: 'Android', publishDate: '2026-05-28', views: 1210, comments: 9 },
  { id: '5', title: 'NVIDIA RTX 5090 chính thức lộ diện cấu hình khủng GDDR7', author: 'Hardware Specialist', category: 'PC máy tính', publishDate: '2026-05-27', views: 3890, comments: 24 }
]

let mockComments: CommentItem[] = [
  { id: 'c1', content: 'Tai nghe soundcore này dùng tốt lắm, pin cực kỳ trâu!', author: 'hoang_long', postTitle: 'Tai nghe soundcore R60i NC', date: '2026-05-28 14:22' },
  { id: 'c2', content: 'Ước gì được trên tay RTX 5090 sớm nhất có thể.', author: 'pc_master_race', postTitle: 'NVIDIA RTX 5090 chính thức lộ diện', date: '2026-05-28 15:10' },
  { id: 'c3', content: 'Android 16 khi nào chính thức hỗ trợ dòng máy Pixel cũ?', author: 'android_dev', postTitle: 'Google ra mắt bản thử nghiệm Android 16', date: '2026-05-28 17:05' }
]

let mockUsers: UserItem[] = [
  { id: 'u1', username: 'admin_cuong', email: 'admin@techdeal.vn', role: 'admin', status: 'active', joinDate: '2026-01-15' },
  { id: 'u2', username: 'mod_quynh', email: 'quynh@techdeal.vn', role: 'mod', status: 'active', joinDate: '2026-02-10' },
  { id: 'u3', username: 'thanh_vien_1', email: 'tv1@gmail.com', role: 'user', status: 'active', joinDate: '2026-03-01' },
  { id: 'u4', username: 'thanh_vien_spammer', email: 'spammer@gmail.com', role: 'user', status: 'blocked', joinDate: '2026-04-20' }
]

export class AdminRepoImpl implements AdminRepository {
  async getOverviewStats(): Promise<StatItem[]> {
    // Calculate summaries based on mock DB states
    return [
      { label: 'Tổng lượt xem bài viết', value: '16.480', trend: 18.2, isPositive: true },
      { label: 'Tổng số bài viết', value: mockPosts.length, trend: 12.5, isPositive: true },
      { label: 'Tổng số bình luận', value: mockComments.length, trend: 8.7, isPositive: true },
      { label: 'Tổng số thành viên', value: mockUsers.length, trend: 4.1, isPositive: true }
    ]
  }

  async getWeeklyChartData(): Promise<ChartDataPoint[]> {
    return [
      { label: 'Thứ 2', views: 1200, posts: 2 },
      { label: 'Thứ 3', views: 1900, posts: 4 },
      { label: 'Thứ 4', views: 1500, posts: 1 },
      { label: 'Thứ 5', views: 2400, posts: 3 },
      { label: 'Thứ 6', views: 3100, posts: 5 },
      { label: 'Thứ 7', views: 4200, posts: 6 },
      { label: 'Chủ Nhật', views: 3800, posts: 2 }
    ]
  }

  async getMonthlyChartData(): Promise<ChartDataPoint[]> {
    return [
      { label: 'Tuần 1', views: 12000, posts: 12 },
      { label: 'Tuần 2', views: 15400, posts: 15 },
      { label: 'Tuần 3', views: 18900, posts: 22 },
      { label: 'Tuần 4', views: 21000, posts: 18 }
    ]
  }

  async getPosts(): Promise<PostItem[]> {
    return [...mockPosts]
  }

  async deletePost(id: string): Promise<void> {
    mockPosts = mockPosts.filter((p) => p.id !== id)
  }

  async getComments(): Promise<CommentItem[]> {
    return [...mockComments]
  }

  async deleteComment(id: string): Promise<void> {
    mockComments = mockComments.filter((c) => c.id !== id)
  }

  async getUsers(): Promise<UserItem[]> {
    return [...mockUsers]
  }

  async updateUserRole(id: string, role: 'admin' | 'mod' | 'user'): Promise<UserItem> {
    const user = mockUsers.find((u) => u.id === id)
    if (!user) throw new Error('User not found')
    user.role = role
    return { ...user }
  }

  async toggleUserStatus(id: string): Promise<UserItem> {
    const user = mockUsers.find((u) => u.id === id)
    if (!user) throw new Error('User not found')
    user.status = user.status === 'active' ? 'blocked' : 'active'
    return { ...user }
  }
}
