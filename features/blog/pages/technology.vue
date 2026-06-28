<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

import {
  Search,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  TrendingUp,
  Cpu
} from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'

const route = useRoute()
const siteUrl = 'https://techdeal.io.vn'
const requestUrl = computed(() => `${siteUrl}${route.path}`)

useSeoMeta({
  title: 'Công nghệ - Tin tức Công nghệ',
  description:
    'Chuyên mục Công nghệ: Cập nhật nhanh nhất các xu hướng công nghệ, tin tức AI, phần cứng và thế giới số.',
  ogTitle: 'Chuyên mục Công nghệ - TechDeal',
  ogDescription: 'Cập nhật tin tức công nghệ mới nhất hàng ngày.',
  ogUrl: requestUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Chuyên mục Công nghệ - TechDeal',
  twitterDescription: 'Cập nhật tin tức công nghệ mới nhất hàng ngày.'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: requestUrl
    }
  ]
})

const currentPage = computed(() => Number(route.query.page) || 1)

// Fetch articles dynamically
const { data: allCategoryPosts, pending } = await useAsyncData(
  'posts-technology-all',
  () =>
    blogRepository.getPosts({
      category: 'technology',
      page: currentPage.value,
      limit: 10
    }),
  {
    watch: [currentPage]
  }
)

const postsList = computed(() => allCategoryPosts.value?.items || [])
const totalPages = computed(() => {
  return allCategoryPosts.value?.pagination?.total_pages || 1
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

const posts = computed(() => {
  return postsList.value
})

// Computed property for sidebar (popular posts)
const mostViewedPosts = computed(() => {
  return [...postsList.value].sort((a, b) => b.views - a.views)
})

// Watch page changes to scroll smoothly back to the list header
watch(currentPage, () => {
  if (process.client) {
    nextTick(() => {
      const el = document.getElementById('news-list-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
})

// User store
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
        class="bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl p-8 mb-6 text-white shadow-md relative overflow-hidden"
      >
        <div class="absolute right-6 bottom-0 translate-y-6 opacity-10">
          <Cpu class="w-48 h-48" />
        </div>
        <div
          class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <span
              class="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full"
              >Chuyên mục</span
            >
            <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-3">Công nghệ</h1>
            <p class="text-sm text-blue-50 mt-2 max-w-xl">
              Cập nhật những tin tức công nghệ mới nhất, sản phẩm đột phá, các nghiên cứu và xu
              hướng phát triển công nghệ trên toàn cầu.
            </p>
          </div>
          <div
            v-if="
              userStore.isAuthenticated && (userStore.role === 'admin' || userStore.role === 'mod')
            "
          >
            <NuxtLink
              to="/blog/publish?category=technology"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 transition-all font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
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
            id="news-list-section"
            class="border-b-2 border-zinc-800 dark:border-zinc-700 pb-2 mb-6 flex justify-between items-center"
          >
            <h2
              class="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2"
            >
              <TrendingUp class="w-5 h-5 text-[#3498db]" /> Tin mới cập nhật
            </h2>
          </div>

          <!-- Spinning Loading Indicator -->
          <div v-if="pending" class="flex flex-col items-center justify-center py-20 min-h-[350px]">
            <div
              class="w-10 h-10 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="text-xs font-bold text-zinc-500 mt-4 tracking-wider animate-pulse">
              Đang tải bài viết mới...
            </p>
          </div>

          <!-- Simplified News Grid (Using PostCard layout) -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex items-center justify-center gap-2 mt-8 pt-4 flex-wrap"
          >
            <button
              :disabled="currentPage <= 1"
              @click="navigateTo({ query: { ...route.query, page: currentPage - 1 } })"
              class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-855 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
            >
              Trước
            </button>
            <template v-for="page in visiblePages" :key="page">
              <span
                v-if="page === '...'"
                class="px-2 py-2 text-xs font-bold text-zinc-400 select-none"
              >
                ...
              </span>
              <button
                v-else
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
            </template>
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
