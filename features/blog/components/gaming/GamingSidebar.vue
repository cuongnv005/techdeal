<script setup lang="ts">
import { Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-vue-next'

import AdBanner from '../AdBanner.vue'

import type { BlogPost } from '../../types/post.type'

defineProps<{
  recentSidebarPosts: BlogPost[]
}>()
</script>

<template>
  <aside class="lg:col-span-3 space-y-8">
    <!-- Social Follow Us -->
    <div
      class="bg-white dark:bg-[#13161c] border border-gray-200 dark:border-zinc-855 p-5 rounded-xl shadow-xs"
    >
      <h4
        class="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4"
      >
        Kết nối Gaming
      </h4>
      <div class="grid grid-cols-2 gap-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
        <a
          href="https://www.facebook.com/ThuVienGame1"
          class="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:opacity-90"
        >
          <Facebook class="w-4 h-4" /> Facebook
        </a>
        <a
          href="https://x.com/MDChannelVn1"
          class="flex items-center gap-2 p-2 bg-sky-50 dark:bg-sky-900/20 text-sky-500 dark:text-sky-400 rounded hover:opacity-90"
        >
          <Twitter class="w-4 h-4" /> X
        </a>
        <a
          href="https://www.instagram.com/mdchannelvn1/"
          class="flex items-center gap-2 p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded hover:opacity-90"
        >
          <Instagram class="w-4 h-4" /> Instagram
        </a>
        <a
          href="https://www.youtube.com/@mdchannelvn1"
          class="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-650 dark:text-red-400 rounded hover:opacity-90"
        >
          <Youtube class="w-4 h-4" /> YouTube
        </a>
      </div>
    </div>

    <!-- Daily Newsletter -->
    <div
      class="bg-white dark:bg-[#13161c] border border-gray-200 dark:border-zinc-850 p-5 rounded-xl shadow-xs"
    >
      <h4
        class="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4"
      >
        Nhận tin game mới nhất
      </h4>
      <p class="text-xs text-gray-500 dark:text-zinc-400 mb-4">
        Đăng ký email để không bỏ lỡ tin tức game hấp dẫn nhất mỗi ngày.
      </p>
      <form @submit.prevent class="space-y-2">
        <input
          type="email"
          placeholder="Nhập email của bạn..."
          class="w-full text-xs px-3 py-2 border border-gray-200 dark:border-zinc-800 rounded bg-gray-55 dark:bg-[#0d0f12] text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
        />
        <button
          type="submit"
          class="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-1"
        >
          Đăng ký <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </form>
    </div>

    <!-- Recent Sidebar Posts -->
    <div
      class="bg-white dark:bg-[#13161c] border border-gray-200 dark:border-zinc-850 p-5 rounded-xl shadow-xs"
    >
      <h4
        class="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2 mb-4"
      >
        Bài viết gần đây
      </h4>
      <ul class="space-y-4">
        <li
          v-for="rp in recentSidebarPosts"
          :key="rp.id"
          class="group border-b border-gray-100 dark:border-zinc-850 last:border-0 pb-3 last:pb-0"
        >
          <span class="text-[9px] font-bold text-[#e74c3c] uppercase block mb-1">
            {{ rp.category }}
          </span>
          <h5
            class="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-snug group-hover:text-[#e74c3c] transition-colors"
          >
            <NuxtLink :to="`/blog/${rp.slug}.${rp.id}`">{{ rp.title }}</NuxtLink>
          </h5>
          <span class="text-[10px] text-zinc-550 mt-1 block">{{ rp.publishDate }}</span>
        </li>
      </ul>
    </div>

    <!-- Ad Slot Sidebar -->
    <div
      v-if="false"
      class="bg-white dark:bg-[#13161c] border border-gray-200 dark:border-zinc-850 p-3 rounded-xl flex items-center justify-center shadow-xs"
    >
      <AdBanner width="300px" height="250px" :is-google-ad="true" />
    </div>
  </aside>
</template>
