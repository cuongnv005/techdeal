<script setup lang="ts">
import { ref, computed } from 'vue'

import { TrendingUp } from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

import type { BlogPost } from '../types/post.type'

// Set page meta for SEO optimization
useSeoMeta({
  title: 'Trang chủ - Tin tức Công nghệ TechDeal',
  description:
    'Trang tin tức công nghệ hàng đầu, cập nhật nhanh nhất các xu hướng công nghệ, điện thoại di động, tai nghe, AI và thế giới số.',
  ogTitle: 'Trang chủ - Tin tức Công nghệ TechDeal',
  ogDescription: 'Cập nhật tin tức công nghệ mới nhất hàng ngày.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// Fetch posts from API using useAsyncData
const { data: allPosts } = await useAsyncData('public-posts', () =>
  blogRepository.getPosts({ limit: 20 })
)

const postsList = computed<BlogPost[]>(() => allPosts.value || [])

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
  if (postsList.value.length <= 3) {
    // If we don't have enough posts to fill hero, show all of them in list too
    return postsList.value
  }
  return postsList.value.slice(3)
})

// Computed property for the most viewed posts of the month
const mostViewedPosts = computed(() => {
  return [...postsList.value].sort((a, b) => b.views - a.views)
})

// Search query
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value) {
    alert(`Tìm kiếm với từ khóa: ${searchQuery.value}`)
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
      <!-- HERO COMPONENT -->
      <HomeHero :featured-big-post="featuredBigPost" :featured-small-posts="featuredSmallPosts" />

      <!-- AD BANNER BLOCK -->
      <AdBanner width="970px" height="90px" />

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

          <!-- Bottom Ad Banner -->
          <div class="mt-8">
            <AdBanner width="728px" height="90px" />
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
