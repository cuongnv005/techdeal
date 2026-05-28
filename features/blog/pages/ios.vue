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
  Smartphone
} from 'lucide-vue-next'
import { useUserStore } from '@stores/user'
import type { BlogPost } from '../types/post.type'
import PostCard from '../components/PostCard.vue'
import AdBanner from '../components/AdBanner.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'
import Header from '../components/Header.vue'

// Set page meta for SEO optimization
useSeoMeta({
  title: 'iOS - Tin tức iOS TechDeal',
  description:
    'Chuyên mục iOS: Cập nhật tin tức iPhone, iPad, các bản cập nhật iOS mới nhất, thủ thuật sử dụng và đánh giá ứng dụng Apple.',
  ogTitle: 'Chuyên mục iOS - TechDeal',
  ogDescription: 'Cập nhật tin tức iOS mới nhất hàng ngày.',
  ogType: 'website'
})

// Mock Articles
const posts = ref<BlogPost[]>([
  {
    id: 'i1',
    title: 'Apple phát hành iOS 19.5: Cải thiện hiệu năng pin và nâng cấp Siri thông minh hơn',
    category: 'iOS',
    author: 'Admin',
    publishDate: 'Hôm nay lúc 09:15',
    views: 1890,
    comments: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    summary:
      'Bản nâng cấp iOS mới chính thức cho tải về toàn cầu, sửa lỗi nóng máy trên dòng iPhone 16 và tối ưu hóa kết nối sóng.',
    slug: 'apple-phat-hanh-ios-19-5-pin-tot-hon'
  },
  {
    id: '4',
    title:
      '(iOS/Android) Nhận key gói Premium ứng dụng giúp thư giãn, ngủ ngon, chữa bệnh trị giá $399.99',
    category: 'Mobile',
    author: 'Nguyễn Cường',
    publishDate: 'Hôm nay lúc 20:31',
    views: 9805,
    comments: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1511295742364-92b9345f8e00?auto=format&fit=crop&w=800&q=80',
    summary:
      'Nếu bạn đang tìm kiếm một giải pháp để thư giãn tâm trí, ngủ ngon hơn, giảm căng thẳng thì Calm chính là ứng dụng không thể bỏ qua.',
    slug: 'nhan-key-premium-ung-dung-thu-gian-ngu-ngon'
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
        class="bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-8 mb-6 text-white shadow-md relative overflow-hidden"
      >
        <div class="absolute right-6 bottom-0 translate-y-6 opacity-10">
          <Smartphone class="w-48 h-48" />
        </div>
        <div
          class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <span
              class="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full"
              >Chuyên mục</span
            >
            <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-3">iOS</h1>
            <p class="text-sm text-zinc-100 mt-2 max-w-xl">
              Tin tức mới nhất về iOS, hệ sinh thái Apple, các mẹo sử dụng iPhone, iPad hiệu quả và
              đánh giá chi tiết ứng dụng trên App Store.
            </p>
          </div>
          <div
            v-if="
              userStore.isAuthenticated && (userStore.role === 'admin' || userStore.role === 'mod')
            "
          >
            <NuxtLink
              to="/blog/publish?category=ios"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-800 hover:bg-zinc-100 transition-all font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
