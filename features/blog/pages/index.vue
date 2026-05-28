<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  TrendingUp
} from 'lucide-vue-next'
import type { BlogPost } from '../types/post.type'
import PostCard from '../components/PostCard.vue'
import AdBanner from '../components/AdBanner.vue'
import HomeHero from '../components/home/HomeHero.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

// Set page meta for SEO optimization
useSeoMeta({
  title: 'Trang chủ - Tin tức Công nghệ Zaira',
  description:
    'Trang tin tức công nghệ hàng đầu, cập nhật nhanh nhất các xu hướng công nghệ, điện thoại di động, tai nghe, AI và thế giới số.',
  ogTitle: 'Trang chủ - Tin tức Công nghệ Zaira',
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
      'TP. Hồ Chí Minh, ngày 29/01/2026 - realme, thương hiệu smartphone tăng trưởng nhanh hàng đầu thế giới, chính thức ra mắt bộ đôi realme 16 Pro và realme 16 5G tại thị trường Việt Nam, mở ra kỷ nguyên mới của nhiếp ảnh di động với camera đa tiêu cự 200MP, thiết kế thanh lịch đột phá với gương selfie, cùng nhiều tính năng AI thông minh, với viên pin Titan 7000mAh nhưng vẫn giữ được độ mỏng nhẹ đầy ấn tượng. Sự kiện đánh dấu bước tiến mới của realme trong hành trình mang những trải nghiệm công nghệ cao cấp đến gần hơn với người dùng trẻ.',
    slug: 'realme-16-pro-va-realme-16-5g-ra-mat'
  },
  {
    id: '2',
    title:
      'Tai nghe soundcore R60i NC: tai nghe chống ồn dưới 1 triệu, pin trâu, có cả dịch thuật tiếng Việt, đáng tiền!',
    category: 'Gadget',
    author: 'TRKD',
    publishDate: 'Hôm nay lúc 13:41',
    views: 1355,
    comments: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    summary:
      'Nếu chỉ có ngân sách dưới 1 triệu đồng nhưng vẫn muốn có 1 chiếc tai nghe chống ồn "xịn", pin khủng và nhiều tính năng từ 1 thương hiệu đáng tin cậy thì soundcore R60i NC là 1 lựa chọn rất đáng cân nhắc. Đặc biệt, nếu so với mẫu R50i NC, chiếc tai nghe này có sự nâng cấp rất mạnh mẽ.',
    slug: 'tai-nghe-soundcore-r60i-nc-chong-on-duoi-1-trieu'
  },
  {
    id: '3',
    title:
      'Tim Cook hé lộ tính năng Apple Intelligence được yêu thích nhất, bạn có sử dụng?',
    category: 'Technology',
    author: 'Mr.X',
    publishDate: 'Hôm nay lúc 13:06',
    views: 210,
    comments: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=800&q=80',
    summary:
      'Sau khi công bố kết quả kinh doanh quý I năm tài chính 2026 với nhiều tín hiệu tích cực, CEO Apple Tim Cook đã tham gia buổi họp với giới phân tích và chia sẻ thêm về mức độ đón nhận của Apple Intelligence trên iPhone. Theo ông, tính năng được người dùng sử dụng nhiều nhất hiện nay không phải Siri, mà là Visual Intelligence - một công cụ trí tuệ nhân tạo dựa trên camera, có cách dùng khá tương đồng với Google Lens.',
    slug: 'tim-cook-he-lo-tinh-nang-apple-intelligence-duoc-yeu-thich'
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
      'Nếu bạn đang tìm kiếm một giải pháp để thư giãn tâm trí, ngủ ngon hơn, giảm căng thẳng và lấy lại sự cân bằng trong cuộc sống, thì Calm chính là ứng dụng không thể bỏ qua. Calm hiện đang là ứng dụng số 1 thế giới về thiền, giấc ngủ và sức khỏe tinh thần, được hàng triệu người tin dùng mỗi ngày để tìm lại sự bình yên bên trong mình. Và đặc biệt, bạn hoàn toàn có thể nhận miễn phí gói Premium cao cấp trị giá lên đến 399.99 USD thông qua một mã tặng đặc biệt, sử dụng được cho cả thiết bị iOS và Android.',
    slug: 'nhan-key-premium-ung-dung-thu-gian-ngu-ngon'
  }
])

// Featured Posts (Hero Section)
const featuredBigPost = ref<BlogPost>({
  id: 'f1',
  title:
    'Cuộc cách mạng thực tế ảo tiếp theo: Kỷ nguyên mới cho ngành công nghiệp game và thực tế hỗn hợp',
  category: 'Technology',
  author: 'Zaira Editor',
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
    title:
      'Đánh giá chi tiết iPhone 17 Pro Max với những cải tiến mang tính cách mạng',
    category: 'Mobile',
    author: 'Admin',
    publishDate: '27 Tháng 5, 2026',
    views: 890,
    comments: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=400&q=80',
    summary: '',
    slug: 'danh-gia-chi-tiet-iphone-17-pro-max'
  },
  {
    id: 'f3',
    title: 'Hướng dẫn tối ưu hóa hình ảnh cho các dự án Nuxt 4 của bạn',
    category: 'Dev',
    author: 'Code Master',
    publishDate: '26 Tháng 5, 2026',
    views: 540,
    comments: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    summary: '',
    slug: 'toi-uu-hoa-hinh-anh-nuxt-4'
  }
])

// Computed property for the most viewed posts of the month
const mostViewedPosts = computed(() => {
  return [...posts.value, featuredBigPost.value, ...featuredSmallPosts.value]
    .sort((a, b) => b.views - a.views)
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
        <div class="flex items-center gap-2">
          <span class="text-3xl font-black tracking-tighter text-[#3498db]">
            ZAIRA<span class="text-[#f39c12]">.</span>
          </span>
          <span
            class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#f39c12] text-white rounded"
            >TECH</span
          >
        </div>

        <!-- Main Navigation Links -->
        <nav
          class="hidden lg:flex items-center gap-6 font-semibold text-sm text-zinc-700 dark:text-zinc-300"
        >
          <NuxtLink to="/" class="text-[#3498db] hover:text-[#3498db]">Trang chủ</NuxtLink>
          <NuxtLink to="/game" class="hover:text-[#3498db] transition-colors">Thế giới Game</NuxtLink>
          <a href="#" class="hover:text-[#3498db] transition-colors">Công nghệ</a>
          <a href="#" class="hover:text-[#3498db] transition-colors">Thiết bị di động</a>
          <a href="#" class="hover:text-[#3498db] transition-colors">Trí tuệ nhân tạo</a>
          <a href="#" class="hover:text-[#3498db] transition-colors">Liên hệ</a>
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
              class="absolute right-2 top-1.5 text-zinc-500 hover:text-[#3498db]"
            >
              <Search class="w-4 h-4" />
            </button>
          </form>
          <button class="lg:hidden text-zinc-700 dark:text-white">
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

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
    <footer class="bg-zinc-900 text-zinc-400 text-xs py-10 mt-16 border-t border-zinc-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 class="text-white text-lg font-black tracking-tight mb-4">ZAIRA.</h4>
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
            <p class="mb-2">Email: contact@zairatech.com</p>
            <p>Điện thoại: +84 (0) 123 456 789</p>
          </div>
        </div>
        <div class="border-t border-zinc-800 mt-8 pt-6 text-center text-[10px] text-zinc-600">
          © 2026 ZAIRA News Magazine. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  </div>
</template>
