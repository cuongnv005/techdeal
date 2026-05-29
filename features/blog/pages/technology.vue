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
  Cpu
} from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import Header from '../components/Header.vue'
import PostCard from '../components/PostCard.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'

// Set page meta for SEO optimization
useSeoMeta({
  title: 'Công nghệ - Tin tức Công nghệ TechDeal',
  description:
    'Chuyên mục Công nghệ: Cập nhật nhanh nhất các xu hướng công nghệ, tin tức AI, phần cứng và thế giới số.',
  ogTitle: 'Chuyên mục Công nghệ - TechDeal',
  ogDescription: 'Cập nhật tin tức công nghệ mới nhất hàng ngày.',
  ogType: 'website'
})

// Fetch articles dynamically
const { data: categoryPosts } = await useAsyncData('posts-technology', () =>
  blogRepository.getPosts({ category: 'technology', limit: 12 })
)
const posts = computed(() => categoryPosts.value || [])

// Computed property for sidebar (popular posts)
const mostViewedPosts = computed(() => {
  return [...posts.value].sort((a, b) => b.views - a.views)
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
    <footer class="bg-zinc-900 text-zinc-400 text-xs py-10 mt-16 border-t border-zinc-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <NuxtLink to="/">
              <h4
                class="text-white text-lg font-black tracking-tight mb-4 hover:text-[#3498db] transition-colors"
              >
                TECHDEAL.
              </h4>
            </NuxtLink>
            <p class="leading-relaxed text-zinc-500">
              Trang tin tức cập nhật tin công nghệ và khoa học máy tính nhanh chóng, chuẩn xác.
            </p>
          </div>
          <div>
            <h4 class="text-white font-bold uppercase mb-4">Liên kết hữu ích</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Giới thiệu bản tin</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold uppercase mb-4">Liên hệ hỗ trợ</h4>
            <p class="mb-2">Email: contact@techdeal.com</p>
            <p>Điện thoại: +84 (0) 123 456 789</p>
          </div>
        </div>
        <div class="border-t border-zinc-800 mt-8 pt-6 text-center text-[10px] text-zinc-600">
          © 2026 TECHDEAL News Magazine. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  </div>
</template>
