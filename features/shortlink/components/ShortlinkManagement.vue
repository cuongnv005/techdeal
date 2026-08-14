<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import {
  Search,
  Plus,
  Copy,
  Trash2,
  X,
  ExternalLink,
  Link2,
  Calendar,
  AlertCircle,
  BarChart2,
  Pencil,
  Tag,
  Image as ImageIcon
} from 'lucide-vue-next'

import { ThreadRepoImpl } from '../../thread/api/thread'
import { useAdminShortlinks } from '../composables/use-shortlink'

import type { Thread } from '../../thread/types/thread.type'
import type { ShortlinkStats, Shortlink } from '../types/shortlink.type'

const {
  shortlinksData,
  isLoading,
  createShortlink,
  updateShortlink,
  deleteShortlink,
  actionError,
  isPending,
  currentPage,
  searchQuery
} = useAdminShortlinks()

const threadRepo = new ThreadRepoImpl()

const copiedId = ref<string | null>(null)
const isCreateModalOpen = ref(false)
// null = đang tạo mới; có giá trị = đang sửa shortlink có id này
const editingId = ref<string | null>(null)

const form = ref({
  name: '',
  target_url: '',
  hash: '',
  guide_image_url: ''
})

// --- Gắn deal (thread) vào shortlink ---
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
  // Tự điền target_url = đúng deal_link gốc của thread — admin vẫn sửa tay được nếu cần
  if (thread.deal_link) {
    form.value.target_url = thread.deal_link
  }
  isThreadDropdownOpen.value = false
  threadSearchQuery.value = ''
  threadSearchResults.value = []
}

const clearSelectedThread = () => {
  selectedThread.value = null
}

const filteredShortlinks = computed(() => shortlinksData.value?.items || [])

const totalPages = computed(() => {
  return shortlinksData.value?.pagination?.total_pages || 1
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

const openCreateModal = () => {
  editingId.value = null
  form.value = {
    name: '',
    target_url: '',
    hash: '',
    guide_image_url: ''
  }
  selectedThread.value = null
  threadSearchQuery.value = ''
  threadSearchResults.value = []
  isCreateModalOpen.value = true
}

const openEditModal = (link: Shortlink) => {
  editingId.value = link.id
  form.value = {
    name: link.name,
    target_url: link.target_url,
    hash: link.hash,
    guide_image_url: link.guide_image_url || ''
  }
  selectedThread.value = link.deal_thread_id
    ? { id: link.deal_thread_id, app_name: link.deal_app_name || link.deal_thread_id }
    : null
  threadSearchQuery.value = ''
  threadSearchResults.value = []
  isCreateModalOpen.value = true
}

/**
 * Normalize known deep-link schemes to their https:// equivalent before
 * saving. This prevents itms-apps:// / itms-appss:// (and other custom
 * schemes) from being persisted to the database, which would cause
 * "no registered handler" errors on non-iOS devices at redirect time.
 */
const normalizeUrl = (url: string): string => {
  const trimmed = url.trim()
  // Apple App Store deep links → https://
  if (/^itms-appss?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^itms-appss?:\/\//i, 'https://')
  }
  return trimmed
}

const handleSubmit = async () => {
  const commonData = {
    name: form.value.name,
    target_url: normalizeUrl(form.value.target_url),
    deal_thread_id: selectedThread.value?.id || null,
    guide_image_url: form.value.guide_image_url.trim() || null
  }

  if (editingId.value) {
    const ok = await updateShortlink(editingId.value, commonData)
    if (ok) isCreateModalOpen.value = false
    return
  }

  const result = await createShortlink({
    ...commonData,
    hash: form.value.hash.trim() || undefined
  })
  if (result) {
    isCreateModalOpen.value = false
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Bạn có chắc chắn muốn xóa liên kết rút gọn này không?')) {
    await deleteShortlink(id)
  }
}

const copyShortlink = (hash: string, id: string) => {
  if (process.client) {
    const link = `${window.location.origin}/go/${hash}`
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

const fallbackCopyText = (text: string, id: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Stats modal state
const isStatsModalOpen = ref(false)
const statsLoading = ref(false)
const statsData = ref<ShortlinkStats | null>(null)
const statsError = ref<string | null>(null)

const viewStats = async (id: string) => {
  isStatsModalOpen.value = true
  statsLoading.value = true
  statsError.value = null
  statsData.value = null
  try {
    const { shortlinkRepository } = await import('../api/shortlink')
    const resp = await shortlinkRepository.adminStats(id)
    if (resp.success) {
      statsData.value = resp.data
    } else {
      statsError.value = resp.error || 'Không thể tải thống kê chi tiết'
    }
  } catch (e: any) {
    statsError.value = e.message || 'Lỗi hệ thống khi tải thống kê'
  } finally {
    statsLoading.value = false
  }
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
          placeholder="Tìm kiếm liên kết..."
          class="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
      </div>

      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
      >
        <Plus class="w-4 h-4" /> Tạo Shortlink mới
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

    <!-- Shortlink List Table -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div v-if="isLoading" class="p-12 text-center text-xs text-zinc-400">
        Đang tải danh sách liên kết...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4">Tên gợi nhớ</th>
              <th class="px-6 py-4">Mã Hash (Rút gọn)</th>
              <th class="px-6 py-4">Link đích</th>
              <th class="px-6 py-4">Số Clicks</th>
              <th class="px-6 py-4">Ngày Tạo</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="link in filteredShortlinks"
              :key="link.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-xs text-zinc-900 dark:text-white">
                {{ link.name }}
              </td>
              <td class="px-6 py-4 text-xs font-semibold">
                <span
                  class="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-650 dark:text-zinc-350"
                >
                  {{ link.hash }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-xs max-w-xs truncate font-medium text-zinc-550 dark:text-zinc-400"
              >
                <a
                  :href="link.target_url"
                  target="_blank"
                  class="hover:underline text-[#3498db] dark:text-[#e74c3c]"
                >
                  {{ link.target_url }}
                </a>
                <span
                  v-if="link.deal_thread_id"
                  class="mt-1 inline-flex items-center gap-1 bg-[#3498db]/10 dark:bg-[#e74c3c]/10 text-[#3498db] dark:text-[#e74c3c] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                >
                  <Tag class="w-2.5 h-2.5" /> Deal: {{ link.deal_app_name || link.deal_thread_id }}
                </span>
              </td>
              <td class="px-6 py-4 text-xs font-bold flex items-center gap-1.5 pt-5">
                <BarChart2 class="w-3.5 h-3.5 text-zinc-400" />
                {{ link.clicks_count || 0 }}
              </td>
              <td class="px-6 py-4 text-xs font-medium text-zinc-400">
                {{ formatDate(link.created_at) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="copyShortlink(link.hash, link.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-[#3498db] hover:bg-[#3498db]/10 flex items-center gap-1 text-[10px]"
                  >
                    <Copy class="w-4 h-4" />
                    <span>{{ copiedId === link.id ? 'Copied!' : 'Copy Link' }}</span>
                  </button>

                  <button
                    @click="viewStats(link.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                    title="Xem thống kê lượt click"
                  >
                    <BarChart2 class="w-4 h-4" />
                  </button>

                  <button
                    @click="openEditModal(link)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                    title="Sửa liên kết / gắn deal / ảnh hướng dẫn"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    @click="handleDelete(link.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-red-555 hover:bg-red-555/10"
                    title="Xóa link"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredShortlinks.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Không tìm thấy liên kết rút gọn nào...
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

    <!-- Create Modal -->
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
            {{ editingId ? 'Sửa Shortlink' : 'Tạo Shortlink mới' }}
          </h3>
          <button
            @click="isCreateModalOpen = false"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Tên Gợi Nhớ</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Ví dụ: Link tải iOS Game, Link tài liệu..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Đường dẫn đích (Target URL)</label
            >
            <input
              v-model="form.target_url"
              type="text"
              required
              placeholder="https://example.com hoặc itms-appss://apps.apple.com/..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
            <p class="text-[9px] text-zinc-400">
              Nút "Tới trang đích" trên trang /go luôn dẫn tới link này — kể cả khi có gắn Deal bên
              dưới, không phụ thuộc user có cài TechDeal app hay không.
            </p>
          </div>

          <div v-if="!editingId" class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Mã Hash (Tùy chọn - Tối thiểu 3 ký tự)</label
            >
            <input
              v-model="form.hash"
              type="text"
              placeholder="Để trống để tự động tạo"
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="space-y-1 pt-2 border-t border-gray-150 dark:border-zinc-800">
            <label
              class="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1"
            >
              <Tag class="w-3 h-3" /> Liên kết tới Deal (Tùy chọn — bật mở/cài TechDeal app)
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
              Không chọn thread = shortlink thường (giveaway/link ngoài), hành vi giữ nguyên như
              hiện tại.
            </p>
          </div>

          <div class="space-y-1">
            <label
              class="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1"
            >
              <ImageIcon class="w-3 h-3" /> Link ảnh hướng dẫn (Tùy chọn)
            </label>
            <input
              v-model="form.guide_image_url"
              type="text"
              placeholder="https://... — hiện dưới card đếm ngược trên trang /go"
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
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
              {{ isPending ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Tạo mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stats Modal -->
    <div
      v-if="isStatsModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-zinc-800"
        >
          <h3
            class="text-xs font-black uppercase text-zinc-900 dark:text-white flex items-center gap-1.5"
          >
            <BarChart2 class="w-4 h-4 text-[#3498db] dark:text-[#e74c3c]" />
            Thống kê chi tiết liên kết
          </h3>
          <button
            @click="isStatsModalOpen = false"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <!-- Loading state -->
          <div v-if="statsLoading" class="py-12 text-center text-xs text-zinc-400">
            Đang tải dữ liệu thống kê...
          </div>

          <!-- Error state -->
          <div
            v-else-if="statsError"
            class="py-8 text-center text-xs text-red-500 flex items-center justify-center gap-2"
          >
            <AlertCircle class="w-4 h-4" />
            <span>{{ statsError }}</span>
          </div>

          <!-- Stats content -->
          <div v-else-if="statsData" class="space-y-6">
            <!-- Summary card -->
            <div
              class="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h4 class="text-xs font-black text-zinc-900 dark:text-white mb-1">
                  {{ statsData.shortlink.name }}
                </h4>
                <p class="text-[10px] text-zinc-450 truncate max-w-xs sm:max-w-md">
                  Link đích:
                  <a
                    :href="statsData.shortlink.target_url"
                    target="_blank"
                    class="hover:underline text-[#3498db] dark:text-[#e74c3c]"
                    >{{ statsData.shortlink.target_url }}</a
                  >
                </p>
              </div>
              <div class="text-left sm:text-right shrink-0">
                <span class="text-2xl font-serif font-black text-zinc-900 dark:text-white block">
                  {{ statsData.total_clicks }}
                </span>
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400"
                  >Tổng số Clicks</span
                >
              </div>
            </div>

            <!-- Grid details: Devices and Referrers -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Devices Breakdown -->
              <div class="border border-gray-150 dark:border-zinc-850 p-4 rounded-xl space-y-4">
                <h4 class="text-[10px] font-black uppercase text-zinc-450 tracking-wider">
                  Thiết bị truy cập
                </h4>
                <div class="space-y-3">
                  <!-- Mobile percentage -->
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-xs font-bold">
                      <span>Điện thoại (Mobile)</span>
                      <span>{{ statsData.devices?.mobile || 0 }} clicks</span>
                    </div>
                    <div
                      class="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden"
                    >
                      <div
                        class="bg-[#3498db] dark:bg-[#e74c3c] h-full"
                        :style="{
                          width: `${statsData.total_clicks > 0 ? ((statsData.devices?.mobile || 0) / statsData.total_clicks) * 100 : 0}%`
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- Desktop percentage -->
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-xs font-bold">
                      <span>Máy tính (Desktop)</span>
                      <span>{{ statsData.devices?.desktop || 0 }} clicks</span>
                    </div>
                    <div
                      class="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden"
                    >
                      <div
                        class="bg-zinc-750 dark:bg-zinc-400 h-full"
                        :style="{
                          width: `${statsData.total_clicks > 0 ? ((statsData.devices?.desktop || 0) / statsData.total_clicks) * 100 : 0}%`
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Referrers Breakdown -->
              <div class="border border-gray-150 dark:border-zinc-850 p-4 rounded-xl space-y-4">
                <h4 class="text-[10px] font-black uppercase text-zinc-450 tracking-wider">
                  Nguồn traffic (Referrers)
                </h4>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div
                    v-for="(refItem, idx) in statsData.referrers"
                    :key="idx"
                    class="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-zinc-850"
                  >
                    <span
                      class="truncate font-semibold text-zinc-650 dark:text-zinc-350 max-w-[70%]"
                      :title="refItem.source"
                    >
                      {{ refItem.source }}
                    </span>
                    <span class="font-bold text-[#3498db] dark:text-[#e74c3c]">
                      {{ refItem.count }} clicks
                    </span>
                  </div>
                  <div
                    v-if="!statsData.referrers || statsData.referrers.length === 0"
                    class="text-xs italic text-zinc-400 text-center py-4"
                  >
                    Chưa ghi nhận nguồn traffic...
                  </div>
                </div>
              </div>
            </div>

            <!-- Daily Statistics Graph -->
            <div class="border border-gray-150 dark:border-zinc-850 p-4 rounded-xl space-y-4">
              <h4 class="text-[10px] font-black uppercase text-zinc-450 tracking-wider">
                Thống kê lượt click theo ngày
              </h4>
              <!-- Beautiful Bar Chart (CSS-based) -->
              <div
                class="flex items-end justify-between h-32 pt-6 px-4 bg-gray-50 dark:bg-zinc-950 rounded-xl gap-2"
              >
                <div
                  v-for="(dayStat, idx) in statsData.daily_stats"
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <!-- Tooltip -->
                  <span
                    class="absolute bottom-full mb-1 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-bold"
                  >
                    {{ dayStat.count }} clicks
                  </span>
                  <!-- Bar -->
                  <div
                    class="w-full max-w-[20px] bg-[#3498db] dark:bg-[#e74c3c] rounded-t-sm transition-all duration-500 hover:opacity-85"
                    :style="{
                      height: `${Math.max(10, Math.min(100, (dayStat.count / Math.max(...statsData.daily_stats.map((d: any) => d.count), 1)) * 100))}%`
                    }"
                  ></div>
                  <!-- Label -->
                  <span
                    class="text-[8px] font-bold text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                  >
                    {{ dayStat.date.substring(5) }}
                  </span>
                </div>
                <div
                  v-if="!statsData.daily_stats || statsData.daily_stats.length === 0"
                  class="w-full text-xs italic text-zinc-400 text-center py-10"
                >
                  Chưa có dữ liệu theo ngày...
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end px-6 py-4 border-t border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/20"
        >
          <button
            @click="isStatsModalOpen = false"
            class="px-4 py-2 border border-gray-200 dark:border-zinc-850 text-xs font-bold rounded-xl text-zinc-550 hover:bg-gray-50 dark:hover:bg-zinc-855 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
