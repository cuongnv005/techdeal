import { ref } from 'vue'

import { shortlinkRepository } from '../api/shortlink'

import type { CreateShortlinkInput } from '../types/shortlink.type'

export function useAdminShortlinks() {
  const repo = shortlinkRepository
  const actionError = ref<string | null>(null)
  const isPending = ref(false)
  const currentPage = ref(1)
  const limit = ref(10)
  const searchQuery = ref('')

  const {
    data: shortlinksData,
    pending: isLoading,
    error,
    refresh
  } = useAsyncData(
    () => `shortlinks-admin-list-p${currentPage.value}-q${searchQuery.value}`,
    async () => {
      const resp = await repo.adminList(currentPage.value, limit.value, {
        q: searchQuery.value
      })
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể lấy danh sách shortlinks')
      }
      return resp.data
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

  const createShortlink = async (data: CreateShortlinkInput) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminCreate(data)
      if (resp.success) {
        await refresh()
        return resp.data
      } else {
        actionError.value = resp.error || 'Không thể tạo shortlink'
        return null
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi tạo'
      return null
    } finally {
      isPending.value = false
    }
  }

  const deleteShortlink = async (id: string) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminDelete(id)
      if (resp.success) {
        await refresh()
        return true
      } else {
        actionError.value = resp.error || 'Không thể xóa shortlink'
        return false
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi xóa'
      return false
    } finally {
      isPending.value = false
    }
  }

  return {
    shortlinksData,
    isLoading,
    error,
    createShortlink,
    deleteShortlink,
    actionError,
    isPending,
    currentPage,
    searchQuery,
    refresh
  }
}

export function usePublicShortlink(hash: string) {
  const repo = shortlinkRepository

  const {
    data: shortlink,
    pending: isLoading,
    error
  } = useAsyncData(
    `shortlink-public-${hash}`,
    async () => {
      const resp = await repo.getPublicDetail(hash)
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể lấy thông tin liên kết')
      }
      return resp.data
    },
    { server: false, default: () => null }
  )

  const recordClick = async (referrer: string) => {
    try {
      await repo.recordClick(hash, referrer)
    } catch (e) {
      console.error('Error recording click:', e)
    }
  }

  return {
    shortlink,
    isLoading,
    error,
    recordClick
  }
}

export function useAdminShortlinkStats(id: string) {
  const repo = shortlinkRepository

  const {
    data: stats,
    pending: isLoading,
    error,
    refresh
  } = useAsyncData(
    `shortlink-stats-${id}`,
    async () => {
      const resp = await repo.adminStats(id)
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể tải thống kê liên kết')
      }
      return resp.data
    },
    { server: false, default: () => null }
  )

  return {
    stats,
    isLoading,
    error,
    refresh
  }
}
