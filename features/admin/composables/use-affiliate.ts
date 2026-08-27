import { ref } from 'vue'

import { AffiliateAdminRepository } from '../api/affiliate'
import type {
  AffiliateAdItem,
  AffiliateAdFormPayload,
  AffiliateListResult
} from '../types/affiliate.type'

import { useUserStore } from '@stores/user'
import { toast } from '@shared/utils/toast'

export function useAdminAffiliate() {
  const affiliateRepo = new AffiliateAdminRepository()
  const userStore = useUserStore()

  const currentPage = ref(1)
  const limit = ref(10)
  const searchQuery = ref('')
  const platformFilter = ref('')
  const statusFilter = ref<string>('')
  const isActionLoading = ref(false)

  const {
    data: affiliateData,
    pending: isLoadingAds,
    error: adsError,
    refresh: refreshAds
  } = useAsyncData(
    () =>
      `admin-affiliate-ads-p${currentPage.value}-l${limit.value}-q${searchQuery.value}-plat${platformFilter.value}-st${statusFilter.value}`,
    async (): Promise<AffiliateListResult> => {
      if (!userStore.isAuthenticated || (userStore.role !== 'admin' && userStore.role !== 'mod')) {
        return {
          items: [],
          pagination: { page: 1, limit: 10, total: 0, total_pages: 1 }
        }
      }
      return await affiliateRepo.getAds({
        page: currentPage.value,
        limit: limit.value,
        q: searchQuery.value,
        platform: platformFilter.value || undefined,
        status: statusFilter.value !== '' ? statusFilter.value : undefined
      })
    },
    {
      server: false,
      default: () => ({
        items: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 1 }
      })
    }
  )

  const createAd = async (payload: AffiliateAdFormPayload) => {
    try {
      isActionLoading.value = true
      const res = await affiliateRepo.createAd(payload)
      toast.success('Tạo banner quảng cáo affiliate thành công')
      await refreshAds()
      return res
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi tạo banner'
      toast.error(msg)
      throw err
    } finally {
      isActionLoading.value = false
    }
  }

  const updateAd = async (id: string, payload: Partial<AffiliateAdFormPayload>) => {
    try {
      isActionLoading.value = true
      const res = await affiliateRepo.updateAd(id, payload)
      toast.success('Cập nhật banner quảng cáo thành công')
      await refreshAds()
      return res
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi cập nhật banner'
      toast.error(msg)
      throw err
    } finally {
      isActionLoading.value = false
    }
  }

  const toggleAdStatus = async (id: string, currentStatus: number) => {
    try {
      isActionLoading.value = true
      const newStatus = currentStatus === 1 ? 0 : 1
      await affiliateRepo.toggleAdStatus(id, newStatus)
      toast.success(`Đã ${newStatus === 1 ? 'bật' : 'tắt'} banner quảng cáo`)
      await refreshAds()
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi đổi trạng thái'
      toast.error(msg)
    } finally {
      isActionLoading.value = false
    }
  }

  const deleteAd = async (id: string) => {
    try {
      isActionLoading.value = true
      await affiliateRepo.deleteAd(id)
      toast.success('Xóa banner quảng cáo thành công')
      await refreshAds()
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi xóa banner'
      toast.error(msg)
      throw err
    } finally {
      isActionLoading.value = false
    }
  }

  const uploadBannerImage = async (file: File) => {
    try {
      isActionLoading.value = true
      const res = await affiliateRepo.uploadImage(file)
      return res
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi tải ảnh lên ImgBB'
      toast.error(msg)
      throw err
    } finally {
      isActionLoading.value = false
    }
  }

  return {
    affiliateData,
    isLoadingAds,
    adsError,
    refreshAds,
    currentPage,
    limit,
    searchQuery,
    platformFilter,
    statusFilter,
    isActionLoading,
    createAd,
    updateAd,
    toggleAdStatus,
    deleteAd,
    uploadBannerImage
  }
}
