import { ref, watch } from 'vue'

import { ThreadRepoImpl } from '../api/thread'

import type { CreateThreadInput } from '../types/thread.type'

export function useAdminThreads() {
  const repo = new ThreadRepoImpl()
  const actionError = ref<string | null>(null)
  const isPending = ref(false)
  const currentPage = ref(1)
  const limit = ref(10)
  const searchQuery = ref('')

  const {
    data: threadsData,
    pending: isLoading,
    error,
    refresh
  } = useAsyncData(
    () => `thread-admin-list-p${currentPage.value}-q${searchQuery.value}`,
    async () => {
      const resp = await repo.adminList(currentPage.value, limit.value, {
        q: searchQuery.value
      })
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể lấy danh sách thread')
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

  const createThread = async (data: CreateThreadInput) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminCreate(data)
      if (resp.success) {
        await refresh()
        return resp.data.id
      } else {
        actionError.value = resp.error || 'Không thể tạo thread'
        return null
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi tạo'
      return null
    } finally {
      isPending.value = false
    }
  }

  const updateThread = async (id: string, data: Partial<CreateThreadInput>) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminUpdate(id, data)
      if (resp.success) {
        await refresh()
        return true
      } else {
        actionError.value = resp.error || 'Không thể cập nhật thread'
        return false
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi cập nhật'
      return false
    } finally {
      isPending.value = false
    }
  }

  const expireThread = async (id: string) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminExpire(id)
      if (resp.success) {
        await refresh()
        return true
      } else {
        actionError.value = resp.error || 'Không thể kết thúc deal'
        return false
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi kết thúc deal'
      return false
    } finally {
      isPending.value = false
    }
  }

  const deleteThread = async (id: string) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminDelete(id)
      if (resp.success) {
        await refresh()
        return true
      } else {
        actionError.value = resp.error || 'Không thể xóa thread'
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
    threadsData,
    isLoading,
    error,
    createThread,
    updateThread,
    expireThread,
    deleteThread,
    actionError,
    isPending,
    refresh,
    currentPage,
    searchQuery
  }
}

export async function useAdminThreadDetail(id: string) {
  const repo = new ThreadRepoImpl()

  const {
    data: detail,
    pending: isLoading,
    error,
    refresh
  } = await useAsyncData(
    `thread-admin-detail-${id}`,
    async () => {
      const resp = await repo.adminGet(id)
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể tải chi tiết thread')
      }
      return resp.data
    },
    { server: false, default: () => null }
  )

  return {
    detail,
    isLoading,
    error,
    refresh
  }
}
