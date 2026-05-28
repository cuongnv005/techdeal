<script setup lang="ts">
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  TrendingUp,
  Eye,
  Bookmark,
  ChevronRight
} from 'lucide-vue-next'
import type { BlogPost } from '../../types/post.type'
import AdBanner from '../AdBanner.vue'

defineProps<{
  mostViewedPosts: BlogPost[]
}>()
</script>

<template>
  <aside class="lg:col-span-3 space-y-8">
    <!-- Social Stats Widget -->
    <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-border shadow-sm">
      <h3
        class="text-sm font-bold uppercase tracking-wider border-b-2 border-[#3498db] pb-2 mb-4 text-zinc-900 dark:text-white"
      >
        Theo dõi chúng tôi
      </h3>
      <div class="grid grid-cols-2 gap-3 text-xs font-semibold">
        <a
          href="#"
          class="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded hover:opacity-90"
        >
          <Facebook class="w-4 h-4" /> Facebook
        </a>
        <a
          href="#"
          class="flex items-center gap-2 p-2 bg-sky-50 dark:bg-sky-900/10 text-sky-500 dark:text-sky-400 rounded hover:opacity-90"
        >
          <Twitter class="w-4 h-4" /> Twitter
        </a>
        <a
          href="#"
          class="flex items-center gap-2 p-2 bg-pink-50 dark:bg-pink-900/10 text-pink-600 dark:text-pink-400 rounded hover:opacity-90"
        >
          <Instagram class="w-4 h-4" /> Instagram
        </a>
        <a
          href="#"
          class="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/10 text-red-650 dark:text-red-400 rounded hover:opacity-90"
        >
          <Youtube class="w-4 h-4" /> YouTube
        </a>
      </div>
    </div>

    <!-- Most Viewed Posts of the Month Widget -->
    <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-border shadow-sm">
      <h3
        class="text-sm font-bold uppercase tracking-wider border-b-2 border-[#3498db] pb-2 mb-4 text-zinc-900 dark:text-white flex items-center gap-2"
      >
        <TrendingUp class="w-4 h-4 text-[#3498db]" /> Xem nhiều nhất tháng
      </h3>
      <ul class="space-y-4">
        <li
          v-for="(p, index) in mostViewedPosts.slice(0, 5)"
          :key="p.id"
          class="flex gap-3 items-start group"
        >
          <span
            class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-colors"
            :class="
              index === 0
                ? 'bg-[#3498db] text-white'
                : index === 1
                  ? 'bg-[#f39c12] text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
            "
          >
            {{ index + 1 }}
          </span>
          <div class="flex-grow">
            <h4
              class="text-xs font-bold leading-tight line-clamp-2 group-hover:text-[#3498db] transition-colors"
            >
              <NuxtLink :to="`/blog/${p.slug}.${p.id}`">{{ p.title }}</NuxtLink>
            </h4>
            <div class="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
              <Eye class="w-3 h-3 text-red-400" :stroke-width="2.5" />
              <span>{{ p.views.toLocaleString() }} lượt xem</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Sidebar Advertisement Banner -->
    <div
      class="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center"
    >
      <AdBanner width="300px" height="250px" />
    </div>

    <!-- Hot categories list -->
    <div class="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-border shadow-sm">
      <h3
        class="text-sm font-bold uppercase tracking-wider border-b-2 border-[#3498db] pb-2 mb-4 text-zinc-900 dark:text-white"
      >
        Chuyên mục nổi bật
      </h3>
      <ul class="space-y-2 text-xs">
        <li
          v-for="cat in [
            'Công nghệ',
            'Điện thoại',
            'Tai nghe & Loa',
            'Phần mềm & Ứng dụng',
            'AI & Xe điện'
          ]"
          :key="cat"
        >
          <a
            href="#"
            class="flex justify-between items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded text-zinc-700 dark:text-zinc-300"
          >
            <span class="flex items-center gap-2">
              <Bookmark class="w-3.5 h-3.5 text-[#f39c12]" /> {{ cat }}
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
