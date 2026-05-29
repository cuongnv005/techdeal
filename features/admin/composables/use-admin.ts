import { AdminRepoImpl } from '../api/dashboard'

export async function useAdminStats() {
  const adminRepo = new AdminRepoImpl()

  const {
    data: stats,
    pending: isLoadingStats,
    error: statsError,
    refresh: refreshStats
  } = await useAsyncData(
    'admin-stats',
    async () => {
      const overview = await adminRepo.getOverviewStats()
      const weekly = await adminRepo.getWeeklyChartData()
      const monthly = await adminRepo.getMonthlyChartData()
      return { overview, weekly, monthly }
    },
    { server: true, default: () => ({ overview: [], weekly: [], monthly: [] }) }
  )

  return { stats, isLoadingStats, statsError, refreshStats }
}

export async function useAdminPosts() {
  const adminRepo = new AdminRepoImpl()

  const {
    data: posts,
    pending: isLoadingPosts,
    error: postsError,
    refresh: refreshPosts
  } = await useAsyncData(
    'admin-posts',
    async () => {
      return await adminRepo.getPosts()
    },
    { server: true, default: () => [] }
  )

  const deletePost = async (id: string) => {
    await adminRepo.deletePost(id)
    await refreshPosts()
  }

  return { posts, isLoadingPosts, postsError, deletePost, refreshPosts }
}

export async function useAdminComments() {
  const adminRepo = new AdminRepoImpl()

  const {
    data: comments,
    pending: isLoadingComments,
    error: commentsError,
    refresh: refreshComments
  } = await useAsyncData(
    'admin-comments',
    async () => {
      return await adminRepo.getComments()
    },
    { server: true, default: () => [] }
  )

  const deleteComment = async (id: string) => {
    await adminRepo.deleteComment(id)
    await refreshComments()
  }

  return { comments, isLoadingComments, commentsError, deleteComment, refreshComments }
}

export async function useAdminUsers() {
  const adminRepo = new AdminRepoImpl()

  const {
    data: users,
    pending: isLoadingUsers,
    error: usersError,
    refresh: refreshUsers
  } = await useAsyncData(
    'admin-users',
    async () => {
      return await adminRepo.getUsers()
    },
    { server: true, default: () => [] }
  )

  const updateUserRole = async (id: string, role: 'admin' | 'mod' | 'user') => {
    await adminRepo.updateUserRole(id, role)
    await refreshUsers()
  }

  const toggleUserStatus = async (id: string) => {
    await adminRepo.toggleUserStatus(id)
    await refreshUsers()
  }

  return { users, isLoadingUsers, usersError, updateUserRole, toggleUserStatus, refreshUsers }
}
