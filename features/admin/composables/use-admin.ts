import { ref } from 'vue'
import { useUserStore } from '@stores/user'
import { AdminRepoImpl } from '../api/dashboard'

export async function useAdminStats() {
  const adminRepo = new AdminRepoImpl()
  const userStore = useUserStore()

  const {
    data: stats,
    pending: isLoadingStats,
    error: statsError,
    refresh: refreshStats
  } = await useAsyncData(
    'admin-stats',
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return { overview: [], weekly: [], monthly: [] }
      }
      const overview = await adminRepo.getOverviewStats()
      const weekly = await adminRepo.getWeeklyChartData()
      const monthly = await adminRepo.getMonthlyChartData()
      return { overview, weekly, monthly }
    },
    { server: false, default: () => ({ overview: [], weekly: [], monthly: [] }) }
  )

  return { stats, isLoadingStats, statsError, refreshStats }
}

export function useAdminPosts() {
  const adminRepo = new AdminRepoImpl()
  const userStore = useUserStore()
  const currentPage = ref(1)
  const limit = ref(10)

  const {
    data: postsData,
    pending: isLoadingPosts,
    error: postsError,
    refresh: refreshPosts
  } = useAsyncData(
    () => `admin-posts-page-${currentPage.value}`,
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
      return await adminRepo.getPosts(currentPage.value, limit.value)
    },
    {
      watch: [currentPage],
      server: false,
      default: () => ({
        items: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  const deletePost = async (id: string) => {
    await adminRepo.deletePost(id)
    await refreshPosts()
  }

  const toggleHidePost = async (id: string) => {
    await adminRepo.togglePostHide(id)
    await refreshPosts()
  }

  return {
    postsData,
    isLoadingPosts,
    postsError,
    deletePost,
    toggleHidePost,
    refreshPosts,
    currentPage
  }
}

export function useAdminComments() {
  const adminRepo = new AdminRepoImpl()
  const userStore = useUserStore()
  const currentPage = ref(1)
  const limit = ref(10)

  const {
    data: commentsData,
    pending: isLoadingComments,
    error: commentsError,
    refresh: refreshComments
  } = useAsyncData(
    () => `admin-comments-page-${currentPage.value}`,
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
      return await adminRepo.getComments(currentPage.value, limit.value)
    },
    {
      watch: [currentPage],
      server: false,
      default: () => ({
        items: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  const deleteComment = async (id: string) => {
    await adminRepo.deleteComment(id)
    await refreshComments()
  }

  return {
    commentsData,
    isLoadingComments,
    commentsError,
    deleteComment,
    refreshComments,
    currentPage
  }
}

export function useAdminUsers() {
  const adminRepo = new AdminRepoImpl()
  const userStore = useUserStore()
  const currentPage = ref(1)
  const limit = ref(10)

  const {
    data: usersData,
    pending: isLoadingUsers,
    error: usersError,
    refresh: refreshUsers
  } = useAsyncData(
    () => `admin-users-page-${currentPage.value}`,
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
      return await adminRepo.getUsers(currentPage.value, limit.value)
    },
    {
      watch: [currentPage],
      server: false,
      default: () => ({
        items: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  const updateUserRole = async (id: string, role: 'admin' | 'mod' | 'user') => {
    await adminRepo.updateUserRole(id, role)
    await refreshUsers()
  }

  const toggleUserStatus = async (id: string) => {
    await adminRepo.toggleUserStatus(id)
    await refreshUsers()
  }

  return {
    usersData,
    isLoadingUsers,
    usersError,
    updateUserRole,
    toggleUserStatus,
    refreshUsers,
    currentPage
  }
}
