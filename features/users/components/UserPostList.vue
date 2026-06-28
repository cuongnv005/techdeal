<script setup lang="ts">
import { computed } from 'vue'

import { Calendar, FileText, ChevronLeft, ChevronRight } from 'lucide-vue-next'

import type { UserPost, UserPagination } from '../types/user.type'

interface Props {
  posts: UserPost[]
  pagination: UserPagination
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change-page', page: number): void
}>()

const formattedDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const cleanSummary = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\[center\][\s\S]*?\[\/center\]/gi, '')
    .replace(/\[img\][\s\S]*?\[\/img\]/gi, '')
    .replace(/\[b\]/gi, '')
    .replace(/\[\/b\]/gi, '')
    .replace(/\[i\]/gi, '')
    .replace(/\[\/i\]/gi, '')
    .replace(/\[u\]/gi, '')
    .replace(/\[\/u\]/gi, '')
    .replace(/\[url=['"]?[^\]'"]+?['"]?\]([\s\S]*?)\[\/url\]/gi, '$1')
    .replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

// Simple pagination numbers helper
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.pagination.total_pages
  const current = props.pagination.current_page

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
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
</script>

<template>
  <div class="space-y-6">
    <div
      class="border-b-2 border-zinc-500 dark:border-zinc-700 pb-2 flex justify-between items-center"
    >
      <h3
        class="text-lg font-black text-muted-foreground dark:text-white uppercase tracking-tight flex items-center gap-2"
      >
        <FileText class="w-5 h-5 text-[#3498db] dark:text-[#e74c3c]" /> Danh sách bài viết
      </h3>
      <span class="text-xs text-zinc-500 font-bold">Tổng số: {{ pagination.total_items }}</span>
    </div>

    <!-- Empty State -->
    <div
      v-if="posts.length === 0"
      class="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-border rounded-2xl"
    >
      <FileText class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
      <p class="text-sm text-zinc-500 font-medium">Người dùng này chưa xuất bản bài viết nào.</p>
    </div>

    <!-- Posts list -->
    <div v-else class="space-y-4">
      <div
        v-for="post in posts"
        :key="post.slug"
        class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-border p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 group"
      >
        <div class="space-y-2">
          <!-- Title -->
          <h4
            class="text-base font-bold text-zinc-900 dark:text-white hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors leading-snug"
          >
            <NuxtLink :to="`/blog/${post.slug}`" class="block">
              {{ post.title }}
            </NuxtLink>
          </h4>

          <!-- Summary -->
          <p class="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {{ cleanSummary(post.summary) }}
          </p>

          <!-- Meta -->
          <div
            class="flex items-center gap-2 text-[10px] text-zinc-450 dark:text-zinc-500 pt-2 border-t border-gray-50 dark:border-zinc-950"
          >
            <Calendar class="w-3.5 h-3.5 shrink-0" />
            <span class="font-bold">{{ formattedDate(post.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="pagination.total_pages > 1"
      class="flex items-center justify-center gap-2 pt-4 flex-wrap"
    >
      <button
        :disabled="pagination.current_page <= 1"
        @click="emit('change-page', pagination.current_page - 1)"
        class="p-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <template v-for="(page, idx) in visiblePages" :key="idx">
        <span v-if="page === '...'" class="px-2 text-xs font-bold text-zinc-400 select-none">
          ...
        </span>
        <button
          v-else
          @click="emit('change-page', Number(page))"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none"
          :class="
            pagination.current_page === page
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-855'
          "
        >
          {{ page }}
        </button>
      </template>

      <button
        :disabled="pagination.current_page >= pagination.total_pages"
        @click="emit('change-page', pagination.current_page + 1)"
        class="p-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
