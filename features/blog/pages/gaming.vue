<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

import { Facebook, Twitter, Instagram, Linkedin, TrendingUp } from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import GamingBanner from '../components/gaming/GamingBanner.vue'
import GamingCategories from '../components/gaming/GamingCategories.vue'
import GamingSidebar from '../components/gaming/GamingSidebar.vue'
import GamingSpotlight from '../components/gaming/GamingSpotlight.vue'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'

const userStore = useUserStore()

const route = useRoute()
const siteUrl = 'https://techdeal.io.vn'
const requestUrl = computed(() => `${siteUrl}${route.path}`)

// SEO optimization for Gaming Page
useSeoMeta({
  title: 'Thế giới Game - Tin tức Game & Esports mới nhất',
  description:
    'Trang tin tức game, đánh giá game, esports, tin công nghệ phần cứng chơi game hàng đầu.',
  ogTitle: 'Thế giới Game - TechDeal Gaming',
  ogDescription: 'Cập nhật tin tức esports, game thủ và xu hướng game thế giới.',
  ogUrl: () => requestUrl.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Thế giới Game - TechDeal Gaming',
  twitterDescription: 'Cập nhật tin tức esports, game thủ và xu hướng game thế giới.'
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: requestUrl.value
    }
  ]
}))

// Mock categories for gaming
const categories = ref([
  { name: 'Action', count: '120 bài', icon: '💥' },
  { name: 'Gaming', count: '340 bài', icon: '🎮' },
  { name: 'Racing', count: '85 bài', icon: '🏎️' },
  { name: 'Animation', count: '92 bài', icon: '🎬' },
  { name: 'Fighter', count: '64 bài', icon: '🥊' },
  { name: 'RPG/Story', count: '150 bài', icon: '🧙‍♂️' }
])

const currentPage = computed(() => Number(route.query.page) || 1)

// Fetch gaming articles dynamically
const { data: gamingPosts, pending } = await useAsyncData(
  'posts-gaming',
  () =>
    blogRepository.getPosts({
      category: 'gaming',
      page: currentPage.value,
      limit: currentPage.value === 1 ? 15 : 10
    }),
  {
    watch: [currentPage]
  }
)

const postsList = computed(() => gamingPosts.value?.items || [])

// Fallback post structure in case database has no posts yet
const fallbackPost: BlogPost = {
  id: 'fallback',
  title: 'Chưa có bài viết mới',
  category: 'Gaming',
  author: 'Admin',
  publishDate: 'Hôm nay',
  views: 0,
  comments: 0,
  imageUrl:
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
  summary: 'Bài viết game mới đang được biên soạn. Vui lòng quay lại sau.',
  slug: 'welcome-gaming'
}

// Banner Posts (Big header layout)
const bannerPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(0, 2).length > 0 ? postsList.value.slice(0, 2) : [fallbackPost]
})

// Spotlight posts - next 3 posts (posts 3, 4, 5 -> indices 2, 3, 4)
const spotlightBigPost = computed<BlogPost>(() => {
  return postsList.value[2] || fallbackPost
})

const spotlightSmallPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(3, 5)
})

// Sidebar recent posts
const recentSidebarPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(0, 5)
})

const totalPages = computed(() => gamingPosts.value?.pagination?.total_pages || 1)

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
  if (currentPage.value === 1) {
    return postsList.value.slice(5)
  }
  return postsList.value
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
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-[#0d0f12] text-zinc-800 dark:text-zinc-100 font-display transition-colors duration-300"
  >
    <!-- Main Navigation Header -->
    <Header theme="red" />

    <!-- MAIN AREA -->
    <main>
      <h1 class="sr-only">Thế giới Game - Tin tức Game & Esports mới nhất</h1>
      <!-- Admin Action Bar -->
      <div
        v-if="userStore.isAuthenticated && (userStore.role === 'admin' || userStore.role === 'mod')"
        class="bg-[#e74c3c]/10 border-b border-[#e74c3c]/20 py-3"
      >
        <div class="container mx-auto px-4 flex items-center justify-between">
          <span class="text-xs font-bold text-[#e74c3c] tracking-wider uppercase">
            Quản trị viên / Moderator
          </span>
          <NuxtLink
            to="/blog/publish?category=gaming"
            class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e74c3c] text-white hover:bg-[#c0392b] transition-all font-bold text-xs rounded-lg shadow-sm cursor-pointer"
          >
            📝 Đăng bài Game mới
          </NuxtLink>
        </div>
      </div>

      <!-- GAMING BANNER COMPONENT -->
      <GamingBanner v-if="currentPage === 1" :banner-posts="bannerPosts" />

      <!-- MIDDLE AD BANNER -->
      <AdBanner width="970px" height="90px" :is-google-ad="true" />

      <!-- CONTENT GRID: MAIN / SIDEBAR -->
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <!-- Main Content (70%) -->
          <div class="lg:col-span-7 space-y-12">
            <!-- GAMING SPOTLIGHT COMPONENT -->
            <GamingSpotlight
              v-if="currentPage === 1"
              :spotlight-big-post="spotlightBigPost"
              :spotlight-small-posts="spotlightSmallPosts"
            />

            <!-- MID AD BANNER 2 -->
            <AdBanner width="728px" height="90px" :is-google-ad="true" />

            <!-- NEWS GRID SECTION -->
            <div>
              <div
                id="news-list-section"
                class="border-b-2 border-zinc-800 dark:border-zinc-700 pb-2 mb-6 flex justify-between items-center"
              >
                <h2
                  class="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2"
                >
                  <TrendingUp class="w-5 h-5 text-[#e74c3c]" /> Tin mới cập nhật
                </h2>
              </div>

              <!-- Spinning Loading Indicator -->
              <div
                v-if="pending"
                class="flex flex-col items-center justify-center py-20 min-h-[350px]"
              >
                <div
                  class="w-10 h-10 border-4 border-[#e74c3c] border-t-transparent rounded-full animate-spin"
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
                  class="px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-855 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>

          <!-- GAMING SIDEBAR COMPONENT -->
          <GamingSidebar :recent-sidebar-posts="recentSidebarPosts" />
        </div>
      </div>
    </main>
    <!-- Footer -->
    <Footer theme="red" />
  </div>
</template>
