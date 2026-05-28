<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Menu, Facebook, Twitter, Instagram, Linkedin, TrendingUp, Monitor } from 'lucide-vue-next'
import type { BlogPost } from '../types/post.type'
import PostCard from '../components/PostCard.vue'
import AdBanner from '../components/AdBanner.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

// Set page meta for SEO optimization
useSeoMeta({
  title: 'Windows - Tin tức Windows TechDeal',
  description:
    'Chuyên mục Windows: Cập nhật thủ thuật Windows 11, tin tức hệ điều hành Microsoft, ứng dụng PC và hiệu năng phần cứng.',
  ogTitle: 'Chuyên mục Windows - TechDeal',
  ogDescription: 'Cập nhật tin tức Windows mới nhất hàng ngày.',
  ogType: 'website'
})

// Mock Articles
const posts = ref<BlogPost[]>([
  {
    id: 'w1',
    title: 'Microsoft ra mắt bản cập nhật Windows 11 thế hệ mới với loạt tính năng AI độc quyền',
    category: 'Windows',
    author: 'Admin',
    publishDate: 'Hôm nay lúc 11:20',
    views: 1450,
    comments: 12,
    imageUrl: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&w=800&q=80',
    summary: 'Bản cập nhật mới mang lại cải tiến sâu sắc cho Copilot, tối ưu hóa giao diện file explorer và tăng hiệu năng chơi game trên PC.',
    slug: 'microsoft-cap-nhat-windows-11-ai-doc-quyen'
  },
  {
    id: 'w2',
    title: '5 thủ thuật tối ưu hóa Windows giúp máy tính chơi game mượt mà hơn',
    category: 'Windows',
    author: 'GamerX',
    publishDate: '2 ngày trước',
    views: 3400,
    comments: 25,
    imageUrl: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    summary: 'Cách tắt các dịch vụ chạy ngầm thừa thãi, tinh chỉnh chế độ Game Mode và dọn dẹp phân mảnh hệ điều hành Windows cực nhanh.',
    slug: 'thu-thuat-toi-uu-windows-choi-game'
  }
])

// Computed property for sidebar
const mostViewedPosts = computed(() => {
  return [...posts.value].sort((a, b) => b.views - a.views)
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
    <header
      class="bg-white dark:bg-zinc-900 border-b border-gray-250 dark:border-zinc-800 sticky top-0 z-50 shadow-sm"
    >
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span class="text-3xl font-black tracking-tighter text-[#3498db]">
            TECHDEAL<span class="text-[#f39c12]">.</span>
          </span>
          <span
            class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#f39c12] text-white rounded"
            >TECH</span
          >
        </NuxtLink>

        <!-- Main Navigation Links -->
        <nav
          class="hidden lg:flex items-center gap-6 font-semibold text-sm text-zinc-700 dark:text-zinc-300"
        >
          <NuxtLink to="/" class="hover:text-[#3498db] transition-colors">Trang chủ</NuxtLink>
          <NuxtLink to="/game" class="hover:text-[#3498db] transition-colors">Thế giới Game</NuxtLink>
          <NuxtLink to="/cong-nghe" class="hover:text-[#3498db] transition-colors">Công nghệ</NuxtLink>
          <NuxtLink to="/windows" class="text-[#3498db]">Windows</NuxtLink>
          <NuxtLink to="/ios" class="hover:text-[#3498db] transition-colors">iOS</NuxtLink>
          <NuxtLink to="/android" class="hover:text-[#3498db] transition-colors">Android</NuxtLink>
        </nav>

        <!-- Search input box -->
        <div class="flex items-center gap-3">
          <form @submit.prevent="handleSearch" class="relative hidden sm:block">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm tin tức..."
              class="bg-gray-150 dark:bg-zinc-800 text-xs px-3 py-1.5 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-[#3498db] w-48 dark:text-white"
            />
            <button
              type="submit"
              class="absolute right-2 top-1.5 text-zinc-555 hover:text-[#3498db]"
            >
              <Search class="w-4 h-4" />
            </button>
          </form>
          <!-- Auth buttons -->
          <div
            class="hidden sm:flex items-center gap-3 border-l border-gray-250 dark:border-zinc-800 pl-3"
          >
            <NuxtLink
              to="/login"
              class="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#3498db] transition-colors"
              >Đăng nhập</NuxtLink
            >
            <NuxtLink
              to="/register"
              class="text-xs font-bold bg-[#3498db] hover:bg-sky-600 text-white px-3.5 py-1.5 rounded-full transition-colors"
              >Đăng ký</NuxtLink
            >
          </div>
          <button class="lg:hidden text-zinc-700 dark:text-white">
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="container mx-auto px-4 py-6">
      <!-- CATEGORY BANNER -->
      <div class="bg-gradient-to-r from-blue-700 to-indigo-500 rounded-2xl p-8 mb-6 text-white shadow-md relative overflow-hidden">
        <div class="absolute right-6 bottom-0 translate-y-6 opacity-10">
          <Monitor class="w-48 h-48" />
        </div>
        <div class="relative z-10">
          <span class="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Chuyên mục</span>
          <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-3">Windows</h1>
          <p class="text-sm text-blue-50 mt-2 max-w-xl">
            Cập nhật tin tức mới nhất về hệ điều hành Windows, các thủ thuật sử dụng máy tính hiệu quả và ứng dụng hàng đầu dành cho PC.
          </p>
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
