<script setup lang="ts">
import { ref, computed } from 'vue'

import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import GamingBanner from '../components/gaming/GamingBanner.vue'
import GamingCategories from '../components/gaming/GamingCategories.vue'
import GamingSidebar from '../components/gaming/GamingSidebar.vue'
import GamingSpotlight from '../components/gaming/GamingSpotlight.vue'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'

const userStore = useUserStore()

// SEO optimization for Gaming Page
useSeoMeta({
  title: 'Thế giới Game - Tin tức Game & Esports mới nhất',
  description:
    'Trang tin tức game, đánh giá game, esports, tin công nghệ phần cứng chơi game hàng đầu.',
  ogTitle: 'Thế giới Game - TechDeal Gaming',
  ogDescription: 'Cập nhật tin tức esports, game thủ và xu hướng game thế giới.',
  ogType: 'website'
})

// Mock categories for gaming
const categories = ref([
  { name: 'Action', count: '120 bài', icon: '💥' },
  { name: 'Gaming', count: '340 bài', icon: '🎮' },
  { name: 'Racing', count: '85 bài', icon: '🏎️' },
  { name: 'Animation', count: '92 bài', icon: '🎬' },
  { name: 'Fighter', count: '64 bài', icon: '🥊' },
  { name: 'RPG/Story', count: '150 bài', icon: '🧙‍♂️' }
])

// Fetch gaming articles dynamically
const { data: gamingPosts } = await useAsyncData('posts-gaming', () =>
  blogRepository.getPosts({ category: 'gaming', limit: 20 })
)

const postsList = computed(() => gamingPosts.value || [])

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
  return postsList.value.slice(0, 1).length > 0 ? postsList.value.slice(0, 1) : [fallbackPost]
})

// Spotlight posts
const spotlightBigPost = computed<BlogPost>(() => {
  return postsList.value[1] || fallbackPost
})

const spotlightSmallPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(2, 4)
})

// Popular News list
const popularMediumPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(4, 6)
})

const popularSmallPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(6, 9)
})

// Sidebar recent posts
const recentSidebarPosts = computed<BlogPost[]>(() => {
  return postsList.value.slice(9, 14)
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
      <GamingBanner :banner-posts="bannerPosts" />

      <!-- GAMING CATEGORIES COMPONENT -->
      <GamingCategories :categories="categories" />

      <!-- MIDDLE AD BANNER -->
      <AdBanner width="970px" height="90px" :is-google-ad="true" />

      <!-- CONTENT GRID: MAIN / SIDEBAR -->
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <!-- Main Content (70%) -->
          <div class="lg:col-span-7 space-y-12">
            <!-- GAMING SPOTLIGHT COMPONENT -->
            <GamingSpotlight
              :spotlight-big-post="spotlightBigPost"
              :spotlight-small-posts="spotlightSmallPosts"
            />

            <!-- MID AD BANNER 2 -->
            <AdBanner width="728px" height="90px" />

            <!-- POPULAR NEWS SECTION -->
            <div>
              <div class="border-b border-gray-250 dark:border-zinc-800 pb-3 mb-6">
                <h3
                  class="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white border-l-4 border-[#e74c3c] pl-3"
                >
                  Tin game phổ biến nhất
                </h3>
              </div>

              <!-- 2 Medium overlay cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div
                  v-for="mPost in popularMediumPosts"
                  :key="mPost.id"
                  class="relative aspect-[16/10] rounded-xl overflow-hidden group shadow-lg"
                >
                  <img
                    :src="mPost.imageUrl"
                    :alt="mPost.title"
                    class="w-full h-full object-cover opacity-70 group-hover:scale-102 transition-transform duration-500"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5"
                  >
                    <span
                      class="self-start bg-[#e74c3c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-2"
                    >
                      {{ mPost.category }}
                    </span>
                    <h4 class="text-sm font-bold text-white hover:text-[#e74c3c] transition-colors">
                      <NuxtLink :to="`/blog/${mPost.slug}.${mPost.id}`">{{ mPost.title }}</NuxtLink>
                    </h4>
                  </div>
                </div>
              </div>

              <!-- 3 Small text posts with thumb -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="pPost in popularSmallPosts"
                  :key="pPost.id"
                  class="bg-white dark:bg-[#13161c] border border-gray-200 dark:border-zinc-855 p-3 rounded-xl flex flex-col gap-3 group hover:border-gray-300 dark:hover:border-zinc-800 transition-all shadow-xs"
                >
                  <div class="aspect-[16/9] w-full rounded overflow-hidden">
                    <NuxtLink :to="`/blog/${pPost.slug}.${pPost.id}`" class="block w-full h-full">
                      <img
                        :src="pPost.imageUrl"
                        :alt="pPost.title"
                        class="w-full h-full object-cover"
                      />
                    </NuxtLink>
                  </div>
                  <div class="flex-grow flex flex-col justify-between">
                    <div>
                      <span class="text-[9px] font-bold text-[#e74c3c] uppercase block mb-1">
                        {{ pPost.category }}
                      </span>
                      <h5
                        class="text-xs font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-tight group-hover:text-[#e74c3c] transition-colors"
                      >
                        <NuxtLink :to="`/blog/${pPost.slug}.${pPost.id}`">{{
                          pPost.title
                        }}</NuxtLink>
                      </h5>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-zinc-555 mt-2">
                      <Eye class="w-3.5 h-3.5 text-red-500" :stroke-width="2.5" />
                      <span>{{ pPost.views }} xem</span>
                    </div>
                  </div>
                </div>
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
