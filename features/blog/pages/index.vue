<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { TrendingUp } from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

import type { BlogPost } from '../types/post.type'

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)
const siteUrl = 'https://techdeal.io.vn'
const requestUrl = computed(() => `${siteUrl}${route.path}`)

// Set page meta for SEO optimization
useSeoMeta({
  title: 'Trang chủ - Tin tức Công nghệ',
  description:
    'Trang tin tức công nghệ hàng đầu, cập nhật nhanh nhất các xu hướng công nghệ, điện thoại di động, tai nghe, AI và thế giới số.',
  ogTitle: 'Trang chủ - Tin tức Công nghệ',
  ogDescription: 'Cập nhật tin tức công nghệ mới nhất hàng ngày.',
  ogUrl: () => requestUrl.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Trang chủ - Tin tức Công nghệ',
  twitterDescription: 'Cập nhật tin tức công nghệ mới nhất hàng ngày.'
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: requestUrl.value
    }
  ]
}))

// Fetch posts from API using useAsyncData, watching the current page for server-side pagination
const { data: allPosts, pending } = await useAsyncData(
  'public-posts-all',
  () =>
    blogRepository.getPosts({ page: currentPage.value, limit: currentPage.value === 1 ? 11 : 10 }),
  {
    watch: [currentPage]
  }
)

const postsList = computed<BlogPost[]>(() => allPosts.value?.items || [])

// Fallback post structure in case database has no posts yet
const fallbackPost: BlogPost = {
  id: 'fallback',
  title: 'Chào mừng bạn đến với TechDeal',
  category: 'Technology',
  author: 'TechDeal',
  publishDate: 'Hôm nay',
  views: 0,
  comments: 0,
  imageUrl:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  summary:
    'Hệ thống đang được cập nhật thêm các bài viết công nghệ mới nhất. Xin vui lòng quay lại sau.',
  slug: 'welcome'
}

// Featured Posts (Hero Section)
const featuredBigPost = computed<BlogPost>(() => {
  return postsList.value[0] || fallbackPost
})

const featuredSmallPosts = computed<BlogPost[]>(() => {
  if (postsList.value.length <= 1) return []
  return postsList.value.slice(1, 3)
})

// Articles list at bottom
const posts = computed<BlogPost[]>(() => {
  if (currentPage.value === 1) {
    if (postsList.value.length <= 3) {
      return []
    }
    return postsList.value.slice(3)
  }
  return postsList.value
})

const totalPages = computed(() => {
  return allPosts.value?.pagination?.total_pages || 1
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

// Computed property for the most viewed posts of the month
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

// Search query
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-zinc-950 font-display transition-colors duration-300"
  >
    <!-- Main Navigation Header -->
    <Header />

    <!-- Main Content Area -->
    <main class="container mx-auto px-4 py-6">
      <h1 class="sr-only">TechDeal - Tin tức công nghệ, game và khuyến mãi mới nhất</h1>
      <!-- HERO COMPONENT (only show on page 1) -->
      <HomeHero
        v-if="currentPage === 1"
        :featured-big-post="featuredBigPost"
        :featured-small-posts="featuredSmallPosts"
      />

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
              class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
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
              class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
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
