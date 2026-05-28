<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'
import {
  User,
  Calendar,
  Eye,
  MessageSquare,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Link,
  Check,
  Send,
  Sparkles
} from 'lucide-vue-next'
import type { BlogPost } from '../types/post.type'
import Header from '../components/Header.vue'

const route = useRoute()
// URL format: /blog/{slug}.{id}  e.g. cuoc-cach-mang-thuc-te-ao-tiep-theo.f1
const rawParam = computed(() => route.params.slug as string)

// Extract id: everything after the last dot
const postId = computed(() => {
  const parts = rawParam.value.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : parts[0]
})

// Extract text slug: everything before the last dot
const slug = computed(() => {
  const parts = rawParam.value.split('.')
  return parts.length > 1 ? parts.slice(0, -1).join('.') : rawParam.value
})

// Combined list of mock posts from index.vue and gaming.vue to search from
const mockPosts: BlogPost[] = [
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
      'TP. Hồ Chí Minh, ngày 29/01/2026 - realme, thương hiệu smartphone tăng trưởng nhanh hàng đầu thế giới, chính thức ra mắt bộ đôi realme 16 Pro và realme 16 5G tại thị trường Việt Nam, mở ra kỷ nguyên mới của nhiếp ảnh di động với camera đa tiêu cự 200MP, thiết kế thanh lịch đột phá với gương selfie, cùng nhiều tính năng AI thông minh, với viên pin Titan 7000mAh nhưng vẫn giữ được độ mỏng nhẹ đầy ấn tượng.',
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
    comments: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    summary:
      'Nếu chỉ có ngân sách dưới 1 triệu đồng nhưng vẫn muốn có 1 chiếc tai nghe chống ồn "xịn", pin khủng và nhiều tính năng từ 1 thương hiệu đáng tin cậy thì soundcore R60i NC là 1 lựa chọn rất đáng cân nhắc. Đặc biệt, nếu so với mẫu R50i NC, chiếc tai nghe này có sự nâng cấp rất mạnh mẽ.',
    slug: 'tai-nghe-soundcore-r60i-nc-chong-on-duoi-1-trieu'
  },
  {
    id: '3',
    title: 'Tim Cook hé lộ tính năng Apple Intelligence được yêu thích nhất, bạn có sử dụng?',
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
      'Nếu bạn đang tìm kiếm một giải pháp để thư giãn tâm trí, ngủ ngon hơn, giảm căng thẳng và lấy lại sự cân bằng trong cuộc sống, thì Calm chính là ứng dụng không thể bỏ qua. Calm hiện đang là ứng dụng số 1 thế giới về thiền, giấc ngủ và sức khỏe tinh thần, được hàng triệu người tin dùng mỗi ngày để tìm lại sự bình yên bên trong mình.',
    slug: 'nhan-key-premium-ung-dung-thu-gian-ngu-ngon'
  },
  {
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
  },
  {
    id: 'gs1',
    title:
      'VCS Mùa Hè 2026 chính thức khởi tranh: Cuộc chiến khốc liệt giành vé đi Chung Kết Thế Giới',
    category: 'Esports',
    author: 'LeagueFan',
    publishDate: '28 Tháng 5, 2026',
    views: 5800,
    comments: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
    summary:
      'Mùa giải mới quy tụ các đội tuyển Liên Minh hàng đầu Việt Nam tranh tài cho tấm vé đi chung kết thế giới.',
    slug: 'vcs-mua-he-2026-khoi-tranh'
  },
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
    summary:
      'Sự kiện Marvel crossover mới nhất đã tạo nên cơn sốt lịch sử, kéo hàng triệu người chơi đăng nhập cùng một lúc.',
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
    summary:
      'Rockstar Games vừa làm rúng động cộng đồng game thủ thế giới khi tung ra đoạn trailer thứ 2 cho bom tấn Grand Theft Auto VI (GTA 6).',
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
    summary:
      'Tin đồn mới nhất cho thấy thiết bị chơi game thế hệ tiếp theo của Nintendo sẽ chính thức ra mắt cấu hình chi tiết cuối năm nay.',
    slug: 'nintendo-switch-2-sap-cong-bo'
  }
]

// Find current post by id (from URL slug.id param)
const post = computed<BlogPost>(() => {
  // First try to find by id
  const foundById = mockPosts.find((p) => p.id === postId.value)
  if (foundById) return foundById

  // Fallback: try by slug text
  const foundBySlug = mockPosts.find((p) => p.slug === slug.value)
  if (foundBySlug) return foundBySlug

  // Last resort fallback
  return {
    id: 'fallback',
    title: slug.value
      ? slug.value
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : 'Tin tức công nghệ mới cập nhật',
    category: 'Technology',
    author: 'TechDeal Editor',
    publishDate: 'Vừa xong',
    views: 99,
    comments: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Thông tin chi tiết về sản phẩm công nghệ đang thu hút sự chú ý của giới công nghệ trong và ngoài nước.',
    slug: slug.value || 'tin-tuc-cong-nghe-moi'
  }
})

// Generate post content body based on slug
const postContent = computed(() => {
  const p = post.value
  return {
    intro: p.summary,
    paragraphs: [
      `Đây là bước chuyển dịch quan trọng trong xu hướng phát triển công nghệ hiện đại. Những sản phẩm như thế này không chỉ định hình lại cách chúng ta tương tác với thế giới số, mà còn mang đến trải nghiệm toàn diện và tiện lợi hơn cho người dùng.`,
      `Theo đánh giá của các chuyên gia đầu ngành, việc áp dụng công nghệ mới đã đem lại những cải tiến rõ rệt về hiệu suất làm việc cũng như tính năng tiết kiệm năng lượng. Ngoài ra, thiết kế tối giản sang trọng kết hợp màu sắc trẻ trung sẽ giúp sản phẩm tiếp cận nhanh chóng phân khúc người dùng trẻ tuổi, năng động.`,
      `Bên cạnh các nâng cấp vượt trội về phần cứng, khả năng tối ưu hóa phần mềm tích hợp trí tuệ nhân tạo (AI) chính là điểm cộng lớn. Từ việc dự đoán hành vi người dùng, tối ưu hóa thời gian sử dụng pin cho đến nâng cao khả năng bảo mật dữ liệu cá nhân, tất cả đều được xử lý một cách thông minh và tự động.`
    ],
    quote: `Sự sáng tạo không nằm ở việc tạo ra thứ gì đó hoàn toàn mới, mà là cải tiến những thứ bình thường để mang lại giá trị phi thường cho người sử dụng hàng ngày.`,
    conclusion: `Nhìn chung, với mức giá hợp lý đi kèm vô vàn tính năng hiện đại, đây chắc chắn sẽ là một sản phẩm rất đáng để đầu tư và sở hữu trong thời gian tới. Hãy cùng TechDeal theo dõi những chuyển động tiếp theo để xem liệu sản phẩm này có tạo nên một cơn sốt mua sắm mới hay không.`
  }
})

// Related articles (exclude current by id, take 3)
const relatedPosts = computed(() => {
  return mockPosts.filter((p) => p.id !== post.value.id).slice(0, 3)
})

// Popular posts for sidebar
const popularSidebarPosts = computed(() => {
  return [...mockPosts].sort((a, b) => b.views - a.views).slice(0, 5)
})

// Comments State
interface Comment {
  id: number
  author: string
  avatar: string
  date: string
  content: string
  likes: number
}

const comments = ref<Comment[]>([
  {
    id: 1,
    author: 'Hoàng Long',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
    date: '3 giờ trước',
    content:
      'Bài viết phân tích rất chi tiết và khách quan. Mình cũng đang tính gom lúa để lên đời sản phẩm này, hy vọng sẽ đúng như kỳ vọng.',
    likes: 8
  },
  {
    id: 2,
    author: 'Minh Thư',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    date: '1 giờ trước',
    content:
      'Thiết kế đẹp thực sự, nhìn rất cao cấp. Mong là bản thương mại chính thức tại Việt Nam sẽ giữ nguyên được cấu hình và các ưu đãi quà tặng.',
    likes: 3
  }
])

const newCommentAuthor = ref('')
const newCommentContent = ref('')
const isCommentSubmitting = ref(false)

const handleAddComment = () => {
  if (!newCommentAuthor.value.trim() || !newCommentContent.value.trim()) {
    alert('Vui lòng nhập tên và nội dung bình luận!')
    return
  }

  isCommentSubmitting.value = true

  setTimeout(() => {
    comments.value.unshift({
      id: Date.now(),
      author: newCommentAuthor.value,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80',
      date: 'Vừa xong',
      content: newCommentContent.value,
      likes: 0
    })

    newCommentContent.value = ''
    isCommentSubmitting.value = false
  }, 600)
}

// Like Comment
const handleLikeComment = (id: number) => {
  const comment = comments.value.find((c) => c.id === id)
  if (comment) {
    comment.likes++
  }
}

// Share status
const isCopied = ref(false)
const copyUrl = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}

// SEO setting on mount/route change
useSeoMeta({
  title: () => `${post.value.title} - TechDeal`,
  description: () => post.value.summary,
  ogTitle: () => `${post.value.title} - TechDeal`,
  ogDescription: () => post.value.summary,
  ogImage: () => post.value.imageUrl
})

const handleSubscribe = () => {
  alert('Cảm ơn bạn đã đăng ký!')
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <!-- Main Navigation Header -->
    <Header />

    <!-- Breadcrumbs -->
    <div
      class="bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-850 py-3 text-xs"
    >
      <div class="container mx-auto px-4 flex items-center gap-2 text-zinc-500">
        <NuxtLink to="/" class="hover:text-[#3498db] transition-colors">Trang chủ</NuxtLink>
        <span>/</span>
        <span class="text-zinc-400 capitalize">{{ post.category }}</span>
        <span>/</span>
        <span
          class="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md"
        >
          {{ post.title }}
        </span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: Post detail (8 cols) -->
        <article class="lg:col-span-8 space-y-6">
          <!-- Back button -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-550 dark:text-zinc-400 hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors group mb-2"
          >
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại trang chủ
          </NuxtLink>

          <!-- Category and Meta -->
          <div class="space-y-4">
            <span
              class="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#3498db]/10 text-[#3498db] dark:bg-[#e74c3c]/10 dark:text-[#e74c3c]"
            >
              {{ post.category }}
            </span>
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
            >
              {{ post.title }}
            </h1>

            <!-- Meta statistics -->
            <div
              class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500 border-b border-gray-200 dark:border-zinc-850 pb-4"
            >
              <span class="flex items-center gap-1.5">
                <User class="w-4 h-4" />
                Đăng bởi
                <strong class="text-zinc-700 dark:text-zinc-300 font-semibold">{{
                  post.author
                }}</strong>
              </span>
              <span class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4" />
                {{ post.publishDate }}
              </span>
              <span class="flex items-center gap-1.5">
                <Eye class="w-4 h-4 text-zinc-450" />
                {{ post.views }} lượt xem
              </span>
              <span class="flex items-center gap-1.5">
                <MessageSquare class="w-4 h-4 text-zinc-450" />
                {{ comments.length }} bình luận
              </span>
            </div>
          </div>

          <!-- Feature Image -->
          <div
            class="relative rounded-2xl overflow-hidden aspect-video shadow-md border border-gray-100 dark:border-zinc-900"
          >
            <img :src="post.imageUrl" :alt="post.title" class="w-full h-full object-cover" />
          </div>

          <!-- Post Content Body -->
          <div
            class="prose prose-zinc dark:prose-invert max-w-none text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed space-y-6"
          >
            <p
              class="text-base font-semibold text-zinc-900 dark:text-white leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2"
            >
              {{ postContent.intro }}
            </p>

            <p>{{ postContent.paragraphs[0] }}</p>

            <!-- Pull Quote Block -->
            <blockquote
              class="border-l-4 border-[#3498db] dark:border-[#e74c3c] bg-gray-100 dark:bg-zinc-900 p-5 rounded-r-xl my-6 italic text-zinc-700 dark:text-zinc-300 font-medium"
            >
              "{{ postContent.quote }}"
            </blockquote>

            <p>{{ postContent.paragraphs[1] }}</p>
            <p>{{ postContent.paragraphs[2] }}</p>
            <p>{{ postContent.conclusion }}</p>
          </div>

          <!-- Sharing Actions -->
          <div
            class="flex flex-wrap items-center justify-between border-y border-gray-200 dark:border-zinc-850 py-4 gap-4"
          >
            <span
              class="text-xs font-bold flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <Share2 class="w-4 h-4" /> Chia sẻ bài viết này:
            </span>
            <div class="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title="Chia sẻ Facebook"
              >
                <Facebook class="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                class="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title="Chia sẻ Twitter"
              >
                <Twitter class="w-4 h-4" />
              </a>
              <button
                @click="copyUrl"
                class="px-3 py-2 border border-gray-200 dark:border-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check v-if="isCopied" class="w-4 h-4 text-green-500" />
                <Link v-else class="w-4 h-4" />
                {{ isCopied ? 'Đã sao chép!' : 'Sao chép liên kết' }}
              </button>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="space-y-6 pt-6">
            <h3
              class="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
            >
              <MessageSquare class="w-5 h-5 text-[#3498db] dark:text-[#e74c3c]" />
              Bình luận ({{ comments.length }})
            </h3>

            <!-- Comment Form -->
            <form
              @submit.prevent="handleAddComment"
              class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-250 dark:border-zinc-850 shadow-xs space-y-4"
            >
              <span
                class="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
              >
                <Sparkles class="w-4 h-4 text-[#f1c40f]" /> Gửi ý kiến của bạn
              </span>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  v-model="newCommentAuthor"
                  type="text"
                  placeholder="Tên của bạn..."
                  class="w-full text-xs px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c]"
                  required
                />
              </div>
              <textarea
                v-model="newCommentContent"
                placeholder="Nhập nội dung bình luận ở đây..."
                rows="4"
                class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] resize-none"
                required
              ></textarea>
              <button
                type="submit"
                :disabled="isCommentSubmitting"
                class="px-5 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{{ isCommentSubmitting ? 'Đang gửi...' : 'Gửi bình luận' }}</span>
                <Send class="w-4.5 h-4.5" />
              </button>
            </form>

            <!-- Comments List -->
            <div class="space-y-4">
              <div
                v-for="c in comments"
                :key="c.id"
                class="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-150 dark:border-zinc-900 transition-all duration-300"
              >
                <img
                  :src="c.avatar"
                  :alt="c.author"
                  class="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-zinc-850"
                />
                <div class="flex-grow space-y-1">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-zinc-900 dark:text-white">{{ c.author }}</h5>
                    <span class="text-[10px] text-zinc-400">{{ c.date }}</span>
                  </div>
                  <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {{ c.content }}
                  </p>

                  <div class="pt-2 flex items-center gap-3">
                    <button
                      @click="handleLikeComment(c.id)"
                      class="text-[10px] font-bold text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      👍 Thích ({{ c.likes }})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Right Column: Sidebar (4 cols) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Popular news widget -->
          <div
            class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs"
          >
            <h4
              class="text-sm font-black uppercase text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-850 pb-3 mb-4 tracking-tight flex items-center gap-2"
            >
              🔥 Xem nhiều nhất
            </h4>
            <div class="space-y-4">
              <div
                v-for="(p, index) in popularSidebarPosts"
                :key="p.id"
                class="flex gap-3 group border-b border-gray-100 dark:border-zinc-850/50 pb-3 last:border-b-0 last:pb-0"
              >
                <span
                  class="text-xl font-black text-zinc-300 dark:text-zinc-700 italic shrink-0 w-6 text-center"
                >
                  {{ index + 1 }}
                </span>
                <div class="space-y-1">
                  <span class="text-[9px] font-extrabold uppercase tracking-wider text-[#3498db]">
                    {{ p.category }}
                  </span>
                  <h5
                    class="text-xs font-bold leading-snug text-zinc-900 dark:text-white hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors line-clamp-2"
                  >
                    <NuxtLink :to="`/blog/${p.slug}.${p.id}`">{{ p.title }}</NuxtLink>
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <!-- Newsletter Banner -->
          <div
            class="bg-gradient-to-tr from-sky-600 to-indigo-900 dark:from-red-950 dark:to-zinc-900 p-6 rounded-2xl text-white space-y-4 shadow-md relative overflow-hidden"
          >
            <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
            <h4 class="text-base font-black uppercase tracking-tight relative z-10">
              Bản tin TechDeal
            </h4>
            <p class="text-xs text-zinc-200 leading-relaxed relative z-10">
              Đăng ký nhận thông tin công nghệ, game và khuyến mãi sớm nhất từ tòa soạn của chúng
              tôi.
            </p>
            <form @submit.prevent="handleSubscribe" class="space-y-2 relative z-10">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                class="w-full text-xs px-4 py-2.5 rounded-xl bg-white/10 placeholder-zinc-300 text-white focus:outline-none border border-white/20 focus:border-white"
                required
              />
              <button
                type="submit"
                class="w-full py-2.5 bg-white text-zinc-900 hover:bg-gray-100 transition-colors text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
        </aside>
      </div>

      <!-- Related Articles Section (Bottom) -->
      <div class="border-t border-gray-200 dark:border-zinc-850 mt-16 pt-12 space-y-6">
        <h3 class="text-xl font-black uppercase text-zinc-900 dark:text-white tracking-tight">
          📚 Bài viết liên quan
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="rp in relatedPosts"
            :key="rp.id"
            class="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group"
          >
            <div class="relative overflow-hidden aspect-[16/10] bg-zinc-950">
              <NuxtLink :to="`/blog/${rp.slug}.${rp.id}`" class="block w-full h-full">
                <img
                  :src="rp.imageUrl"
                  :alt="rp.title"
                  class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </NuxtLink>
            </div>
            <div class="p-5 flex-grow flex flex-col justify-between">
              <div>
                <span
                  class="text-[9px] font-extrabold uppercase tracking-wider text-[#3498db] mb-2 inline-block"
                >
                  {{ rp.category }}
                </span>
                <h4
                  class="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#3498db] dark:group-hover:text-[#e74c3c] transition-colors leading-snug line-clamp-2"
                >
                  <NuxtLink :to="`/blog/${rp.slug}.${rp.id}`">{{ rp.title }}</NuxtLink>
                </h4>
              </div>
              <div
                class="flex items-center justify-between text-[10px] text-zinc-500 pt-3 mt-4 border-t border-gray-100 dark:border-zinc-850/50"
              >
                <span>{{ rp.publishDate }}</span>
                <span class="text-red-500 dark:text-red-400 font-medium">👁️ {{ rp.views }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>
