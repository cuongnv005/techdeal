<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useAsyncData, navigateTo, useRequestURL } from '#app'
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
  Pencil,
  Plus,
  Smartphone,
  Sparkles
} from 'lucide-vue-next'

import { blogRepository, type ApiComment } from '../api/blog'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AdBanner from '../components/AdBanner.vue'
import HomeSidebar from '../components/home/HomeSidebar.vue'

import type { BlogPost } from '../types/post.type'
import { parseBBCode } from '../utils/bbcode'
import { useUserStore } from '@stores/user'

interface Props {
  platform: 'ios' | 'android'
}

const props = defineProps<Props>()

const route = useRoute()
const userStore = useUserStore()

if (process.client) {
  userStore.initializeAuth()
}

const platformTitle = computed(() => (props.platform === 'ios' ? 'iOS' : 'Android'))

// Fetch Deal Post
const {
  data: dealData,
  pending,
  error
} = await useAsyncData(`deal-post-${props.platform}`, () =>
  blogRepository.getDealByPlatform(props.platform)
)

const post = computed<BlogPost | null>(() => dealData.value?.post || null)
const tags = computed<string[]>(() => dealData.value?.tags || [])

// SEO Metadata
const requestUrl = useRequestURL().href
useSeoMeta({
  title: computed(() =>
    post.value?.title
      ? `${post.value.title}`
      : `Tổng hợp Ưu đãi Game & App ${platformTitle.value} Miễn Phí`
  ),
  description: computed(
    () =>
      post.value?.summary ||
      `Tổng hợp game và ứng dụng ${platformTitle.value} bản quyền đang miễn phí mới nhất.`
  ),
  ogTitle: computed(() =>
    post.value?.title ? `${post.value.title}` : `Ưu đãi ${platformTitle.value} Miễn Phí`
  ),
  ogDescription: computed(
    () =>
      post.value?.summary ||
      `Tổng hợp game và ứng dụng ${platformTitle.value} bản quyền đang miễn phí, được cập nhật liên tục mỗi ngày.`
  ),
  ogUrl: requestUrl,
  ogType: 'article',
  articlePublishedTime: computed(() => post.value?.createdAt || new Date().toISOString()),
  articleModifiedTime: computed(
    () => post.value?.updatedAt || post.value?.createdAt || new Date().toISOString()
  ),
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
})

useHead({
  link: [{ rel: 'canonical', href: requestUrl }],
  meta: [{ name: 'revisit-after', content: '1 days' }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline:
            post.value?.title || `Tổng hợp Ưu đãi Game & App ${platformTitle.value} Miễn Phí`,
          description:
            post.value?.summary || `Danh sách game bản quyền miễn phí cho ${platformTitle.value}`,
          image: post.value?.thumbnail ? [post.value.thumbnail] : [],
          datePublished: post.value?.createdAt || new Date().toISOString(),
          dateModified: post.value?.updatedAt || post.value?.createdAt || new Date().toISOString(),
          author: {
            '@type': 'Person',
            name: post.value?.author || 'TechDeal Admin'
          },
          publisher: {
            '@type': 'Organization',
            name: 'TechDeal',
            url: 'https://techdeal.io.vn'
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': requestUrl
          }
        })
      )
    }
  ]
})

const isAdminOrMod = computed(() => {
  if (!userStore.isAuthenticated) return false
  return userStore.role === 'admin' || userStore.role === 'mod'
})

const isAuthorOrAdmin = computed(() => {
  if (!userStore.isAuthenticated) return false
  return (
    isAdminOrMod.value ||
    (post.value && userStore.id === post.value.authorId) ||
    (post.value && userStore.username === post.value.author)
  )
})

// Comments state
const comments = ref<ApiComment[]>([])
const newCommentContent = ref('')
const isCommentSubmitting = ref(false)

watch(
  () => dealData.value?.post?.id,
  async (newId) => {
    if (newId) {
      comments.value = await blogRepository.getComments(newId)
    } else if (dealData.value?.comments) {
      comments.value = dealData.value.comments
    }
  },
  { immediate: true }
)

const mappedComments = computed(() => {
  return comments.value.map((c) => ({
    id: c.id,
    authorId: c.author_id,
    author: c.author_name || 'Thành viên',
    avatar:
      c.author_avatar ||
      c.avatar_url ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
    date: new Date(c.created_at).toLocaleString('vi-VN'),
    content: c.content
  }))
})

const handleAddComment = async () => {
  if (!userStore.isAuthenticated) {
    alert('Vui lòng đăng nhập trước khi bình luận!')
    return
  }
  if (!newCommentContent.value.trim() || !post.value?.id) {
    alert('Vui lòng nhập nội dung bình luận!')
    return
  }

  isCommentSubmitting.value = true
  try {
    const newComment = await blogRepository.submitComment(
      post.value.id,
      newCommentContent.value.trim()
    )
    if (newComment) {
      comments.value.unshift(newComment)
      newCommentContent.value = ''
    } else {
      alert('Không thể gửi bình luận. Vui lòng thử lại sau!')
    }
  } catch (e) {
    console.error(e)
    alert('Có lỗi xảy ra khi gửi bình luận!')
  } finally {
    isCommentSubmitting.value = false
  }
}

// Sidebar popular posts
const { data: popularSidebarPostsData } = await useAsyncData(
  `popular-posts-${props.platform}`,
  () => blogRepository.getPopularPosts(5)
)
const popularSidebarPosts = computed(() => popularSidebarPostsData.value || [])

// Sharing
const isCopied = ref(false)
const copyUrl = () => {
  if (process.client && post.value?.id) {
    const url = `${window.location.origin}/blog/.${post.value.id}`
    navigator.clipboard.writeText(url).then(() => {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    })
  }
}

// BBCode Parsing matching detail.vue (imported from utils/bbcode)

const parsedContentHtml = computed(() => {
  if (post.value?.content) {
    return parseBBCode(post.value.content)
  }
  return ''
})
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
        <span class="text-zinc-400 capitalize">{{ post?.category || 'Deals Game & Apps' }}</span>
        <span>/</span>
        <span
          class="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md"
        >
          {{ post?.title || `Ưu đãi ${platformTitle}` }}
        </span>
      </div>
    </div>

    <!-- Main Content Grid matching detail layout -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: Post detail (8 cols) -->
        <article class="lg:col-span-8 space-y-6">
          <!-- Back button -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-555 dark:text-zinc-400 hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors group mb-2"
          >
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại trang chủ
          </NuxtLink>

          <!-- Loading State -->
          <div
            v-if="pending"
            class="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs border border-gray-200 dark:border-zinc-850"
          >
            <div
              class="w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="text-xs font-bold text-zinc-400 mt-4 animate-pulse">Đang tải bài viết...</p>
          </div>

          <!-- Empty or Error State (No Post Yet) -->
          <div
            v-else-if="!post && !pending"
            class="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center shadow-xs border border-gray-200 dark:border-zinc-850 py-16 space-y-4"
          >
            <Smartphone class="w-12 h-12 mx-auto text-zinc-400" />
            <div>
              <h3 class="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                Chưa có bài viết deals cho {{ platformTitle }}
              </h3>
              <p class="text-xs text-zinc-500 mt-2">
                Bài viết đang được chuẩn bị và cập nhật. Vui lòng quay lại sau!
              </p>
            </div>
            <!-- Admin / Mod action to create post if not existing -->
            <div v-if="isAdminOrMod" class="pt-2">
              <NuxtLink
                :to="`/blog/publish?category=deals&tag=${platform}`"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3498db] hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus class="w-4 h-4" /> Tạo bài viết Ưu đãi {{ platformTitle }} mới
              </NuxtLink>
            </div>
          </div>

          <!-- Post Content -->
          <template v-else-if="post">
            <!-- Category and Meta -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span
                  class="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#3498db]/10 text-[#3498db] dark:bg-[#e74c3c]/10 dark:text-[#e74c3c]"
                >
                  {{ post.category }}
                </span>
              </div>

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
                  <NuxtLink
                    v-if="post.authorId"
                    :to="`/user/${post.authorId}`"
                    class="hover:text-[#3498db] dark:hover:text-[#e74c3c] hover:underline transition-colors"
                  >
                    <strong class="text-zinc-700 dark:text-zinc-300 font-semibold">{{
                      post.author
                    }}</strong>
                  </NuxtLink>
                  <strong v-else class="text-zinc-700 dark:text-zinc-300 font-semibold">{{
                    post.author
                  }}</strong>
                </span>
                <span class="flex items-center gap-1.5" v-if="post.publishDate">
                  <Calendar class="w-4 h-4" />
                  {{ post.publishDate }}
                </span>
                <span class="flex items-center gap-1.5">
                  <Eye class="w-4 h-4 text-zinc-450" />
                  {{ post.views }} lượt xem
                </span>
                <span class="flex items-center gap-1.5">
                  <MessageSquare class="w-4 h-4 text-zinc-450" />
                  {{ mappedComments.length }} bình luận
                </span>
              </div>
            </div>

            <!-- Post Content Body -->
            <div
              class="prose prose-zinc dark:prose-invert max-w-none text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed space-y-6 pt-2"
              v-html="parsedContentHtml"
            ></div>

            <!-- Post Tags -->
            <div v-if="tags.length > 0" class="flex flex-wrap gap-1.5 pt-4">
              <span
                v-for="tag in tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#3498db]/5 text-[#3498db] dark:bg-[#e74c3c]/5 dark:text-[#e74c3c] border border-[#3498db]/10 dark:border-[#e74c3c]/10"
              >
                #{{ tag }}
              </span>
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
                  href="https://www.facebook.com/ThuVienGame1"
                  target="_blank"
                  class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Chia sẻ Facebook"
                >
                  <Facebook class="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/ThuVienGame1"
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
                <NuxtLink
                  v-if="isAuthorOrAdmin"
                  :to="`/blog/publish?edit=${post.id}`"
                  class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Pencil class="w-4 h-4" />
                  Chỉnh sửa bài viết
                </NuxtLink>
              </div>
            </div>
            <AdBanner width="970px" height="90px" :is-google-ad="true" />
            <!-- Comments Section -->
            <div class="space-y-6 pt-6">
              <h3
                class="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
              >
                <MessageSquare class="w-5 h-5 text-[#3498db] dark:text-[#e74c3c]" />
                Bình luận ({{ mappedComments.length }})
              </h3>

              <!-- Comment Form -->
              <form
                v-if="userStore.isAuthenticated"
                @submit.prevent="handleAddComment"
                class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-250 dark:border-zinc-850 shadow-xs space-y-4"
              >
                <textarea
                  v-model="newCommentContent"
                  rows="3"
                  placeholder="Viết bình luận của bạn..."
                  class="w-full p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#3498db]"
                ></textarea>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="isCommentSubmitting"
                    class="px-4 py-2 bg-[#3498db] hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send class="w-3.5 h-3.5" /> Gửi bình luận
                  </button>
                </div>
              </form>
              <div
                v-else
                class="p-4 bg-gray-100 dark:bg-zinc-900 rounded-xl text-center text-xs text-zinc-500"
              >
                Vui lòng
                <NuxtLink to="/login" class="text-[#3498db] font-bold hover:underline"
                  >Đăng nhập</NuxtLink
                >
                để tham gia bình luận.
              </div>

              <!-- Comments List -->
              <div class="space-y-4">
                <div
                  v-for="c in mappedComments"
                  :key="c.id"
                  class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 shadow-xs flex gap-3.5"
                >
                  <img
                    :src="c.avatar"
                    :alt="c.author"
                    class="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs text-zinc-900 dark:text-zinc-100">{{
                        c.author
                      }}</span>
                      <span class="text-[10px] text-zinc-400">{{ c.date }}</span>
                    </div>
                    <p class="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed">
                      {{ c.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </article>

        <!-- Right Column: Sidebar (4 cols) -->
        <aside class="lg:col-span-4 flex flex-col space-y-8">
          <!-- Sidebar Ad Banner (Mobile: order-4 dưới cùng, Desktop: order-1 trên cùng) -->
          <div class="order-4 lg:order-1 flex justify-center">
            <AdBanner
              width="300px"
              height="250px"
              :is-google-ad="true"
              slot-id="sidebar-ad"
              ad-format="rectangle"
            />
          </div>

          <!-- Popular news widget -->
          <div
            class="order-1 lg:order-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs"
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

          <!-- Author Bio Card -->
          <div
            v-if="post && post.author"
            class="order-2 lg:order-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs overflow-hidden relative"
          >
            <!-- Decorative gradient blob -->
            <div
              class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#3498db]/10 dark:bg-[#e74c3c]/10 blur-2xl pointer-events-none"
            />
            <h4
              class="text-sm font-black uppercase text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-850 pb-3 mb-4 tracking-tight flex items-center gap-2"
            >
              Về tác giả
            </h4>
            <div class="flex flex-col items-center text-center gap-3">
              <!-- Avatar -->
              <div class="relative">
                <img
                  :src="
                    post.authorAvatar ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(post.author) +
                      '&background=3498db&color=fff&size=80'
                  "
                  :alt="post.author"
                  class="w-16 h-16 rounded-full object-cover border-2 border-[#3498db]/30 dark:border-[#e74c3c]/30 shadow-md ring-2 ring-white dark:ring-zinc-900 transition-transform duration-300 hover:scale-105"
                />
                <span
                  class="absolute -bottom-1 -right-1 w-5 h-5 bg-[#3498db] dark:bg-[#e74c3c] rounded-full flex items-center justify-center text-[9px] text-white font-black shadow"
                >
                  ✓
                </span>
              </div>
              <!-- Name -->
              <NuxtLink
                :to="`/user/${post.authorId}`"
                class="text-sm font-extrabold text-zinc-900 dark:text-white hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors leading-tight"
              >
                {{ post.author }}
              </NuxtLink>
              <!-- Bio -->
              <p
                v-if="post.authorBio"
                class="text-[11px] text-zinc-550 dark:text-zinc-400 leading-relaxed line-clamp-4"
              >
                {{ post.authorBio }}
              </p>
              <!-- View profile link -->
              <NuxtLink
                :to="`/user/${post.authorId}`"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-[#3498db] dark:text-[#e74c3c] hover:underline transition-colors mt-1"
              >
                Xem hồ sơ →
              </NuxtLink>
            </div>
          </div>

          <!-- Google Subscribe with Google Widget -->
          <div
            class="order-3 lg:order-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs bg-linear-to-tr from-sky-50/50 to-indigo-50/30 dark:from-zinc-900 dark:to-zinc-950"
          >
            <h4
              class="text-sm font-black uppercase text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-850 pb-3 mb-4 tracking-tight flex items-center gap-2"
            >
              <Sparkles class="w-4 h-4 text-red-500" /> Bản tin TechDeal
            </h4>
            <div class="space-y-3">
              <p class="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                Đăng ký để nhận thông báo về những tin tức công nghệ mới và độc quyền trực tiếp qua
                Google News.
              </p>
              <div
                class="swg-basic-subscription-button-placeholder w-full mt-2"
                data-play-button="true"
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>
