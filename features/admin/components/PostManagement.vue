<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Trash2, Calendar, Eye, MessageSquare, Plus } from 'lucide-vue-next'
import type { PostItem } from '../types/dashboard.type'

interface Props {
  postsList: PostItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const categoryFilter = ref('')

const filteredPosts = computed(() => {
  return props.postsList.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = !categoryFilter.value || post.category === categoryFilter.value

    return matchesSearch && matchesCategory
  })
})

const categories = computed(() => {
  const all = props.postsList.map((p) => p.category)
  return [...new Set(all)]
})

const confirmDelete = (id: string, title: string) => {
  if (confirm(`Bạn có chắc chắn muốn xóa bài viết: "${title}"? Action này không thể hoàn tác.`)) {
    emit('delete', id)
  }
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn">
    <!-- Filter bar -->
    <div
      class="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs"
    >
      <div class="relative w-full sm:max-w-xs">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm bài viết, tác giả..."
          class="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
        />
        <Search class="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <select
          v-model="categoryFilter"
          class="text-xs px-3 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="">Tất cả chuyên mục</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-gray-250 dark:border-zinc-850 bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500"
            >
              <th class="px-6 py-4">Bài viết</th>
              <th class="px-6 py-4">Tác giả</th>
              <th class="px-6 py-4">Chuyên mục</th>
              <th class="px-6 py-4">Thống kê</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-150 dark:divide-zinc-850">
            <tr
              v-for="post in filteredPosts"
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
                <div class="flex items-center gap-3 text-[10px] text-zinc-500">
                  <span class="flex items-center gap-1"
                    ><Eye class="w-3.5 h-3.5" /> {{ post.views }}</span
                  >
                  <span class="flex items-center gap-1"
                    ><MessageSquare class="w-3.5 h-3.5" /> {{ post.comments }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="confirmDelete(post.id, post.title)"
                  class="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                  title="Xóa bài viết"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr v-if="filteredPosts.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-xs text-zinc-400 italic">
                Không tìm thấy bài viết nào phù hợp...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
