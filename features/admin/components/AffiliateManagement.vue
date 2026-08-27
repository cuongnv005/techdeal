<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Search,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Tag,
  Image as ImageIcon,
  MousePointerClick,
  Eye,
  Percent,
  Pencil,
  Loader2,
  Sparkles,
  UploadCloud,
  Move,
  Clock
} from 'lucide-vue-next'

import { useAdminAffiliate } from '../composables/use-affiliate'
import type { AffiliateAdItem, AffiliateAdFormPayload } from '../types/affiliate.type'

const {
  affiliateData,
  isLoadingAds,
  refreshAds,
  currentPage,
  searchQuery,
  platformFilter,
  statusFilter,
  isActionLoading,
  createAd,
  updateAd,
  toggleAdStatus,
  deleteAd,
  uploadBannerImage
} = useAdminAffiliate()

const isModalOpen = ref(false)
const editingId = ref<string | null>(null)
const isUploadingImage = ref(false)
const imageInputRef = ref<HTMLInputElement | null>(null)

const form = reactive<AffiliateAdFormPayload>({
  name: '',
  platform: 'shopee',
  image_url: '',
  image_thumb_url: '',
  image_delete_url: '',
  target_url: '',
  animation: 'zoom',
  position_vertical: 'middle',
  position_horizontal: 'right',
  offset_vertical: '20px',
  offset_horizontal: '20px',
  open_delay_ms: 2000,
  auto_close_seconds: 0,
  is_active: 1,
  priority: 0
})

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.platform = 'shopee'
  form.image_url = ''
  form.image_thumb_url = ''
  form.image_delete_url = ''
  form.target_url = ''
  form.animation = 'zoom'
  form.position_vertical = 'middle'
  form.position_horizontal = 'right'
  form.offset_vertical = '20px'
  form.offset_horizontal = '20px'
  form.open_delay_ms = 2000
  form.auto_close_seconds = 0
  form.is_active = 1
  form.priority = 0
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = (ad: AffiliateAdItem) => {
  editingId.value = ad.id
  form.name = ad.name
  form.platform = ad.platform
  form.image_url = ad.image_url
  form.image_thumb_url = ad.image_thumb_url || ''
  form.image_delete_url = ad.image_delete_url || ''
  form.target_url = ad.target_url
  form.animation = ad.animation || 'zoom'
  form.position_vertical = ad.position_vertical || 'middle'
  form.position_horizontal = ad.position_horizontal || 'right'
  form.offset_vertical = ad.offset_vertical || '20px'
  form.offset_horizontal = ad.offset_horizontal || '20px'
  form.open_delay_ms = ad.open_delay_ms ?? 2000
  form.auto_close_seconds = ad.auto_close_seconds ?? 0
  form.is_active = ad.is_active
  form.priority = ad.priority ?? 0
  isModalOpen.value = true
}

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  try {
    isUploadingImage.value = true
    const res = await uploadBannerImage(file)
    if (res && res.url) {
      form.image_url = res.url
      form.image_thumb_url = res.thumb_url || res.url
      form.image_delete_url = res.delete_url || ''
    }
  } catch (err) {
    console.error('Upload banner error:', err)
  } finally {
    isUploadingImage.value = false
    if (imageInputRef.value) {
      imageInputRef.value.value = ''
    }
  }
}

const handleSubmit = async () => {
  if (!form.name.trim() || !form.image_url.trim() || !form.target_url.trim()) {
    return
  }

  try {
    if (editingId.value) {
      await updateAd(editingId.value, form)
    } else {
      await createAd(form)
    }
    isModalOpen.value = false
    resetForm()
  } catch (err) {
    console.error('Submit error:', err)
  }
}

const handleDelete = async (id: string, name: string) => {
  if (confirm(`Bạn có chắc chắn muốn xóa banner quảng cáo "${name}"?`)) {
    await deleteAd(id)
  }
}

const getPlatformBadge = (platform: string) => {
  switch (platform) {
    case 'shopee':
      return {
        label: 'Shopee',
        class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      }
    case 'lazada':
      return {
        label: 'Lazada',
        class: 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20'
      }
    case 'tiktok':
      return {
        label: 'TikTok Shop',
        class: 'bg-zinc-800/10 text-zinc-800 dark:text-zinc-200 border-zinc-500/20'
      }
    case 'tiki':
      return {
        label: 'Tiki',
        class: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
      }
    default:
      return {
        label: 'Khác',
        class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      }
  }
}

const calculateCTR = (clicks: number, impressions: number) => {
  if (!impressions || impressions === 0) return '0.00%'
  return `${((clicks / impressions) * 100).toFixed(2)}%`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Actions -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs"
    >
      <div>
        <h2
          class="text-base font-black uppercase text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
        >
          <Tag class="w-4 h-4 text-[#3498db] dark:text-[#e74c3c]" />
          Quản lý Affiliate Floating Ads
        </h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Quản lý banner nổi affiliate Shopee, Lazada, TikTok... tự động upload ảnh lên ImgBB và đo
          lường CTR.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> Thêm Banner Ads
      </button>
    </div>

    <!-- Filters & Search -->
    <div
      class="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between"
    >
      <div class="relative w-full md:w-80">
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm theo tên banner, sản phẩm..."
          class="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db] dark:focus:border-[#e74c3c]"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select
          v-model="platformFilter"
          class="px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả nền tảng</option>
          <option value="shopee">Shopee</option>
          <option value="lazada">Lazada</option>
          <option value="tiktok">TikTok Shop</option>
          <option value="tiki">Tiki</option>
          <option value="other">Khác</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang bật (Active)</option>
          <option value="0">Đã tắt (Inactive)</option>
        </select>
      </div>
    </div>

    <!-- Ads Table List -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs overflow-hidden"
    >
      <div v-if="isLoadingAds" class="p-12 text-center text-zinc-400">
        <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2 text-[#3498db]" />
        <p class="text-xs">Đang tải danh sách banner ads...</p>
      </div>

      <div
        v-else-if="!affiliateData.items || affiliateData.items.length === 0"
        class="p-12 text-center text-zinc-500"
      >
        <ImageIcon class="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
        <p class="text-sm font-bold">Chưa có banner quảng cáo affiliate nào</p>
        <p class="text-xs text-zinc-400 mt-1">Bấm "Thêm Banner Ads" để tạo quảng cáo đầu tiên</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs text-zinc-650 dark:text-zinc-350">
          <thead
            class="bg-gray-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-150 dark:border-zinc-800"
          >
            <tr>
              <th class="px-5 py-3.5">Banner / Tên sản phẩm</th>
              <th class="px-5 py-3.5">Nền tảng</th>
              <th class="px-5 py-3.5">Vị trí</th>
              <th class="px-5 py-3.5">Hiệu ứng</th>
              <th class="px-5 py-3.5 text-center">Hiển thị / Click</th>
              <th class="px-5 py-3.5 text-center">CTR</th>
              <th class="px-5 py-3.5 text-center">Ưu tiên</th>
              <th class="px-5 py-3.5 text-center">Trạng thái</th>
              <th class="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-800">
            <tr
              v-for="ad in affiliateData.items"
              :key="ad.id"
              class="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <!-- Banner & Name -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="ad.image_thumb_url || ad.image_url"
                    :alt="ad.name"
                    class="w-12 h-12 rounded-xl object-contain bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-1 shrink-0"
                  />
                  <div class="space-y-1 max-w-xs">
                    <p class="font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {{ ad.name }}
                    </p>
                    <a
                      :href="ad.target_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-[11px] text-[#3498db] dark:text-[#e74c3c] hover:underline flex items-center gap-1 truncate"
                    >
                      <ExternalLink class="w-3 h-3 shrink-0" />
                      {{ ad.target_url }}
                    </a>
                  </div>
                </div>
              </td>

              <!-- Platform Badge -->
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border"
                  :class="getPlatformBadge(ad.platform).class"
                >
                  {{ getPlatformBadge(ad.platform).label }}
                </span>
              </td>

              <!-- Position -->
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-[11px] font-medium"
                >
                  <Move class="w-3 h-3 text-zinc-400" />
                  {{
                    ad.position_vertical === 'top'
                      ? 'Trên'
                      : ad.position_vertical === 'middle'
                        ? 'Giữa'
                        : 'Dưới'
                  }}
                  - {{ ad.position_horizontal === 'left' ? 'Trái' : 'Phải' }}
                </span>
              </td>

              <!-- Animation -->
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md text-[11px] font-semibold"
                >
                  <Sparkles class="w-3 h-3 text-amber-500" />
                  {{ ad.animation }}
                </span>
              </td>

              <!-- Stats: Impressions & Clicks -->
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <span
                    class="flex items-center gap-1 text-[11px] text-zinc-500"
                    title="Lượt hiển thị"
                  >
                    <Eye class="w-3 h-3" /> {{ ad.impressions_count.toLocaleString() }}
                  </span>
                  <span
                    class="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                    title="Lượt click"
                  >
                    <MousePointerClick class="w-3 h-3" /> {{ ad.clicks_count.toLocaleString() }}
                  </span>
                </div>
              </td>

              <!-- CTR -->
              <td class="px-5 py-4 text-center">
                <span
                  class="font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-0.5"
                >
                  <Percent class="w-3 h-3 text-zinc-400" />
                  {{ calculateCTR(ad.clicks_count, ad.impressions_count) }}
                </span>
              </td>

              <!-- Priority -->
              <td class="px-5 py-4 text-center font-bold text-zinc-700 dark:text-zinc-300">
                {{ ad.priority }}
              </td>

              <!-- Status Toggle -->
              <td class="px-5 py-4 text-center">
                <button
                  @click="toggleAdStatus(ad.id, ad.is_active)"
                  :disabled="isActionLoading"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="ad.is_active === 1 ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'"
                >
                  <span
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                    :class="ad.is_active === 1 ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(ad)"
                    class="p-1.5 text-zinc-500 hover:text-[#3498db] dark:hover:text-[#e74c3c] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                    title="Sửa banner"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDelete(ad.id, ad.name)"
                    class="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                    title="Xóa banner"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="affiliateData.pagination && affiliateData.pagination.total_pages > 1"
        class="px-5 py-4 bg-gray-50/50 dark:bg-zinc-850/30 border-t border-gray-150 dark:border-zinc-800 flex items-center justify-between"
      >
        <span class="text-xs text-zinc-500">
          Tổng cộng {{ affiliateData.pagination.total }} banner ads
        </span>
        <div class="flex items-center gap-1.5">
          <button
            v-for="p in affiliateData.pagination.total_pages"
            :key="p"
            @click="currentPage = p"
            class="w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer"
            :class="
              currentPage === p
                ? 'bg-[#3498db] dark:bg-[#e74c3c] text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'
            "
          >
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Create / Edit -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-3"
        >
          <h3
            class="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2"
          >
            <Tag class="w-4 h-4 text-[#3498db] dark:text-[#e74c3c]" />
            {{ editingId ? 'Chỉnh sửa Banner Affiliate' : 'Thêm Banner Affiliate Mới' }}
          </h3>
          <button
            @click="isModalOpen = false"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name & Platform -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2 space-y-1">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Tên Banner / Sản phẩm <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="VD: Quạt Mini Tích Điện Shopee Sale"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db]"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nền tảng</label>
              <select
                v-model="form.platform"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
              >
                <option value="shopee">Shopee</option>
                <option value="lazada">Lazada</option>
                <option value="tiktok">TikTok Shop</option>
                <option value="tiki">Tiki</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <!-- Target URL -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Link Affiliate Đích (Target URL) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.target_url"
              type="url"
              required
              placeholder="https://s.shopee.vn/... hoặc https://go.isclix.com/..."
              class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db]"
            />
          </div>

          <!-- Banner Image Upload (ImgBB) -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Hình ảnh Banner (Tự động tải lên ImgBB) <span class="text-red-500">*</span>
            </label>

            <div class="flex items-center gap-3">
              <input
                ref="imageInputRef"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              <button
                type="button"
                @click="imageInputRef?.click()"
                :disabled="isUploadingImage"
                class="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl border border-gray-200 dark:border-zinc-700 transition-all cursor-pointer"
              >
                <Loader2 v-if="isUploadingImage" class="w-4 h-4 animate-spin text-[#3498db]" />
                <UploadCloud v-else class="w-4 h-4 text-[#3498db]" />
                {{ isUploadingImage ? 'Đang tải lên ImgBB...' : 'Chọn ảnh tải lên' }}
              </button>

              <span class="text-[11px] text-zinc-400">hoặc nhập URL trực tiếp bên dưới</span>
            </div>

            <input
              v-model="form.image_url"
              type="url"
              required
              placeholder="https://i.ibb.co/.../banner.png"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db]"
            />

            <!-- Preview Image -->
            <div
              v-if="form.image_url"
              class="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 flex items-center gap-3"
            >
              <img
                :src="form.image_url"
                alt="Banner preview"
                class="w-14 h-14 object-contain rounded-lg bg-white dark:bg-zinc-900 border p-1"
              />
              <div class="text-[11px] space-y-0.5">
                <p class="font-bold text-zinc-800 dark:text-zinc-200">Xem trước ảnh Banner</p>
                <p class="text-zinc-400 break-all">{{ form.image_url }}</p>
              </div>
            </div>
          </div>

          <!-- Section: Vị trí hiển thị (Position Settings) -->
          <div
            class="p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/60 space-y-3"
          >
            <div
              class="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200"
            >
              <Move class="w-3.5 h-3.5 text-[#3498db] dark:text-[#e74c3c]" />
              <span>Vị trí hiển thị trên màn hình</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Vị trí chiều dọc
                </label>
                <select
                  v-model="form.position_vertical"
                  class="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
                >
                  <option value="middle">Ở giữa (Middle / 50%)</option>
                  <option value="bottom">Dưới cùng (Bottom)</option>
                  <option value="top">Trên cùng (Top)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Vị trí chiều ngang
                </label>
                <select
                  v-model="form.position_horizontal"
                  class="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
                >
                  <option value="right">Mép bên phải (Right)</option>
                  <option value="left">Mép bên trái (Left)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Khoảng cách dọc (Offset Vertical)
                </label>
                <input
                  v-model="form.offset_vertical"
                  type="text"
                  placeholder="20px"
                  :disabled="form.position_vertical === 'middle'"
                  class="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div class="space-y-1">
                <label class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Khoảng cách ngang (Offset Horizontal)
                </label>
                <input
                  v-model="form.offset_horizontal"
                  type="text"
                  placeholder="20px"
                  class="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Section: Hiệu ứng & Thời gian -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Hiệu ứng Animation
              </label>
              <select
                v-model="form.animation"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
              >
                <option value="zoom">Phóng to (Zoom In)</option>
                <option value="shake">Rung nhẹ (Gentle Shake)</option>
                <option value="bounce">Nhảy nảy (Bounce)</option>
                <option value="pulse">Nhịp đập phát sáng (Pulse)</option>
                <option value="none">Không có hiệu ứng (None)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Độ trễ xuất hiện (ms)
              </label>
              <input
                v-model.number="form.open_delay_ms"
                type="number"
                min="0"
                step="500"
                placeholder="2000"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db]"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Tự đóng sau (giây)
              </label>
              <input
                v-model.number="form.auto_close_seconds"
                type="number"
                min="0"
                placeholder="0 (Không đóng)"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db]"
              />
            </div>
          </div>

          <!-- Section: Độ ưu tiên & Kích hoạt -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Độ ưu tiên hiển thị (Priority)
              </label>
              <input
                v-model.number="form.priority"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#3498db]"
              />
            </div>

            <div class="flex items-center gap-2 pt-4">
              <input
                id="is_active_checkbox"
                v-model="form.is_active"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                class="w-4 h-4 text-[#3498db] rounded focus:ring-0 cursor-pointer"
              />
              <label
                for="is_active_checkbox"
                class="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Kích hoạt hiển thị (Active)
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div
            class="flex items-center justify-end gap-3 pt-3 border-t border-gray-150 dark:border-zinc-800"
          >
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isActionLoading || isUploadingImage"
              class="inline-flex items-center gap-2 px-5 py-2 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="isActionLoading" class="w-4 h-4 animate-spin" />
              {{ editingId ? 'Cập nhật' : 'Tạo Banner' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
