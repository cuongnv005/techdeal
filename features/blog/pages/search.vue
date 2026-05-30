<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useAsyncData } from '#app'
import { Search, TrendingUp } from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'
import Footer from '../components/Footer.vue'

import type { BlogPost } from '../types/post.type'

const route = useRoute()

const queryTerm = computed(() => (route.query.q as string) || '')
const titleTerm = computed(() => (route.query.title as string) || '')

// Set page meta for SEO optimization
useSeoMeta({
  title: computed(() => `Kết quả tìm kiếm cho "${queryTerm.value || titleTerm.value}" - TechDeal`),
  description: computed(
    () =>
      `Kết quả tìm kiếm bài viết cho từ khóa "${queryTerm.value || titleTerm.value}" trên TechDeal.`
  ),
  ogTitle: computed(() => `Tìm kiếm: ${queryTerm.value || titleTerm.value} - TechDeal`),
  ogType: 'website'
})

// Fetch search articles dynamically based on parameters
const { data: searchResultPosts, refresh } = await useAsyncData(
  () => `search-posts-${queryTerm.value}-${titleTerm.value}`,
  () =>
    blogRepository.getPosts({
      q: queryTerm.value || undefined,
      title: titleTerm.value || undefined,
      limit: 20
    })
)

const posts = computed(() => searchResultPosts.value || [])

// Watch for search query changes and refetch
watch(
  () => [route.query.q, route.query.title],
  () => {
    refresh()
  }
)

// Computed property for sidebar
const mostViewedPosts = computed(() => {
  return [...posts.value].sort((a, b) => b.views - a.views)
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <!-- Main Navigation Header -->
    <Header />

    <!-- Main Content Area -->
    <main class="container mx-auto px-4 py-6">
      <!-- CATEGORY BANNER -->
      <div
        class="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-8 mb-6 text-white shadow-md relative overflow-hidden"
      >
        <div class="absolute right-6 bottom-0 translate-y-6 opacity-10">
          <Search class="w-48 h-48" />
        </div>
        <div class="relative z-10">
          <span
            class="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full"
          >
            Tìm kiếm bài viết
          </span>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-3">
            Kết quả cho: "{{ queryTerm || titleTerm }}"
          </h1>
          <p class="text-xs text-blue-50 mt-2 max-w-xl">
            Tìm thấy {{ posts.length }} bài viết khớp với từ khóa tìm kiếm của bạn.
          </p>
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
              <TrendingUp class="w-5 h-5 text-[#3498db]" /> Kết quả tìm kiếm
            </h2>
          </div>

          <!-- Empty State -->
          <div
            v-if="posts.length === 0"
            class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 p-12 text-center"
          >
            <span class="text-4xl mb-4 block">🔍</span>
            <h3 class="text-base font-bold text-zinc-900 dark:text-white mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p class="text-xs text-zinc-500 max-w-md mx-auto">
              Không tìm thấy bài viết khớp với từ khóa của bạn. Vui lòng thử tìm kiếm với một từ
              khóa khác.
            </p>
          </div>

          <!-- Simplified News Grid (Using PostCard layout) -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
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
