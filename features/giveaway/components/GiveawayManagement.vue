<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import {
  Search,
  Plus,
  Copy,
  Clock,
  Trash2,
  X,
  ExternalLink,
  Eye,
  Key,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Pencil,
  Tag
} from 'lucide-vue-next'

import { ThreadRepoImpl } from '../../thread/api/thread'
import { useAdminGiveaways, useAdminGiveawayDetail } from '../composables/use-giveaway'

import type { Thread } from '../../thread/types/thread.type'
import type { Giveaway, CreateGiveawayInput, GiveawayAdminDetail } from '../types/giveaway.type'

const {
  giveawaysData,
  isLoading,
  createGiveaway,
  updateGiveaway,
  finishGiveaway,
  deleteGiveaway,
  actionError,
  currentPage,
  searchQuery
} = useAdminGiveaways()

// Modals state
const isCreateModalOpen = ref(false)
const isEditMode = ref(false)
const editingGiveawayId = ref<string | null>(null)
const isDetailsModalOpen = ref(false)
const selectedGiveawayId = ref<string | null>(null)
const detailsLoading = ref(false)
const detailsData = ref<GiveawayAdminDetail | null>(null)

// Create Form fields
const form = ref<CreateGiveawayInput>({
  app_name: '',
  activation_link: '',
  key_quantity: 10,
  original_price: 0,
  expiry_date: '',
  is_block: false,
  image_url: ''
})

// --- Gắn deal (thread) vào giveaway — hiện CTA mở/cài TechDeal app trên /giveaway ---
const threadRepo = new ThreadRepoImpl()
const selectedThread = ref<{ id: string; app_name: string } | null>(null)
const threadSearchQuery = ref('')
const threadSearchResults = ref<Thread[]>([])
const isSearchingThreads = ref(false)
const isThreadDropdownOpen = ref(false)
let threadSearchTimer: ReturnType<typeof setTimeout> | null = null

watch(threadSearchQuery, (q) => {
  if (threadSearchTimer) clearTimeout(threadSearchTimer)
  if (!q.trim()) {
    threadSearchResults.value = []
    return
  }
  threadSearchTimer = setTimeout(async () => {
    isSearchingThreads.value = true
    try {
      const resp = await threadRepo.adminList(1, 8, { q: q.trim() })
      threadSearchResults.value = resp.success ? resp.data.items : []
    } finally {
      isSearchingThreads.value = false
    }
  }, 350)
})

const selectThread = (thread: Thread) => {
  selectedThread.value = { id: thread.id, app_name: thread.app_name }
  isThreadDropdownOpen.value = false
  threadSearchQuery.value = ''
  threadSearchResults.value = []
}

const clearSelectedThread = () => {
  selectedThread.value = null
}

const paginatedGiveaways = computed(() => giveawaysData.value?.items || [])
const filteredGiveaways = paginatedGiveaways

const totalPages = computed(() => {
  return giveawaysData.value?.pagination?.total_pages || 1
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    const start = Math.max(2, currentPage.value - 1)
    const end = Math.min(total - 1, currentPage.value + 1)
    if (start > 2) {
      pages.push('...')
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (end < total - 1) {
      pages.push('...')
    }
    pages.push(total)
  }
  return pages
})

watch(searchQuery, () => {
  currentPage.value = 1
})

// Action triggers
const openCreateModal = (): void => {
  isEditMode.value = false
  editingGiveawayId.value = null
  const targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const tzOffset = targetDate.getTimezoneOffset() * 60000 // offset in milliseconds
  const localISODate = new Date(targetDate.getTime() - tzOffset).toISOString().slice(0, 16)

  form.value = {
    app_name: '',
    activation_link: '',
    key_quantity: 10,
    original_price: 0,
    expiry_date: localISODate, // Default 7 days from now in local time
    is_block: false,
    image_url: ''
  }
  selectedThread.value = null
  threadSearchQuery.value = ''
  threadSearchResults.value = []
  isCreateModalOpen.value = true
}

const openEditModal = (giveaway: Giveaway): void => {
  isEditMode.value = true
  editingGiveawayId.value = giveaway.id

  let localISODate = ''
  if (giveaway.expiry_date) {
    const targetDate = new Date(giveaway.expiry_date)
    const tzOffset = targetDate.getTimezoneOffset() * 60000
    localISODate = new Date(targetDate.getTime() - tzOffset).toISOString().slice(0, 16)
  }

  form.value = {
    app_name: giveaway.app_name,
    activation_link: giveaway.activation_link,
    key_quantity: giveaway.key_quantity,
    original_price: giveaway.original_price,
    expiry_date: localISODate,
    is_block: giveaway.is_block !== false,
    image_url: giveaway.image_url || ''
  }
  selectedThread.value = giveaway.deal_thread_id
    ? { id: giveaway.deal_thread_id, app_name: giveaway.deal_app_name || giveaway.deal_thread_id }
    : null
  threadSearchQuery.value = ''
  threadSearchResults.value = []
  isCreateModalOpen.value = true
}

const handleSubmitForm = async (): Promise<void> => {
  // Format expiry_date as ISO string
  const formattedData: CreateGiveawayInput = {
    ...form.value,
    expiry_date: new Date(form.value.expiry_date).toISOString(),
    deal_thread_id: selectedThread.value?.id || null
  }

  if (isEditMode.value && editingGiveawayId.value) {
    const success = await updateGiveaway(editingGiveawayId.value, formattedData)
    if (success) {
      isCreateModalOpen.value = false
    }
  } else {
    const resultId = await createGiveaway(formattedData)
    if (resultId) {
      isCreateModalOpen.value = false
    }
  }
}

const toggleBlock = async (giveaway: Giveaway) => {
  await updateGiveaway(giveaway.id, { is_block: giveaway.is_block !== false ? false : true })
}

const handleFinish = async (id: string) => {
  if (confirm('Bạn có chắc chắn muốn kết thúc chương trình giveaway này ngay lập tức?')) {
    await finishGiveaway(id)
  }
}

const handleDelete = async (id: string) => {
  if (
    confirm(
      'Bạn có chắc chắn muốn xóa chương trình giveaway này không? Hành động này không thể hoàn tác.'
    )
  ) {
    await deleteGiveaway(id)
  }
}

const visibleClaimsCount = ref(5)

const viewDetails = async (id: string) => {
  selectedGiveawayId.value = id
  isDetailsModalOpen.value = true
  detailsLoading.value = true
  detailsData.value = null
  visibleClaimsCount.value = 5

  try {
    const { detail, refresh } = await useAdminGiveawayDetail(id)
    await refresh()
    detailsData.value = detail.value
  } catch (err) {
    console.error(err)
  } finally {
    detailsLoading.value = false
  }
}

const handleClaimsScroll = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 15) {
    if (detailsData.value && visibleClaimsCount.value < detailsData.value.claims.length) {
      visibleClaimsCount.value += 5
    }
  }
}

// Copy link
const copiedId = ref<string | null>(null)

const fallbackCopyText = (text: string, id: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (err) {
    console.error('Fallback copy failed', err)
  }
  document.body.removeChild(textArea)
}

const copyLink = (id: string) => {
  if (process.client) {
    const link = `${window.location.origin}/giveaway?id=${id}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          copiedId.value = id
          setTimeout(() => {
            copiedId.value = null
          }, 2000)
        })
        .catch(() => {
          fallbackCopyText(link, id)
        })
    } else {
      fallbackCopyText(link, id)
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn text-zinc-800 dark:text-zinc-200">
    <!-- Action bar -->
    <div
      class="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="relative w-full sm:max-w-xs">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm tên ứng dụng..."
          class="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
      </div>

      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
      >
        <Plus class="w-4 h-4" /> Tạo Giveaway mới
      </button>
    </div>

    <!-- Error notice -->
    <div
      v-if="actionError"
      class="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs flex items-center gap-2"
    >
      <AlertCircle class="w-4 h-4" />
      <span>{{ actionError }}</span>
    </div>

    <!-- Giveaway list table -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div v-if="isLoading" class="p-12 text-center text-xs text-zinc-400">
        Đang tải danh sách giveaway...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4">Tên Ứng Dụng</th>
              <th class="px-6 py-4">Số lượng Key</th>
              <th class="px-6 py-4">Giá gốc</th>
              <th class="px-6 py-4">Thời Hạn</th>
              <th class="px-6 py-4">Bảo Mật</th>
              <th class="px-6 py-4">Trạng Thái</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="giveaway in paginatedGiveaways"
              :key="giveaway.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-xs text-zinc-900 dark:text-white">
                {{ giveaway.app_name }}
                <span
                  v-if="giveaway.deal_thread_id"
                  class="mt-1 flex w-fit items-center gap-1 bg-[#3498db]/10 dark:bg-[#e74c3c]/10 text-[#3498db] dark:text-[#e74c3c] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                >
                  <Tag class="w-2.5 h-2.5" /> Deal:
                  {{ giveaway.deal_app_name || giveaway.deal_thread_id }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs font-semibold">
                {{ giveaway.keys_claimed }} / {{ giveaway.key_quantity }}
              </td>
              <td class="px-6 py-4 text-xs font-semibold">
                {{ formatPrice(giveaway.original_price) }}
              </td>
              <td class="px-6 py-4 text-xs font-medium text-zinc-550 dark:text-zinc-400">
                {{ formatDate(giveaway.expiry_date) }}
              </td>
              <td class="px-6 py-4">
                <button
                  @click="toggleBlock(giveaway)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all border cursor-pointer select-none"
                  :class="
                    giveaway.is_block !== false
                      ? 'bg-red-500/10 text-red-550 border-red-500/20 hover:bg-red-500/20'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                  "
                  title="Click để thay đổi chế độ chặn truy cập trực tiếp"
                >
                  <ShieldCheck class="w-3.5 h-3.5" v-if="giveaway.is_block !== false" />
                  <span>{{ giveaway.is_block !== false ? 'Chặn Direct' : 'Không Chặn' }}</span>
                </button>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  :class="
                    giveaway.is_expired
                      ? 'bg-red-500/10 text-red-550 border-red-500/20'
                      : giveaway.is_out_of_keys
                        ? 'bg-amber-500/10 text-amber-555 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  "
                >
                  {{
                    giveaway.is_expired
                      ? 'Đã hết hạn'
                      : giveaway.is_out_of_keys
                        ? 'Hết key'
                        : 'Hoạt động'
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="copyLink(giveaway.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-[#3498db] hover:bg-[#3498db]/10 flex items-center gap-1 text-[10px]"
                    :title="'Sao chép link'"
                  >
                    <Copy class="w-4 h-4" />
                    <span>{{ copiedId === giveaway.id ? 'Copied!' : 'Copy Link' }}</span>
                  </button>

                  <button
                    @click="viewDetails(giveaway.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                    title="Xem chi tiết người đã nhận key"
                  >
                    <Eye class="w-4 h-4" />
                  </button>

                  <button
                    @click="openEditModal(giveaway)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-[#3498db] hover:bg-[#3498db]/10"
                    title="Chỉnh sửa chương trình"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    v-if="!giveaway.is_expired"
                    @click="handleFinish(giveaway.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                    title="Kết thúc chương trình"
                  >
                    <Clock class="w-4 h-4" />
                  </button>

                  <button
                    @click="handleDelete(giveaway.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-red-550 hover:bg-red-550/10"
                    title="Xóa chương trình"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredGiveaways.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Không tìm thấy chương trình giveaway nào...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination controls -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-2 pt-2 flex-wrap select-none"
    >
      <button
        :disabled="currentPage <= 1"
        @click="currentPage--"
        class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Trước
      </button>
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 py-2 text-xs font-bold text-zinc-400 select-none">
          ...
        </span>
        <button
          v-else
          @click="currentPage = Number(page)"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          :class="
            currentPage === page
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
              : 'bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850'
          "
        >
          {{ page }}
        </button>
      </template>
      <button
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
        class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-255 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Sau
      </button>
    </div>

    <!-- Modals -->

    <!-- Create Giveaway Modal -->
    <div
      v-if="isCreateModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-zinc-800"
        >
          <h3 class="text-xs font-black uppercase text-zinc-900 dark:text-white">
            {{ isEditMode ? 'Chỉnh sửa chương trình Giveaway' : 'Tạo chương trình Giveaway mới' }}
          </h3>
          <button
            @click="isCreateModalOpen = false"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleSubmitForm" class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Tên Ứng Dụng</label
            >
            <input
              v-model="form.app_name"
              type="text"
              required
              placeholder="Ví dụ: CCleaner Pro, Internet Download Manager..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Link Kích Hoạt Bản Quyền</label
            >
            <input
              v-model="form.activation_link"
              type="url"
              required
              placeholder="https://..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
                >Số lượng Key</label
              >
              <input
                v-model.number="form.key_quantity"
                type="number"
                required
                min="1"
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
                >Giá gốc ($)</label
              >
              <input
                v-model.number="form.original_price"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="Ví dụ: 99.99"
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Hạn nhận (Giờ & Ngày)</label
            >
            <input
              v-model="form.expiry_date"
              type="datetime-local"
              required
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="space-y-1 pt-2 border-t border-gray-150 dark:border-zinc-800">
            <label
              class="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1"
            >
              <Tag class="w-3 h-3" /> Liên kết tới Deal (Tùy chọn — bật CTA mở/cài TechDeal app)
            </label>

            <div
              v-if="selectedThread"
              class="flex items-center justify-between gap-2 bg-[#3498db]/10 dark:bg-[#e74c3c]/10 px-3 py-2 rounded-xl"
            >
              <span class="text-xs font-bold text-[#3498db] dark:text-[#e74c3c] truncate">
                {{ selectedThread.app_name }}
              </span>
              <button
                type="button"
                @click="clearSelectedThread"
                class="text-zinc-400 hover:text-red-500 cursor-pointer shrink-0"
                title="Bỏ gắn deal"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>

            <div v-else class="relative">
              <input
                v-model="threadSearchQuery"
                type="text"
                placeholder="Gõ tên app để tìm thread..."
                @focus="isThreadDropdownOpen = true"
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
              <div
                v-if="isThreadDropdownOpen && threadSearchQuery.trim()"
                class="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-48 overflow-y-auto"
              >
                <div v-if="isSearchingThreads" class="px-3 py-2.5 text-[10px] text-zinc-400">
                  Đang tìm...
                </div>
                <template v-else>
                  <button
                    v-for="thread in threadSearchResults"
                    :key="thread.id"
                    type="button"
                    @click="selectThread(thread)"
                    class="w-full text-left px-3 py-2.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer"
                  >
                    {{ thread.app_name }}
                  </button>
                  <div
                    v-if="threadSearchResults.length === 0"
                    class="px-3 py-2.5 text-[10px] text-zinc-400 italic"
                  >
                    Không tìm thấy thread nào
                  </div>
                </template>
              </div>
            </div>
            <p class="text-[9px] text-zinc-400">
              Không liên quan tới Link Kích Hoạt Bản Quyền ở trên — chỉ dùng để hiện thêm 1 CTA
              mở/cài TechDeal app trên trang giveaway, không ảnh hưởng luồng nhận key hiện tại.
            </p>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Link ảnh hướng dẫn nhận giveaway (Tùy chọn)</label
            >
            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="flex items-center gap-2 py-2">
            <input
              v-model="form.is_block"
              type="checkbox"
              id="is_block"
              class="w-4 h-4 text-[#3498db] dark:text-[#e74c3c] border-gray-300 rounded focus:ring-[#3498db]"
            />
            <label
              for="is_block"
              class="text-[10px] font-bold uppercase tracking-wider text-zinc-450 cursor-pointer"
            >
              Chặn truy cập trực tiếp (Yêu cầu đi từ trang web TechDeal)
            </label>
          </div>

          <div
            class="flex items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-zinc-800"
          >
            <button
              type="button"
              @click="isCreateModalOpen = false"
              class="px-4 py-2 border border-gray-200 dark:border-zinc-850 text-xs font-bold rounded-xl text-zinc-550 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isPending"
              class="px-4 py-2 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
            >
              {{
                isPending
                  ? isEditMode
                    ? 'Đang lưu...'
                    : 'Đang tạo...'
                  : isEditMode
                    ? 'Cập nhật'
                    : 'Tạo mới'
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="isDetailsModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-zinc-800"
        >
          <h3 class="text-xs font-black uppercase text-zinc-900 dark:text-white">
            Chi tiết & Lịch sử nhận key
          </h3>
          <button
            @click="isDetailsModalOpen = false"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div v-if="detailsLoading" class="text-center py-8 text-xs text-zinc-400">
            Đang tải dữ liệu...
          </div>
          <div v-else-if="!detailsData" class="text-center py-8 text-xs text-zinc-400">
            Không tìm thấy thông tin.
          </div>
          <template v-else>
            <!-- Details Overview -->
            <div
              class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-150 dark:border-zinc-850 text-xs"
            >
              <div class="space-y-1">
                <div class="text-[10px] text-zinc-400 uppercase font-bold">Ứng dụng</div>
                <div class="font-bold text-zinc-900 dark:text-white">
                  {{ detailsData.app_name }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="text-[10px] text-zinc-400 uppercase font-bold">Số lượng key</div>
                <div class="font-bold text-zinc-900 dark:text-white">
                  {{ detailsData.keys_claimed }} / {{ detailsData.key_quantity }} đã nhận
                </div>
              </div>
              <div class="space-y-1">
                <div class="text-[10px] text-zinc-400 uppercase font-bold">Hạn dùng</div>
                <div class="font-semibold text-zinc-600 dark:text-zinc-350">
                  {{ formatDate(detailsData.expiry_date) }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="text-[10px] text-zinc-400 uppercase font-bold">Link gốc</div>
                <a
                  :href="detailsData.activation_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-[#3498db] dark:text-[#e74c3c] hover:underline flex items-center gap-1 break-all"
                >
                  Link kích hoạt <ExternalLink class="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            <!-- Claim list -->
            <div class="space-y-2">
              <h4
                class="text-[10px] font-black uppercase text-zinc-450 tracking-wider flex items-center gap-1"
              >
                <Key class="w-3.5 h-3.5" /> Thành viên đã nhận
              </h4>

              <div
                class="border border-gray-150 dark:border-zinc-850 rounded-xl max-h-52 overflow-y-auto"
                @scroll="handleClaimsScroll"
              >
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr
                      class="bg-gray-50 dark:bg-zinc-950 border-b border-gray-150 dark:border-zinc-850 text-[10px] text-zinc-400 font-bold uppercase"
                    >
                      <th class="px-4 py-2">Thành viên</th>
                      <th class="px-4 py-2">Email</th>
                      <th class="px-4 py-2 text-right">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-zinc-850">
                    <tr
                      v-for="(claimItem, index) in detailsData.claims.slice(0, visibleClaimsCount)"
                      :key="index"
                      class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/20"
                    >
                      <td class="px-4 py-2.5 font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ claimItem.username }}
                      </td>
                      <td class="px-4 py-2.5 text-zinc-550 dark:text-zinc-400">
                        {{ claimItem.email }}
                      </td>
                      <td class="px-4 py-2.5 text-right text-zinc-400 text-[10px]">
                        {{ formatDate(claimItem.claimed_at) }}
                      </td>
                    </tr>
                    <tr v-if="!detailsData.claims || detailsData.claims.length === 0">
                      <td colspan="3" class="px-4 py-8 text-center text-zinc-400 italic">
                        Chưa có thành viên nào nhận key bản quyền.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>

          <div
            class="flex items-center justify-end pt-4 border-t border-gray-150 dark:border-zinc-800"
          >
            <button
              @click="isDetailsModalOpen = false"
              class="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
