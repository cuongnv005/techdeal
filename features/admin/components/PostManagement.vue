<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import {
  Search,
  Trash2,
  Calendar,
  Eye,
  MessageSquare,
  Plus,
  CheckCircle,
  XCircle,
  Pencil
} from 'lucide-vue-next'

import { useAdminPosts } from '../composables/use-admin'

const { postsData, isLoadingPosts, deletePost, currentPage } = useAdminPosts()

const emit = defineEmits<{
  (e: 'approve', id: string): void
  (e: 'unpublish', id: string): void
}>()

const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

const statusConfig = {
  pending: {
    label: 'Chờ duyệt',
    cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
  },
  published: {
    label: 'Đã đăng',
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
  },
  unpublished: {
    label: 'Hủy đăng',
    cls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
  }
}

const filteredPosts = computed(() => {
  const list = postsData.value?.items || []
  return list.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = !categoryFilter.value || post.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || post.status === statusFilter.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})

const paginatedPosts = computed(() => {
  return filteredPosts.value
})

const totalPages = computed(() => {
  return postsData.value?.pagination?.total_pages || 1
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

watch([searchQuery, categoryFilter, statusFilter], () => {
  currentPage.value = 1
})

const categories = computed(() => {
  const all = (postsData.value?.items || []).map((p) => p.category)
  return [...new Set(all)]
})

const confirmDelete = (id: string, title: string) => {
  if (confirm(`Bạn có chắc chắn muốn xóa bài viết: "${title}"? Action này không thể hoàn tác.`)) {
    deletePost(id)
  }
}

const confirmUnpublish = (id: string, title: string) => {
  if (confirm(`Hủy đăng bài viết: "${title}"?`)) {
    emit('unpublish', id)
  }
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn">
    <!-- Filter bar -->
    <div
      class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-855 shadow-xs"
    >
      <div class="relative w-full sm:max-w-xs">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm bài viết, tác giả..."
          class="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <select
          v-model="categoryFilter"
          class="text-xs px-3 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-770 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả chuyên mục</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select
          v-model="statusFilter"
          class="text-xs px-3 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-770 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="published">Đã đăng</option>
          <option value="unpublished">Hủy đăng</option>
        </select>

        <NuxtLink
          to="/blog/publish"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer select-none"
        >
          <Plus class="w-4 h-4" /> Viết bài mới
        </NuxtLink>
      </div>
    </div>

    <!-- Posts Table -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div v-if="isLoadingPosts" class="p-12 text-center text-xs text-zinc-400">
        Đang tải danh sách bài viết...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4">Bài viết</th>
              <th class="px-6 py-4">Tác giả</th>
              <th class="px-6 py-4">Chuyên mục</th>
              <th class="px-6 py-4">Trạng thái</th>
              <th class="px-6 py-4">Thống kê</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="post in paginatedPosts"
              :key="post.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="space-y-1 max-w-sm sm:max-w-md">
                  <h4
                    class="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1 hover:text-[#3498db] cursor-pointer"
                  >
                    {{ post.title }}
                  </h4>
                  <div class="flex items-center gap-2 text-[10px] text-zinc-400">
                    <Calendar class="w-3.5 h-3.5" />
                    <span>{{ post.publishDate }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {{ post.author }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-450 border border-gray-200 dark:border-zinc-750"
                >
                  {{ post.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-block text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full',
                    statusConfig[post.status]?.cls ?? ''
                  ]"
                >
                  {{ statusConfig[post.status]?.label ?? post.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3 text-[10px] text-zinc-550">
                  <span class="flex items-center gap-1"
                    ><Eye class="w-3.5 h-3.5" /> {{ post.views }}</span
                  >
                  <span class="flex items-center gap-1"
                    ><MessageSquare class="w-3.5 h-3.5" /> {{ post.comments }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <!-- Duyệt bài (chỉ hiện khi pending hoặc unpublished) -->
                  <button
                    v-if="post.status !== 'published'"
                    @click="emit('approve', post.id)"
                    class="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all cursor-pointer"
                    title="Duyệt bài viết"
                  >
                    <CheckCircle class="w-4 h-4" />
                  </button>
                  <!-- Hủy đăng (chỉ hiện khi published) -->
                  <button
                    v-if="post.status === 'published'"
                    @click="confirmUnpublish(post.id, post.title)"
                    class="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all cursor-pointer"
                    title="Hủy đăng bài viết"
                  >
                    <XCircle class="w-4 h-4" />
                  </button>
                  <!-- Chỉnh sửa -->
                  <button
                    @click="navigateTo(`/blog/publish?edit=${post.id}`)"
                    class="p-2 text-zinc-400 hover:text-[#3498db] hover:bg-[#3498db]/10 rounded-xl transition-all cursor-pointer"
                    title="Chỉnh sửa bài viết"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <!-- Xóa -->
                  <button
                    @click="confirmDelete(post.id, post.title)"
                    class="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                    title="Xóa bài viết"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredPosts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Không tìm thấy bài viết nào phù hợp...
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
        class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-255 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  </div>
</template>
