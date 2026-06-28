import { ref } from 'vue'

import { AdminRepoImpl } from '../api/dashboard'

import { useUserStore } from '@stores/user'

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
  const searchQuery = ref('')
  const categoryFilter = ref('')
  const statusFilter = ref('')

  const {
    data: postsData,
    pending: isLoadingPosts,
    error: postsError,
    refresh: refreshPosts
  } = useAsyncData(
    () =>
      `admin-posts-p${currentPage.value}-q${searchQuery.value}-c${categoryFilter.value}-s${statusFilter.value}`,
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
      return await adminRepo.getPosts(currentPage.value, limit.value, {
        q: searchQuery.value,
        category: categoryFilter.value,
        status: statusFilter.value
      })
    },
    {
      watch: [currentPage, searchQuery, categoryFilter, statusFilter],
      server: false,
      default: () => ({
        items: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  watch([searchQuery, categoryFilter, statusFilter], () => {
    currentPage.value = 1
  })

  const deletePost = async (id: string): Promise<void> => {
    await adminRepo.deletePost(id)
    await refreshPosts()
  }

  const approvePost = async (id: string): Promise<void> => {
    await adminRepo.approvePost(id)
    await refreshPosts()
  }

  const unpublishPost = async (id: string): Promise<void> => {
    await adminRepo.unpublishPost(id)
    await refreshPosts()
  }

  const toggleHidePost = async (id: string): Promise<void> => {
    await adminRepo.togglePostHide(id)
    await refreshPosts()
  }

  return {
    postsData,
    isLoadingPosts,
    postsError,
    deletePost,
    approvePost,
    unpublishPost,
    toggleHidePost,
    refreshPosts,
    currentPage,
    searchQuery,
    categoryFilter,
    statusFilter
  }
}

export function useAdminComments() {
  const adminRepo = new AdminRepoImpl()
  const userStore = useUserStore()
  const currentPage = ref(1)
  const limit = ref(10)
  const searchQuery = ref('')

  const {
    data: commentsData,
    pending: isLoadingComments,
    error: commentsError,
    refresh: refreshComments
  } = useAsyncData(
    () => `admin-comments-p${currentPage.value}-q${searchQuery.value}`,
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
      return await adminRepo.getComments(currentPage.value, limit.value, {
        q: searchQuery.value
      })
    },
    {
      watch: [currentPage, searchQuery],
      server: false,
      default: () => ({
        items: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  watch(searchQuery, () => {
    currentPage.value = 1
  })

  const deleteComment = async (id: string): Promise<void> => {
    await adminRepo.deleteComment(id)
    await refreshComments()
  }

  return {
    commentsData,
    isLoadingComments,
    commentsError,
    deleteComment,
    refreshComments,
    currentPage,
    searchQuery
  }
}

export function useAdminUsers() {
  const adminRepo = new AdminRepoImpl()
  const userStore = useUserStore()
  const currentPage = ref(1)
  const limit = ref(10)
  const searchQuery = ref('')
  const roleFilter = ref('')
  const statusFilter = ref('')

  const {
    data: usersData,
    pending: isLoadingUsers,
    error: usersError,
    refresh: refreshUsers
  } = useAsyncData(
    () =>
      `admin-users-p${currentPage.value}-q${searchQuery.value}-r${roleFilter.value}-s${statusFilter.value}`,
    async () => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
        }
      }
      return await adminRepo.getUsers(currentPage.value, limit.value, {
        q: searchQuery.value,
        role: roleFilter.value,
        status: statusFilter.value
      })
    },
    {
      watch: [currentPage, searchQuery, roleFilter, statusFilter],
      server: false,
      default: () => ({
        items: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  watch([searchQuery, roleFilter, statusFilter], () => {
    currentPage.value = 1
  })

  const updateUserRole = async (id: string, role: 'admin' | 'mod' | 'user'): Promise<void> => {
    await adminRepo.updateUserRole(id, role)
    await refreshUsers()
  }

  const toggleUserStatus = async (id: string): Promise<void> => {
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
    currentPage,
    searchQuery,
    roleFilter,
    statusFilter
  }
}
