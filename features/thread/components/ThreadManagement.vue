<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { Search, Plus, Clock, Trash2, X, AlertCircle, Pencil, Crown } from 'lucide-vue-next'

import { useAdminThreads, useAdminThreadDetail } from '../composables/use-thread'

import type { Thread, CreateThreadInput, ThreadPlatform } from '../types/thread.type'

const {
  threadsData,
  isLoading,
  createThread,
  updateThread,
  expireThread,
  deleteThread,
  actionError,
  isPending,
  currentPage,
  searchQuery
} = useAdminThreads()

// Modal state
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const editingThreadId = ref<string | null>(null)
const isLoadingEditData = ref(false)

const PLATFORM_OPTIONS: { value: ThreadPlatform; label: string }[] = [
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'windows', label: 'Windows' },
  { value: 'game', label: 'Game' }
]

interface ThreadFormState {
  app_name: string
  platform_type: ThreadPlatform
  image_url: string
  summary: string
  content: string
  deal_link: string
  is_vip_only: boolean
  deal_ends_at: string
  max_claims: string
  status: string
}

const emptyForm = (): ThreadFormState => ({
  app_name: '',
  platform_type: 'android',
  image_url: '',
  summary: '',
  content: '',
  deal_link: '',
  is_vip_only: false,
  deal_ends_at: '',
  max_claims: '',
  status: 'published'
})

const form = ref<ThreadFormState>(emptyForm())

const paginatedThreads = computed(() => threadsData.value?.items || [])

const totalPages = computed(() => threadsData.value?.pagination?.total_pages || 1)

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

const toLocalDateTimeValue = (dateString: string | null): string => {
  if (!dateString) return ''
  const targetDate = new Date(dateString)
  const tzOffset = targetDate.getTimezoneOffset() * 60000
  return new Date(targetDate.getTime() - tzOffset).toISOString().slice(0, 16)
}

const isDealExpired = (thread: Thread): boolean => {
  return !!thread.deal_ends_at && new Date(thread.deal_ends_at) <= new Date()
}

const isOutOfClaims = (thread: Thread): boolean => {
  return thread.max_claims != null && thread.claims_count >= thread.max_claims
}

const openCreateModal = (): void => {
  isEditMode.value = false
  editingThreadId.value = null
  form.value = emptyForm()
  isFormModalOpen.value = true
}

const openEditModal = async (thread: Thread): Promise<void> => {
  isEditMode.value = true
  editingThreadId.value = thread.id
  isFormModalOpen.value = true
  isLoadingEditData.value = true

  try {
    const { detail, refresh } = await useAdminThreadDetail(thread.id)
    await refresh()
    const full = detail.value

    form.value = {
      app_name: full?.app_name ?? thread.app_name,
      platform_type: (full?.platform_type ?? thread.platform_type) as ThreadPlatform,
      image_url: full?.image_url ?? thread.image_url ?? '',
      summary: full?.summary ?? '',
      content: full?.content ?? '',
      deal_link: full?.deal_link ?? '',
      is_vip_only: !!(full?.is_vip_only ?? thread.is_vip_only),
      deal_ends_at: toLocalDateTimeValue(full?.deal_ends_at ?? thread.deal_ends_at),
      max_claims:
        full?.max_claims != null
          ? String(full.max_claims)
          : thread.max_claims != null
            ? String(thread.max_claims)
            : '',
      status: full?.status ?? thread.status
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoadingEditData.value = false
  }
}

const handleSubmitForm = async (): Promise<void> => {
  const payload: CreateThreadInput = {
    app_name: form.value.app_name,
    summary: form.value.summary,
    content: form.value.content,
    deal_link: form.value.deal_link,
    platform_type: form.value.platform_type,
    image_url: form.value.image_url || undefined,
    is_vip_only: form.value.is_vip_only,
    deal_ends_at: form.value.deal_ends_at ? new Date(form.value.deal_ends_at).toISOString() : null,
    max_claims: form.value.max_claims === '' ? null : Number(form.value.max_claims),
    status: form.value.status
  }

  if (isEditMode.value && editingThreadId.value) {
    const success = await updateThread(editingThreadId.value, payload)
    if (success) {
      isFormModalOpen.value = false
    }
  } else {
    const resultId = await createThread(payload)
    if (resultId) {
      isFormModalOpen.value = false
    }
  }
}

const handleExpire = async (id: string) => {
  if (
    confirm(
      'Bạn có chắc chắn muốn kết thúc deal này ngay lập tức? Người dùng sẽ không thể nhận deal nữa.'
    )
  ) {
    await expireThread(id)
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Bạn có chắc chắn muốn xóa thread này không? Hành động này không thể hoàn tác.')) {
    await deleteThread(id)
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Không giới hạn'
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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
        <Plus class="w-4 h-4" /> Tạo Thread mới
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

    <!-- Thread list table -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div v-if="isLoading" class="p-12 text-center text-xs text-zinc-400">
        Đang tải danh sách thread...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4">Ứng Dụng</th>
              <th class="px-6 py-4">Nền Tảng</th>
              <th class="px-6 py-4">VIP</th>
              <th class="px-6 py-4">Lượt Nhận</th>
              <th class="px-6 py-4">Hạn Nhận Deal</th>
              <th class="px-6 py-4">Trạng Thái</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="thread in paginatedThreads"
              :key="thread.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-xs text-zinc-900 dark:text-white">
                {{ thread.app_name }}
              </td>
              <td
                class="px-6 py-4 text-xs font-semibold uppercase text-zinc-550 dark:text-zinc-400"
              >
                {{ thread.platform_type }}
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="thread.is_vip_only"
                  class="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-555 border-amber-500/20"
                >
                  <Crown class="w-3 h-3" /> VIP
                </span>
                <span v-else class="text-xs text-zinc-400">-</span>
              </td>
              <td class="px-6 py-4 text-xs font-semibold">
                {{ thread.claims_count
                }}<span v-if="thread.max_claims != null"> / {{ thread.max_claims }}</span>
              </td>
              <td class="px-6 py-4 text-xs font-medium text-zinc-550 dark:text-zinc-400">
                {{ formatDate(thread.deal_ends_at) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  :class="
                    thread.status !== 'published'
                      ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                      : isDealExpired(thread)
                        ? 'bg-red-500/10 text-red-550 border-red-500/20'
                        : isOutOfClaims(thread)
                          ? 'bg-amber-500/10 text-amber-555 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  "
                >
                  {{
                    thread.status !== 'published'
                      ? thread.status
                      : isDealExpired(thread)
                        ? 'Đã hết hạn'
                        : isOutOfClaims(thread)
                          ? 'Hết lượt nhận'
                          : 'Hoạt động'
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(thread)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-[#3498db] hover:bg-[#3498db]/10"
                    title="Chỉnh sửa thread"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    v-if="!isDealExpired(thread)"
                    @click="handleExpire(thread.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10"
                    title="Kết thúc deal ngay"
                  >
                    <Clock class="w-4 h-4" />
                  </button>

                  <button
                    @click="handleDelete(thread.id)"
                    class="p-2 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-red-550 hover:bg-red-550/10"
                    title="Xóa thread"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="paginatedThreads.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Không tìm thấy thread nào...
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

    <!-- Create / Edit Thread Modal -->
    <div
      v-if="isFormModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-zinc-800 shrink-0"
        >
          <h3 class="text-xs font-black uppercase text-zinc-900 dark:text-white">
            {{ isEditMode ? 'Chỉnh sửa Thread' : 'Tạo Thread mới' }}
          </h3>
          <button
            @click="isFormModalOpen = false"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-if="isLoadingEditData" class="p-12 text-center text-xs text-zinc-400">
          Đang tải dữ liệu...
        </div>
        <form v-else @submit.prevent="handleSubmitForm" class="p-6 space-y-4 overflow-y-auto">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
                >Tên Ứng Dụng</label
              >
              <input
                v-model="form.app_name"
                type="text"
                required
                placeholder="Ví dụ: CapCut Pro"
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
                >Nền Tảng</label
              >
              <select
                v-model="form.platform_type"
                required
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              >
                <option v-for="opt in PLATFORM_OPTIONS" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Link Nhận Deal</label
            >
            <input
              v-model="form.deal_link"
              type="url"
              required
              placeholder="https://..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Ảnh Đại Diện (Tùy chọn)</label
            >
            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Tóm Tắt</label
            >
            <textarea
              v-model="form.summary"
              required
              rows="2"
              placeholder="Mô tả ngắn hiển thị ở danh sách feed..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db] resize-none"
            ></textarea>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Nội Dung Chi Tiết</label
            >
            <textarea
              v-model="form.content"
              required
              rows="5"
              placeholder="Nội dung chi tiết, hướng dẫn nhận deal..."
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db] resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
                >Thời Gian Kết Thúc Deal (Tùy chọn)</label
              >
              <input
                v-model="form.deal_ends_at"
                type="datetime-local"
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
                >Số Lượng Giới Hạn (Tùy chọn)</label
              >
              <input
                v-model="form.max_claims"
                type="number"
                min="1"
                placeholder="Để trống = không giới hạn"
                class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-450"
              >Trạng Thái</label
            >
            <select
              v-model="form.status"
              class="w-full text-xs px-3 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            >
              <option value="published">Đã xuất bản</option>
              <option value="pending">Chờ duyệt</option>
              <option value="unpublished">Đã ẩn</option>
            </select>
          </div>

          <div class="flex items-center gap-2 py-2">
            <input
              v-model="form.is_vip_only"
              type="checkbox"
              id="is_vip_only"
              class="w-4 h-4 text-[#3498db] dark:text-[#e74c3c] border-gray-300 rounded focus:ring-[#3498db]"
            />
            <label
              for="is_vip_only"
              class="text-[10px] font-bold uppercase tracking-wider text-zinc-450 cursor-pointer"
            >
              Chỉ dành cho thành viên VIP
            </label>
          </div>

          <div
            class="flex items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-zinc-800"
          >
            <button
              type="button"
              @click="isFormModalOpen = false"
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
  </div>
</template>
