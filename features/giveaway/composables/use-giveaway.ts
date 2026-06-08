import { ref } from 'vue'
import { GiveawayRepoImpl } from '../api/giveaway'
import type { CreateGiveawayInput } from '../types/giveaway.type'

export async function usePublicGiveaway(id: string) {
  const repo = new GiveawayRepoImpl()
  const claimError = ref<string | null>(null)
  const isClaiming = ref(false)

  const {
    data: giveaway,
    pending: isLoading,
    error,
    refresh
  } = await useAsyncData(
    `giveaway-public-${id}`,
    async () => {
      const resp = await repo.getPublicDetail(id)
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể lấy thông tin chương trình giveaway')
      }
      return resp.data
    },
    { server: false, default: () => null }
  )

  const claim = async () => {
    isClaiming.value = true
    claimError.value = null
    try {
      const resp = await repo.claimKey(id)
      if (resp.success && resp.data?.activation_link) {
        await refresh()
        return resp.data.activation_link
      } else {
        claimError.value = resp.error || 'Không thể nhận key bản quyền'
        return null
      }
    } catch (e: any) {
      claimError.value = e.message || 'Có lỗi xảy ra khi nhận key'
      return null
    } finally {
      isClaiming.value = false
    }
  }

  return {
    giveaway,
    isLoading,
    error,
    claim,
    claimError,
    isClaiming,
    refresh
  }
}

export async function useAdminGiveaways() {
  const repo = new GiveawayRepoImpl()
  const actionError = ref<string | null>(null)
  const isPending = ref(false)

  const {
    data: giveaways,
    pending: isLoading,
    error,
    refresh
  } = await useAsyncData(
    'giveaway-admin-list',
    async () => {
      const resp = await repo.adminList()
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể lấy danh sách chương trình giveaway')
      }
      return resp.data || []
    },
    { server: false, default: () => [] }
  )

  const createGiveaway = async (data: CreateGiveawayInput) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminCreate(data)
      if (resp.success) {
        await refresh()
        return resp.data.id
      } else {
        actionError.value = resp.error || 'Không thể tạo giveaway'
        return null
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi tạo'
      return null
    } finally {
      isPending.value = false
    }
  }

  const updateGiveaway = async (id: string, data: Partial<CreateGiveawayInput>) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminUpdate(id, data)
      if (resp.success) {
        await refresh()
        return true
      } else {
        actionError.value = resp.error || 'Không thể cập nhật giveaway'
        return false
      }
    } catch (e: any) {
      actionError.value = e.message || 'Có lỗi xảy ra khi cập nhật'
      return false
    } finally {
      isPending.value = false
    }
  }

  const finishGiveaway = async (id: string) => {
    // End the giveaway by setting expiry date to 1 day in the past
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    return await updateGiveaway(id, { expiry_date: pastDate })
  }

  const deleteGiveaway = async (id: string) => {
    isPending.value = true
    actionError.value = null
    try {
      const resp = await repo.adminDelete(id)
      if (resp.success) {
        await refresh()
        return true
      } else {
        actionError.value = resp.error || 'Không thể xóa giveaway'
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
    giveaways,
    isLoading,
    error,
    createGiveaway,
    updateGiveaway,
    finishGiveaway,
    deleteGiveaway,
    actionError,
    isPending,
    refresh
  }
}

export async function useAdminGiveawayDetail(id: string) {
  const repo = new GiveawayRepoImpl()

  const {
    data: detail,
    pending: isLoading,
    error,
    refresh
  } = await useAsyncData(
    `giveaway-admin-detail-${id}`,
    async () => {
      const resp = await repo.adminGet(id)
      if (!resp.success) {
        throw new Error(resp.error || 'Không thể tải chi tiết giveaway')
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
