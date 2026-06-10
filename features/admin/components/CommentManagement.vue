<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { Search, Trash2, MessageSquare, User, FileText } from 'lucide-vue-next'

import { useAdminComments } from '../composables/use-admin'

const { commentsData, isLoadingComments, deleteComment, currentPage } = useAdminComments()

const searchQuery = ref('')

const filteredComments = computed(() => {
  const list = commentsData.value?.items || []
  if (!searchQuery.value.trim()) return list
  const query = searchQuery.value.toLowerCase()
  return list.filter(
    (c) =>
      c.content.toLowerCase().includes(query) ||
      c.author.toLowerCase().includes(query) ||
      c.postTitle.toLowerCase().includes(query)
  )
})

const paginatedComments = computed(() => {
  return filteredComments.value
})

const totalPages = computed(() => {
  return commentsData.value?.pagination?.total_pages || 1
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

const confirmDelete = (id: string, author: string) => {
  if (confirm(`Bạn có chắc chắn muốn xóa bình luận của "${author}"?`)) {
    deleteComment(id)
  }
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn">
    <!-- Filter bar -->
    <div
      class="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-855 shadow-xs"
    >
      <div class="relative w-full sm:max-w-xs">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm bình luận, thành viên, bài viết..."
          class="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-255 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
      </div>
    </div>

    <!-- Comments List -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs"
    >
      <div v-if="isLoadingComments" class="p-12 text-center text-xs text-zinc-400">
        Đang tải danh sách bình luận...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-855 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4 w-1/2">Bình luận</th>
              <th class="px-6 py-4">Bài viết</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="comment in paginatedComments"
              :key="comment.id"
              class="hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <p class="text-xs text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                    "{{ comment.content }}"
                  </p>
                  <div class="flex items-center gap-3 text-[10px] text-zinc-400">
                    <span
                      class="flex items-center gap-1 font-bold text-zinc-650 dark:text-zinc-450"
                    >
                      <User class="w-3.5 h-3.5" /> {{ comment.author }}
                    </span>
                    <span>•</span>
                    <span>{{ comment.date }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div
                  class="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-bold hover:text-[#3498db] cursor-pointer"
                >
                  <FileText class="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                  <span class="line-clamp-1 max-w-[200px]">{{ comment.postTitle }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="confirmDelete(comment.id, comment.author)"
                  class="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                  title="Xóa bình luận"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr v-if="filteredComments.length === 0">
              <td colspan="3" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Chưa có bình luận nào phù hợp...
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
        class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-255 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-855 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Sau
      </button>
    </div>
  </div>
</template>
