<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  Search,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  TrendingUp,
  Monitor
} from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'
import Footer from '../components/Footer.vue'

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)
const requestUrl = useRequestURL().href

// Set page meta for SEO optimization
useSeoMeta({
  title: 'PC máy tính - Tin tức PC TechDeal',
  description:
    'Chuyên mục PC máy tính: Cập nhật tin tức phần cứng máy tính và linh kiện PC mới nhất.',
  ogTitle: 'Chuyên mục PC máy tính - TechDeal',
  ogDescription: 'Cập nhật tin tức phần cứng máy tính và linh kiện PC mới nhất.',
  ogUrl: requestUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Chuyên mục PC máy tính - TechDeal',
  twitterDescription: 'Cập nhật tin tức phần cứng máy tính và linh kiện PC mới nhất.'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: requestUrl
    }
  ]
})

// Fetch articles dynamically
const { data: allCategoryPosts } = await useAsyncData(
  'posts-pc-all',
  () => blogRepository.getPosts({ category: 'pc' })
)
const postsList = computed(() => allCategoryPosts.value || [])
const totalPages = computed(() => Math.ceil(postsList.value.length / 10) || 1)

const posts = computed(() => {
  const start = (currentPage.value - 1) * 10
  const end = start + 10
  return postsList.value.slice(start, end)
})

// Computed property for sidebar
const mostViewedPosts = computed(() => {
  return [...postsList.value].sort((a, b) => b.views - a.views)
})

// User store for checking roles
const userStore = useUserStore()
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-zinc-950 font-display transition-colors duration-300"
  >
    <!-- Main Navigation Header -->
    <Header />

    <!-- Main Content Area -->
    <main class="container mx-auto px-4 py-6">
      <!-- CATEGORY BANNER -->
      <div
        class="bg-gradient-to-r from-indigo-700 to-purple-600 rounded-2xl p-8 mb-6 text-white shadow-md relative overflow-hidden"
      >
        <div class="absolute right-6 bottom-0 translate-y-6 opacity-10">
          <Monitor class="w-48 h-48" />
        </div>
        <div
          class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <span
              class="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full"
              >Chuyên mục</span
            >
            <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-3">
              PC máy tính
            </h1>
            <p class="text-sm text-indigo-50 mt-2 max-w-xl">
              Tin tức mới nhất về phần cứng máy tính, linh kiện CPU, GPU, RAM, hướng dẫn tự ráp PC
              chơi game và tối ưu hóa hệ thống.
            </p>
          </div>
          <div
            v-if="
              userStore.isAuthenticated && (userStore.role === 'admin' || userStore.role === 'mod')
            "
          >
            <NuxtLink
              to="/blog/publish?category=pc"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-650 hover:bg-indigo-50 transition-all font-bold text-xs rounded-xl shadow-md cursor-pointer text-black"
            >
              📝 Đăng bài mới
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- AD BANNER BLOCK -->
      <AdBanner width="970px" height="90px" :is-google-ad="true" />

      <!-- GRID LAYOUT: MAIN LIST vs SIDEBAR -->
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-6">
        <!-- Main News Column (70%) -->
        <div class="lg:col-span-7">
          <div
            class="border-b-2 border-zinc-800 dark:border-zinc-700 pb-2 mb-6 flex justify-between items-center"
          >
            <h2
              class="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2"
            >
              <TrendingUp class="w-5 h-5 text-[#3498db]" /> Tin mới cập nhật
            </h2>
          </div>

          <!-- Simplified News Grid (Using PostCard layout) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8 pt-4 flex-wrap">
            <button
              :disabled="currentPage <= 1"
              @click="navigateTo({ query: { ...route.query, page: currentPage - 1 } })"
              class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
            >
              Trước
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="navigateTo({ query: { ...route.query, page: page } })"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none"
              :class="
                currentPage === page
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-855'
              "
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage >= totalPages"
              @click="navigateTo({ query: { ...route.query, page: currentPage + 1 } })"
              class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-855 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
            >
              Sau
            </button>
          </div>

          <!-- Bottom Ad Banner -->
          <div class="mt-8">
            <AdBanner width="728px" height="90px" :is-google-ad="true" />
          </div>
        </div>

        <!-- SIDEBAR COMPONENT -->
        <HomeSidebar :most-viewed-posts="mostViewedPosts" />
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
