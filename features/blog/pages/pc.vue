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
import { useUserStore } from '@stores/user'
import type { BlogPost } from '../types/post.type'
import PostCard from '../components/PostCard.vue'
import AdBanner from '../components/AdBanner.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'
import Header from '../components/Header.vue'

// Set page meta for SEO optimization
useSeoMeta({
  title: 'PC máy tính - Tin tức Phần cứng & Lắp ráp TechDeal',
  description:
    'Chuyên mục PC máy tính: Cập nhật nhanh nhất tin tức phần cứng, CPU, GPU, linh kiện máy tính, hướng dẫn lắp ráp và tối ưu PC.',
  ogTitle: 'Chuyên mục PC máy tính - TechDeal',
  ogDescription: 'Cập nhật tin tức phần cứng máy tính và linh kiện PC mới nhất.',
  ogType: 'website'
})

// Mock Articles
const posts = ref<BlogPost[]>([
  {
    id: 'pc1',
    title: 'NVIDIA RTX 5090 chính thức lộ diện cấu hình khủng: Bộ nhớ 32GB GDDR7, điện năng 600W',
    category: 'PC máy tính',
    author: 'TechDeal Hardware',
    publishDate: 'Hôm nay lúc 10:15',
    views: 3890,
    comments: 24,
    imageUrl:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    summary:
      'Thế hệ card đồ họa flagship Blackwell tiếp theo của NVIDIA hứa hẹn tăng gấp đôi hiệu suất xử lý ray tracing và tối ưu hóa tối đa cho các tác vụ AI.',
    slug: 'nvidia-rtx-5090-lo-dien-cau-hinh'
  },
  {
    id: 'pc2',
    title: 'Đánh giá chi tiết CPU AMD Ryzen 9 9955X: Vị vua mới của phân khúc làm việc và sáng tạo nội dung',
    category: 'PC máy tính',
    author: 'Admin',
    publishDate: 'Hôm qua lúc 14:30',
    views: 2410,
    comments: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    summary:
      'Với kiến trúc Zen 5 tiến trình 4nm mới nhất, Ryzen 9955X mang lại hiệu năng đa nhân vượt trội trong khi lượng điện tiêu thụ tối ưu hơn nhiều so với thế hệ trước.',
    slug: 'danh-gia-amd-ryzen-9-9955x'
  }
])

// Computed property for sidebar
const mostViewedPosts = computed(() => {
  return [...posts.value].sort((a, b) => b.views - a.views)
})

// User store for checking roles
const userStore = useUserStore()
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-zinc-955 font-display transition-colors duration-300"
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
        <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span
              class="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full"
              >Chuyên mục</span
            >
            <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-3">PC máy tính</h1>
            <p class="text-sm text-indigo-50 mt-2 max-w-xl">
              Tin tức mới nhất về phần cứng máy tính, linh kiện CPU, GPU, RAM, hướng dẫn tự ráp PC chơi game và tối ưu hóa hệ thống.
            </p>
          </div>
          <div v-if="userStore.isAuthenticated && (userStore.role === 'admin' || userStore.role === 'mod')">
            <NuxtLink
              to="/blog/publish?category=pc"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-650 hover:bg-indigo-50 transition-all font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
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
    <Footer />
  </div>
</template>
