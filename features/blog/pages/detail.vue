<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

import { useRoute, useAsyncData, navigateTo } from '#app'
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
  Sparkles,
  Pencil
} from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import AdBanner from '../components/AdBanner.vue'
import AdskeeperWidget from '../components/AdskeeperWidget.vue'
import CommentList from '../components/CommentList.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import { parseBBCode, injectMiddleAd } from '../utils/bbcode'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'
import { useAdBreakpoint } from '@shared/composables/use-ad-breakpoint'

const route = useRoute()
const userStore = useUserStore()
const { isMobileAd } = useAdBreakpoint()

const isAuthor = computed(() => {
  if (!userStore.isAuthenticated) return false
  return (
    userStore.role === 'admin' ||
    userStore.id === post.value.authorId ||
    userStore.username === post.value.author
  )
})

// Initialize authentication from cookies
if (process.client) {
  userStore.initializeAuth()
}

// URL format: /blog/{slug}.{id}  e.g. cuoc-cach-mang-thuc-te-ao-tiep-theo.f1
const rawParam = computed(() => (route.params.slug as string) || '')

// Extract text slug: everything before the last dot. If empty (e.g. /blog/.id), use the ID (part after the dot)
const slugText = computed<string>(() => {
  const parts = rawParam.value.split('.')
  if (parts.length > 1) {
    const slugPart = parts.slice(0, -1).join('.')
    return slugPart || parts[parts.length - 1] || ''
  }
  return rawParam.value
})

// Fetch post by slug using useAsyncData
const { data: postDetail } = await useAsyncData(`post-${slugText.value}`, async () => {
  const detail = await blogRepository.getPostBySlug(slugText.value)
  if (detail && detail.post) {
    let finalRelated: BlogPost[] = []

    // 1. Try finding related posts by similar tag if [similar] is in content
    if (detail.post.content) {
      const similarMatch = detail.post.content.match(/\[similar\]([\s\S]*?)\[\/similar\]/i)
      if (similarMatch && similarMatch[1]) {
        const tag = similarMatch[1].trim().normalize('NFC')
        try {
          const candidates = Array.from(
            new Set([
              tag,
              tag.toLowerCase(),
              tag.toUpperCase(),
              tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
            ])
          )
          let tagPosts: BlogPost[] = []
          for (const cand of candidates) {
            const tagPostsRes = await blogRepository.getPosts({
              tag: cand,
              limit: 6,
              enrich: false
            })
            tagPosts = tagPostsRes.items
            if (tagPosts && tagPosts.length > 0) {
              break
            }
          }
          finalRelated = tagPosts.filter((p) => p.id !== detail.post.id).slice(0, 5)
        } catch (err) {
          console.error('Error fetching similar tag posts:', err)
        }
      }
    }

    // 2. Fallback: If no related posts found by tag, get posts from the same category
    if (finalRelated.length === 0 && detail.post.category) {
      try {
        const categoryMap: Record<string, string> = {
          'thế giới game': 'gaming',
          android: 'android',
          ios: 'ios',
          'công nghệ': 'technology',
          windows: 'windows',
          pc: 'pc'
        }
        const categoryId = categoryMap[detail.post.category.toLowerCase()] || 'technology'
        const catPostsRes = await blogRepository.getPosts({
          category: categoryId,
          limit: 6,
          enrich: false
        })
        const catPosts = catPostsRes.items
        finalRelated = catPosts.filter((p) => p.id !== detail.post.id).slice(0, 5)
      } catch (err) {
        console.error('Error fetching fallback category posts:', err)
      }
    }

    detail.relatedPosts = finalRelated
  }
  return detail
})

if (
  !postDetail.value ||
  !postDetail.value.post ||
  postDetail.value.post.status === 'hidden' ||
  postDetail.value.post.isHidden
) {
  await navigateTo('https://techdeal.io.vn', { external: true, redirectCode: 301 })
}

// Bài thuộc chuyên mục "deals" là bản evergreen được phục vụ chính thức tại /deals/{platform}.
// 301 chuyển hướng URL /blog/{slug}.{id} của chúng về /deals/{platform} để gộp nội dung trùng lặp,
// dồn toàn bộ tín hiệu SEO về trang deals (tránh Google index bản /blog thay vì /deals).
if (postDetail.value?.post?.categoryId === 'deals') {
  const dealTags = (postDetail.value.tags || []).map((t) => t.toLowerCase())
  const platform = dealTags.includes('ios')
    ? 'ios'
    : dealTags.includes('android')
      ? 'android'
      : null
  if (platform) {
    // Dùng external:true (tải lại toàn trang) — giống redirect bài ẩn ở trên — để tránh
    // màn hình trắng do page transition "out-in" khi điều hướng nội bộ trong setup.
    await navigateTo(`https://techdeal.io.vn/deals/${platform}`, {
      external: true,
      redirectCode: 301
    })
  }
}

const tags = computed<string[]>(() => postDetail.value?.tags || [])

const post = computed<BlogPost>(() => {
  return (
    postDetail.value?.post || {
      id: '',
      title: 'Không tìm thấy bài viết',
      category: 'Technology',
      author: 'Admin',
      publishDate: '',
      views: 0,
      comments: 0,
      imageUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      summary: 'Bài viết không tồn tại hoặc đã bị hạ xuống.',
      slug: '',
      content: ''
    }
  )
})

const relatedPosts = computed<BlogPost[]>(() => {
  return postDetail.value?.relatedPosts || []
})

// Trigger tải lại Adskeeper widget khi bài viết đã sẵn sàng
watch(
  () => post.value.id,
  (newId) => {
    if (newId && process.client) {
      nextTick(() => {
        try {
          const w = window as any
          w._mgq = w._mgq || []
          w._mgq.push(['_mgc.load'])
        } catch (e) {
          console.warn('Adskeeper load trigger error:', e)
        }
      })
    }
  },
  { immediate: true }
)

// Parse BBCode helpers (imported from utils/bbcode)

const parsedContentHtml = computed(() => {
  if (post.value.content) {
    const rawHtml = parseBBCode(post.value.content)
    const adHtml =
      '<div class="adskeeper-widget-wrapper w-full my-6 flex justify-center overflow-hidden"><div data-type="_mgwidget" data-widget-id="2064113"></div></div>'
    return injectMiddleAd(rawHtml, adHtml)
  }
  return ''
})

// Popular posts for sidebar
const { data: popularSidebarPostsData } = await useAsyncData('popular-sidebar-posts', () =>
  blogRepository.getPopularPosts(5)
)
const popularSidebarPosts = computed(() => popularSidebarPostsData.value || [])

// Số lượng bình luận gốc - do CommentList tự tải và báo lên qua sự kiện @count
const commentCount = ref(0)

// Share status
const isCopied = ref(false)

const fallbackCopyText = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Fallback copy failed:', err)
  }
  document.body.removeChild(textArea)
}

const copyUrl = () => {
  if (process.client) {
    const url = `${window.location.origin}/blog/.${post.value.id}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          isCopied.value = true
          setTimeout(() => {
            isCopied.value = false
          }, 2000)
        })
        .catch(() => {
          fallbackCopyText(url)
        })
    } else {
      fallbackCopyText(url)
    }
  }
}

const siteUrl = 'https://techdeal.io.vn'
const requestUrl = computed(() => `${siteUrl}${route.path}`)

// Real social share intents (not links to our own social pages)
const facebookShareUrl = computed(
  () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(requestUrl.value)}`
)
const twitterShareUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(requestUrl.value)}&text=${encodeURIComponent(post.value.title)}`
)

const truncatedSummary = computed(() => {
  const sum = post.value.summary || ''
  if (sum.length > 155) {
    return sum.substring(0, 152) + '...'
  }
  return sum
})

useSeoMeta({
  title: () => post.value.title,
  description: () => truncatedSummary.value,
  ogTitle: () => post.value.title,
  ogDescription: () => truncatedSummary.value,
  ogImage: () => post.value.imageUrl,
  ogUrl: () => requestUrl.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value.title,
  twitterDescription: () => truncatedSummary.value,
  twitterImage: () => post.value.imageUrl
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: requestUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.value.title,
        description: truncatedSummary.value,
        image: [post.value.imageUrl],
        datePublished: post.value.createdAt || post.value.scheduledAt,
        dateModified: post.value.updatedAt || post.value.createdAt || post.value.scheduledAt,
        author: {
          '@type': 'Person',
          name: post.value.author || 'Nguyễn Văn Cương'
        },
        publisher: {
          '@type': 'Organization',
          name: 'TechDeal'
        },
        url: requestUrl.value,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': requestUrl.value
        }
      })
    }
  ]
}))

// onMounted(() => {
//   // Load Google SwG Basic SDK dynamically
//   if (process.client && !document.getElementById('google-swg-script')) {
//     const script = document.createElement('script')
//     script.id = 'google-swg-script'
//     script.async = true
//     script.type = 'application/javascript'
//     script.src = 'https://news.google.com/swg/js/v1/swg-basic.js'
//     script.onload = () => {
//       const selfWindow = window as any
//       selfWindow.SWG_BASIC = selfWindow.SWG_BASIC || []
//       selfWindow.SWG_BASIC.push((basicSubscriptions: any) => {
//         basicSubscriptions.init({
//           type: 'NewsArticle',
//           isPartOfType: ['Product'],
//           isPartOfProductId: 'CAow6OXGDA:openaccess',
//           clientOptions: { theme: 'light', lang: 'vi' }
//         })
//       })
//     }
//     document.head.appendChild(script)
//   }
// })
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
            class="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-555 dark:text-zinc-400 hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors group mb-2"
          >
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại trang chủ
          </NuxtLink>

          <!-- MGID Header Ad Widget -->
          <ClientOnly>
            <div class="my-4">
              <div data-type="_mgwidget" data-widget-id="2064115"></div>
            </div>
          </ClientOnly>

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
                <NuxtLink
                  :to="`/user/${post.authorId}`"
                  class="hover:text-[#3498db] dark:hover:text-[#e74c3c] hover:underline transition-colors"
                >
                  <strong class="text-zinc-700 dark:text-zinc-300 font-semibold">{{
                    post.author
                  }}</strong>
                </NuxtLink>
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
                {{ commentCount }} bình luận
              </span>
            </div>
          </div>

          <!-- Post Content Body -->
          <ClientOnly>
            <div
              class="prose prose-zinc dark:prose-invert max-w-none text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed space-y-6 pt-2"
              v-html="parsedContentHtml"
            ></div>
            <template #fallback>
              <div
                class="prose prose-zinc dark:prose-invert max-w-none text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed space-y-6 pt-2"
                v-html="parseBBCode(post?.content)"
              ></div>
            </template>
          </ClientOnly>

          <!-- Post Tags -->
          <div v-if="tags.length > 0" class="flex flex-wrap gap-1.5 pt-4">
            <NuxtLink
              v-for="tag in tags"
              :key="tag"
              :to="`/search?tag=${encodeURIComponent(tag)}`"
              class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#3498db]/5 text-[#3498db] dark:bg-[#e74c3c]/5 dark:text-[#e74c3c] border border-[#3498db]/10 dark:border-[#e74c3c]/10 hover:bg-[#3498db] hover:text-white dark:hover:bg-[#e74c3c] dark:hover:text-white transition-all cursor-pointer"
            >
              #{{ tag }}
            </NuxtLink>
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
                :href="facebookShareUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title="Chia sẻ Facebook"
              >
                <Facebook class="w-4 h-4" />
              </a>
              <a
                :href="twitterShareUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                title="Chia sẻ X"
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
                v-if="isAuthor"
                :to="`/blog/publish?edit=${post.id}`"
                class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil class="w-4 h-4" />
                Chỉnh sửa bài viết
              </NuxtLink>
            </div>
          </div>
          <AdBanner width="970px" height="90px" :is-google-ad="true" />

          <!-- Comments Section -->
          <CommentList v-if="post.id" :post-id="post.id" @count="commentCount = $event" />

          <!-- MGID Smart Ad Widget Dưới Bài Viết -->
          <ClientOnly>
            <div class="my-6">
              <div data-type="_mgwidget" data-widget-id="2064112"></div>
            </div>
          </ClientOnly>
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
          <!-- Author Bio Card -->
          <div
            v-if="post.author"
            class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs overflow-hidden relative"
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

          <div
            class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 shadow-xs bg-linear-to-tr from-sky-50/50 to-indigo-50/30 dark:from-zinc-900 dark:to-zinc-950"
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

      <!-- Related Articles Section (Bottom) -->
      <div class="border-t border-gray-200 dark:border-zinc-850 mt-16 pt-12 space-y-6">
        <h3 class="text-xl font-black uppercase text-zinc-900 dark:text-white tracking-tight">
          📚 Bài viết liên quan
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <div class="p-4 flex-grow flex flex-col justify-between">
              <div>
                <span
                  class="text-[9px] font-extrabold uppercase tracking-wider text-[#3498db] mb-2 inline-block"
                >
                  {{ rp.category }}
                </span>
                <h4
                  class="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-[#3498db] dark:group-hover:text-[#e74c3c] transition-colors leading-snug line-clamp-2"
                >
                  <NuxtLink :to="`/blog/${rp.slug}.${rp.id}`">{{ rp.title }}</NuxtLink>
                </h4>
              </div>
              <div
                class="flex items-center justify-between text-[9px] text-zinc-500 pt-2.5 mt-3 border-t border-gray-100 dark:border-zinc-850/50"
              >
                <span>{{ rp.publishDate }}</span>
                <span class="text-red-500 dark:text-red-400 font-medium">👁️ {{ rp.views }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdBanner width="970px" height="90px" :is-google-ad="true" />
    </div>

    <!-- MGID Swipe-up Widget (Mobile Only) -->
    <ClientOnly>
      <div v-if="isMobileAd">
        <div data-type="_mgwidget" data-widget-id="2064563"></div>
        <component :is="'script'">
          (function(w,q){w[q]=w[q]||[];w[q].push(["_mgc.load"])})(window,"_mgq");
        </component>
      </div>
    </ClientOnly>

    <!-- Footer -->
    <Footer />
  </div>
</template>
