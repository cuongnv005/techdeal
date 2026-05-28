<script setup lang="ts">
import { ref } from 'vue'
import { Search, Menu, Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next'
import type { BlogPost } from '../types/post.type'
import AdBanner from '../components/AdBanner.vue'
import GamingBanner from '../components/gaming/GamingBanner.vue'
import GamingCategories from '../components/gaming/GamingCategories.vue'
import GamingSpotlight from '../components/gaming/GamingSpotlight.vue'
import GamingSidebar from '../components/gaming/GamingSidebar.vue'

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

// Banner Posts (Big header layout)
const bannerPosts = ref<BlogPost[]>([
  {
    id: 'gb1',
    title: 'Đánh giá Black Myth: Wukong - Tuyệt tác game hành động nhập vai đỉnh cao nhất thập kỷ',
    category: 'Fighter',
    author: 'Admin',
    publishDate: '27 Tháng 5, 2026',
    views: 4520,
    comments: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    summary:
      'Black Myth: Wukong mang lại trải nghiệm chiến đấu hoành tráng cùng đồ họa Unreal Engine 5 đỉnh cao, tái hiện chân thực thế giới Tây Du Ký.',
    slug: 'danh-gia-black-myth-wukong'
  },
  {
    id: 'gb2',
    title: 'CS2 ra mắt bản cập nhật lớn: Thay đổi meta bản đồ và nâng cấp hệ thống chống hack mới',
    category: 'Action',
    author: 'GameMaster',
    publishDate: '27 Tháng 5, 2026',
    views: 3120,
    comments: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
    summary:
      'Valve vừa tung ra bản cập nhật tối ưu hóa hiệu năng bắn súng chiến thuật cùng với cải tiến lớn cho bản đồ Mirage và Inferno.',
    slug: 'cs2-ra-mat-ban-cap-nhat-lon'
  }
])

// Spotlight posts
const spotlightBigPost = ref<BlogPost>({
  id: 'gs1',
  title:
    'Giải đấu Liên Minh Huyền Thoại VCS Mùa Hè 2026 chính thức khởi tranh với tổng giải thưởng kỷ lục',
  category: 'Esports',
  author: 'VCS Reporter',
  publishDate: '28 Tháng 5, 2026',
  views: 5800,
  comments: 32,
  imageUrl:
    'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
  summary:
    'Mùa giải mới quy tụ các đội tuyển Liên Minh hàng đầu Việt Nam tranh tài cho tấm vé đi chung kết thế giới.',
  slug: 'vcs-mua-he-2026-khoi-tranh'
})

const spotlightSmallPosts = ref<BlogPost[]>([
  {
    id: 'gs2',
    title:
      'Fortnite đạt kỷ lục người chơi cùng lúc mới nhờ sự kiện kết hợp đặc biệt với vũ trụ Marvel',
    category: 'Action',
    author: 'Admin',
    publishDate: '28 Tháng 5, 2026',
    views: 1980,
    comments: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=400&q=80',
    summary: '',
    slug: 'fortnite-dat-ky-luc-nguoi-choi-moi'
  },
  {
    id: 'gs3',
    title:
      'GTA 6 lộ diện trailer tiếp theo: Thành phố Vice City chưa bao giờ sống động và chân thực đến thế',
    category: 'RPG',
    author: 'RockstarFan',
    publishDate: '27 Tháng 5, 2026',
    views: 10450,
    comments: 54,
    imageUrl:
      'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=400&q=80',
    summary: '',
    slug: 'gta-6-lo-dien-trailer-tiep-theo'
  },
  {
    id: 'gs4',
    title: 'Nintendo Switch 2 sẽ chính thức công bố cấu hình và ngày phát hành vào cuối năm nay?',
    category: 'Console',
    author: 'NintendoNews',
    publishDate: '27 Tháng 5, 2026',
    views: 4500,
    comments: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1595169001925-51e18ede8436?auto=format&fit=crop&w=400&q=80',
    summary: '',
    slug: 'nintendo-switch-2-sap-cong-bo'
  }
])

// Popular News list (2 medium cards, 3 small text cards)
const popularMediumPosts = ref<BlogPost[]>([
  {
    id: 'gp1',
    title: 'Giải đua xe ảo F1 Esports Pro Series 2026 khởi động chặng đua gay cấn đầu tiên',
    category: 'Racing',
    author: 'RacingPro',
    publishDate: '28 Tháng 5, 2026',
    views: 1200,
    comments: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
    summary: '',
    slug: 'f1-esports-pro-series-2026'
  },
  {
    id: 'gp2',
    title: 'Hướng dẫn tự tạo game phong cách Retro đơn giản bằng Engine Godot trong 24 giờ',
    category: 'Coding',
    author: 'DevIndie',
    publishDate: '26 Tháng 5, 2026',
    views: 2900,
    comments: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80',
    summary: '',
    slug: 'tu-tao-game-retro-bang-godot'
  }
])

const popularSmallPosts = ref<BlogPost[]>([
  {
    id: 'gp3',
    title: 'The Magic of Elden Ring: Phân tích cốt truyện vùng đất Shadow of the Erdtree',
    category: 'Lore',
    author: 'LoreMaster',
    publishDate: '25 Tháng 5, 2026',
    views: 3120,
    comments: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80',
    summary: '',
    slug: 'phan-tich-cot-truyen-elden-ring-dlc'
  },
  {
    id: 'gp4',
    title: 'Cải tiến hiệu năng máy chơi game PC di động cầm tay Steam Deck OLED',
    category: 'Hardware',
    author: 'HardwareReview',
    publishDate: '24 Tháng 5, 2026',
    views: 1850,
    comments: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=300&q=80',
    summary: '',
    slug: 'cai-tien-hieu-nang-steam-deck-oled'
  },
  {
    id: 'gp5',
    title: 'Những tựa game indie cốt truyện cực hay đáng thử trong kỳ nghỉ hè năm nay',
    category: 'Indie',
    author: 'IndieLover',
    publishDate: '23 Tháng 5, 2026',
    views: 4500,
    comments: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    summary: '',
    slug: 'game-indie-cot-truyen-hay-he-2026'
  }
])

// Sidebar recent posts
const recentSidebarPosts = ref<BlogPost[]>([
  {
    id: 'rs1',
    title: 'Đánh giá tay cầm DualSense Edge sau 6 tháng sử dụng liên tục',
    category: 'Accessory',
    author: 'GamerX',
    publishDate: '28 Tháng 5, 2026',
    views: 890,
    comments: 1,
    imageUrl: '',
    summary: '',
    slug: 'danh-gia-tay-cam-dualsense-edge'
  },
  {
    id: 'rs2',
    title: 'Sự trỗi dậy của các tựa game Co-op gia đình trên hệ máy Nintendo',
    category: 'Casual',
    author: 'FamilyFun',
    publishDate: '27 Tháng 5, 2026',
    views: 1200,
    comments: 4,
    imageUrl: '',
    summary: '',
    slug: 'game-coop-gia-dinh-nintendo'
  }
])
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-[#0d0f12] text-zinc-800 dark:text-zinc-100 font-display transition-colors duration-300"
  >
    <!-- Top Nav / Social Wrap (Dark themed) -->
    <div class="bg-zinc-900 text-xs py-2 border-b border-zinc-800 dark:border-zinc-900 text-white">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span
            class="bg-[#e74c3c] text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center gap-1 animate-pulse"
          >
            💥 Esports
          </span>
          <span class="truncate max-w-[250px] sm:max-w-md text-zinc-350">
            Black Myth: Wukong đạt mốc doanh thu 20 triệu bản chỉ sau thời gian ngắn...
          </span>
        </div>
        <div class="hidden md:flex items-center gap-4 text-zinc-350">
          <a href="#" class="hover:text-[#e74c3c] transition-colors"
            ><Facebook class="w-4 h-4"
          /></a>
          <a href="#" class="hover:text-[#e74c3c] transition-colors"><Twitter class="w-4 h-4" /></a>
          <a href="#" class="hover:text-[#e74c3c] transition-colors"
            ><Instagram class="w-4 h-4"
          /></a>
          <a href="#" class="hover:text-[#e74c3c] transition-colors"
            ><Linkedin class="w-4 h-4"
          /></a>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header
      class="bg-white dark:bg-[#13161c] border-b border-gray-200 dark:border-zinc-900 sticky top-0 z-50 shadow-md"
    >
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span class="text-3xl font-black tracking-tighter text-[#e74c3c]">
            TECHDEAL<span class="text-[#f1c40f]">.</span>
          </span>
          <span class="px-2 py-0.5 text-[10px] font-bold bg-[#e74c3c] text-white rounded"
            >GAMING</span
          >
        </NuxtLink>

        <!-- Navigation Links -->
        <nav
          class="hidden lg:flex items-center gap-6 font-semibold text-sm text-zinc-700 dark:text-zinc-300"
        >
          <NuxtLink to="/" class="hover:text-[#e74c3c] transition-colors">Trang chủ</NuxtLink>
          <NuxtLink to="/game" class="text-[#e74c3c]">Thế giới Game</NuxtLink>
          <a href="#" class="hover:text-[#e74c3c] transition-colors">Esports</a>
          <a href="#" class="hover:text-[#e74c3c] transition-colors">Đánh giá game</a>
          <a href="#" class="hover:text-[#e74c3c] transition-colors">Cốt truyện</a>
          <a href="#" class="hover:text-[#e74c3c] transition-colors">Phần cứng PC</a>
        </nav>

        <!-- Search button -->
        <div class="flex items-center gap-3">
          <button class="text-zinc-500 dark:text-zinc-400 hover:text-red-500">
            <Search class="w-5 h-5" />
          </button>
          <!-- Auth buttons -->
          <div
            class="hidden sm:flex items-center gap-3 border-l border-gray-200 dark:border-zinc-800 pl-3"
          >
            <NuxtLink
              to="/login"
              class="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#e74c3c] transition-colors"
              >Đăng nhập</NuxtLink
            >
            <NuxtLink
              to="/register"
              class="text-xs font-bold bg-[#e74c3c] hover:bg-[#c0392b] text-white px-3.5 py-1.5 rounded-full transition-colors"
              >Đăng ký</NuxtLink
            >
          </div>
          <button class="lg:hidden text-zinc-700 dark:text-white">
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN AREA -->
    <main>
      <!-- GAMING BANNER COMPONENT -->
      <GamingBanner :banner-posts="bannerPosts" />

      <!-- GAMING CATEGORIES COMPONENT -->
      <GamingCategories :categories="categories" />

      <!-- MIDDLE AD BANNER -->
      <AdBanner width="970px" height="90px" />

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
                      <a href="#">{{ mPost.title }}</a>
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
                    <img
                      :src="pPost.imageUrl"
                      :alt="pPost.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-grow flex flex-col justify-between">
                    <div>
                      <span class="text-[9px] font-bold text-[#e74c3c] uppercase block mb-1">
                        {{ pPost.category }}
                      </span>
                      <h5
                        class="text-xs font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-tight group-hover:text-[#e74c3c] transition-colors"
                      >
                        <a href="#">{{ pPost.title }}</a>
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

    <!-- Footer (Dark themed for both modes) -->
    <footer class="bg-zinc-950 text-zinc-550 text-xs py-10 border-t border-zinc-900 mt-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <NuxtLink to="/">
              <h4 class="text-white text-lg font-black tracking-tight mb-4 hover:text-[#e74c3c] transition-colors">TECHDEAL GAMING.</h4>
            </NuxtLink>
            <p class="leading-relaxed">
              Kênh thông tin game và phần cứng chơi game chuyên nghiệp hàng đầu Việt Nam.
            </p>
          </div>
          <div>
            <h4 class="text-white font-bold uppercase mb-4">Danh mục phổ biến</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white transition-colors">Esports</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Đánh giá game</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Phần cứng PC</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold uppercase mb-4">Hỗ trợ</h4>
            <p class="mb-2 text-zinc-400">Email: gaming@techdeal.com</p>
            <p class="text-zinc-400">Điện thoại: +84 (0) 987 654 321</p>
          </div>
        </div>
        <div class="border-t border-zinc-900 mt-8 pt-6 text-center text-[10px] text-zinc-700">
          © 2026 TECHDEAL Gaming Hub. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>
