<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'
import type { BlogPost } from '../types/post.type'
import PostCard from '../components/PostCard.vue'
import AdBanner from '../components/AdBanner.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

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

// Mock Articles
const posts = ref<BlogPost[]>([
  {
    id: '1',
    title:
      'realme 16 Pro và realme 16 5G ra mắt: trải nghiệm nhiếp ảnh chân dung di động độc đáo cùng Camera đa tiêu cự 200M',
    category: 'Technology',
    author: 'Mr.X',
    publishDate: 'Hôm nay lúc 18:50',
    views: 406,
    comments: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    summary:
      'TP. Hồ Chí Minh, ngày 29/01/2026 - realme, thương hiệu smartphone tăng trưởng nhanh hàng đầu thế giới, chính thức ra mắt bộ đôi realme 16 Pro và realme 16 5G tại thị trường Việt Nam.',
    slug: 'realme-16-pro-va-realme-16-5g-ra-mat'
  }
])

// Featured Posts (Hero Section)
const featuredBigPost = ref<BlogPost>({
  id: 'f1',
  title:
    'Cuộc cách mạng thực tế ảo tiếp theo: Kỷ nguyên mới cho ngành công nghiệp game và thực tế hỗn hợp',
  category: 'Technology',
  author: 'TechDeal Editor',
  publishDate: '28 Tháng 5, 2026',
  views: 1250,
  comments: 4,
  imageUrl:
    'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80',
  summary:
    'Công nghệ thực tế ảo và thực tế hỗn hợp đang tiến gần hơn tới đời sống thường nhật với hàng loạt kính thông minh tích hợp trí tuệ nhân tạo ra đời trong năm 2026.',
  slug: 'cuoc-cach-mang-thuc-te-ao-tiep-theo'
})

const featuredSmallPosts = ref<BlogPost[]>([
  {
    id: 'f2',
    title: 'Đánh giá chi tiết iPhone 17 Pro Max với những cải tiến mang tính cách mạng',
    category: 'Mobile',
    author: 'Admin',
    publishDate: '27 Tháng 5, 2026',
    views: 890,
    comments: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80',
    summary: '',
    slug: 'danh-gia-chi-tiet-iphone-17-pro-max'
  }
])

// Computed property for the most viewed posts of the month
const mostViewedPosts = computed(() => {
  return [...posts.value, featuredBigPost.value, ...featuredSmallPosts.value].sort(
    (a, b) => b.views - a.views
  )
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
