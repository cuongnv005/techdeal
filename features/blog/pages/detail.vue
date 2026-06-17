<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useRoute, useAsyncData } from '#app'
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
  Sparkles,
  Pencil
} from 'lucide-vue-next'

import { blogRepository, type ApiComment } from '../api/blog'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AdBanner from '../components/AdBanner.vue'

import type { BlogPost } from '../types/post.type'

import { useUserStore } from '@stores/user'

const route = useRoute()
const userStore = useUserStore()

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
const { data: postDetail, error } = await useAsyncData(`post-${slugText.value}`, async () => {
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
          windows: 'windows'
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

// Local comments state
const comments = ref<ApiComment[]>([])

// Populate local comments from comments API when post ID is available
watch(
  () => post.value.id,
  async (newId) => {
    if (newId) {
      comments.value = await blogRepository.getComments(newId)
    }
  },
  { immediate: true }
)

// Parse BBCode helpers
const parseBBCode = (bbcode: string) => {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML tags to prevent XSS during preview
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Parse [prebreak]...[/prebreak] to render as normal text without the box
  html = html.replace(/\[prebreak\]([\s\S]*?)\[\/prebreak\]/gi, '$1')

  // Remove [similar] tags completely from raw html output inside main layout content body
  // because it will be processed and rendered at the bottom in the "Related Posts" section
  html = html.replace(/\[similar\]([\s\S]*?)\[\/similar\]/gi, '')

  // Basic tags
  html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
  html = html.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
  html = html.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
  html = html.replace(/\[strike\]([\s\S]*?)\[\/strike\]/gi, '<s>$1</s>')
  html = html.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<s>$1</s>')

  // Lists [LIST] and [*]
  html = html.replace(
    /\[list(?:=([^\]]+))?\]([\s\S]*?)\[\/list\]/gi,
    (match: string, type: string | undefined, listContent: string) => {
      const items = listContent.split(/\[\*\]/)
      const listItems = items
        .slice(1)
        .map(
          (item: string) =>
            `<li style="list-style: inherit;" data-xf-list-type="${type ? 'ol' : 'ul'}">${item.trim()}</li>`
        )
        .join('')
      const tag = type ? 'ol' : 'ul'
      const attrib = type ? ` type="${type}"` : ''
      const listStyle = type ? 'decimal' : 'disc'
      return `<${tag}${attrib} style="list-style-type: ${listStyle}; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${listItems}</${tag}>`
    }
  )

  // Support [ul] and [ol] lists with [li]
  html = html.replace(/\[ul\]([\s\S]*?)\[\/ul\]/gi, (match: string, content: string) => {
    let ulContent = content.replace(
      /\[li\]([\s\S]*?)\[\/li\]/gi,
      (liMatch: string, liContent: string) => {
        return `<li style="list-style: inherit;">${liContent.trim()}</li>`
      }
    )
    ulContent = ulContent.replace(/\s*\n\s*/g, '')
    return `<ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${ulContent}</ul>`
  })

  html = html.replace(/\[ol\]([\s\S]*?)\[\/ol\]/gi, (match: string, content: string) => {
    let olContent = content.replace(
      /\[li\]([\s\S]*?)\[\/li\]/gi,
      (liMatch: string, liContent: string) => {
        return `<li style="list-style: inherit;">${liContent.trim()}</li>`
      }
    )
    olContent = olContent.replace(/\s*\n\s*/g, '')
    return `<ol style="list-style-type: decimal; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${olContent}</ol>`
  })

  html = html.replace(/\[li\]([\s\S]*?)\[\/li\]/gi, '<li style="list-style: inherit;">$1</li>')

  // Font family, color and size with nested tag support
  let oldHtml
  do {
    oldHtml = html
    html = html.replace(
      /\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi,
      '<span style="color: $1">$2</span>'
    )
  } while (html !== oldHtml)

  do {
    oldHtml = html
    html = html.replace(/\[font=([^\]]+)\]([\s\S]*?)\[\/font\]/gi, (match, fontFace, content) => {
      const safeFont = fontFace.replace(/"/g, "'")
      return `<span style="font-family: ${safeFont}">${content}</span>`
    })
  } while (html !== oldHtml)

  do {
    oldHtml = html
    html = html.replace(/\[size=([^\]]+)\]([\s\S]*?)\[\/size\]/gi, (match, size, content) => {
      const sizeMap: Record<string, string> = {
        '1': '10px',
        '2': '12px',
        '3': '14px',
        '4': '16px',
        '5': '18px',
        '6': '24px',
        '7': '32px'
      }
      const fontSize =
        sizeMap[size.trim()] || (isNaN(Number(size)) ? size.trim() : `${size.trim()}px`)
      return `<span style="font-size: ${fontSize}">${content}</span>`
    })
  } while (html !== oldHtml)

  // Align
  html = html.replace(/\[left\]([\s\S]*?)\[\/left\]/gi, '<div class="text-left">$1</div>')
  html = html.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div class="text-center">$1</div>')
  html = html.replace(/\[right\]([\s\S]*?)\[\/right\]/gi, '<div class="text-right">$1</div>')

  // Custom links and images (stripping optional surrounding quotes in url)
  html = html.replace(
    /\[url=['"]?([^\]'"]+?)['"]?\]([\s\S]*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" class="text-[#e5127d] hover:text-[#3498db] underline md:no-underline hover:underline font-bold">$2</a>'
  )
  html = html.replace(
    /\[url\]([\s\S]*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" class="text-[#e5127d] hover:text-[#3498db] underline md:no-underline hover:underline font-bold">$1</a>'
  )
  // Gallery of multiple images horizontally aligned
  html = html.replace(/\[gallery\]([\s\S]*?)\[\/gallery\]/gi, (match, content) => {
    const imagesHtml = content.replace(
      /\[img\]([\s\S]*?)\[\/img\]/gi,
      '<img src="$1" class="h-[9.5rem] md:h-90 object-cover rounded-xl shadow-xs border border-gray-100 dark:border-zinc-850" />'
    )
    return `<div class="flex flex-wrap gap-2 justify-center my-4">${imagesHtml}</div>`
  })

  html = html.replace(
    /\[img\]([\s\S]*?)\[\/img\]/gi,
    '<div class="my-4 flex justify-center"><img src="$1" class="max-w-full h-auto rounded-xl shadow-md border border-gray-100 dark:border-zinc-800" /></div>'
  )

  // YouTube tag parser
  html = html.replace(/\[youtube\]([\s\S]*?)\[\/youtube\]/gi, (match, videoIdOrUrl) => {
    const trimmed = videoIdOrUrl.trim()
    let videoId = trimmed
    const urlMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/i
    )
    if (urlMatch && urlMatch[1]) {
      videoId = urlMatch[1]
    }
    return `<div class="my-4 flex justify-center"><div class="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-zinc-800"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>`
  })

  // Blockquote / code block
  html = html.replace(
    /\[quote\]([\s\S]*?)\[\/quote\]/gi,
    '<blockquote class="border-l-4 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 p-4 my-4 italic rounded-r text-zinc-650 dark:text-zinc-450">$1</blockquote>'
  )
  html = html.replace(
    /\[code\]([\s\S]*?)\[\/code\]/gi,
    '<pre class="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto font-mono text-xs my-4 border border-gray-200 dark:border-zinc-800">$1</pre>'
  )

  // Convert newlines to br
  html = html.replace(/\n/g, '<br>')

  return html
}

const parsedContentHtml = computed(() => {
  if (post.value.content) {
    return parseBBCode(post.value.content)
  }
  return ''
})

// Mapped comments for UI list
const mappedComments = computed(() => {
  return comments.value.map((c) => ({
    id: c.id,
    author: c.author_name || 'Thành viên',
    avatar:
      c.author_avatar ||
      c.avatar_url ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
    date: new Date(c.created_at).toLocaleString('vi-VN'),
    content: c.content
  }))
})

// Popular posts for sidebar
const { data: popularSidebarPostsData } = await useAsyncData('popular-sidebar-posts', () =>
  blogRepository.getPopularPosts(5)
)
const popularSidebarPosts = computed(() => popularSidebarPostsData.value || [])

// Comments State
const newCommentContent = ref('')
const isCommentSubmitting = ref(false)

const handleAddComment = async () => {
  if (!userStore.isAuthenticated) {
    alert('Vui lòng đăng nhập trước khi bình luận!')
    return
  }

  if (!newCommentContent.value.trim()) {
    alert('Vui lòng nhập nội dung bình luận!')
    return
  }

  isCommentSubmitting.value = true

  try {
    const newComment = await blogRepository.submitComment(post.value.id, newCommentContent.value)
    if (newComment) {
      comments.value.unshift(newComment)
      newCommentContent.value = ''
    } else {
      alert('Không thể gửi bình luận. Vui lòng kiểm tra lại trạng thái đăng nhập.')
    }
  } catch (e) {
    console.error(e)
    alert('Có lỗi xảy ra khi gửi bình luận!')
  } finally {
    isCommentSubmitting.value = false
  }
}

// Local Likes Tracker
const commentLikes = ref<Record<string | number, number>>({})
const handleLikeComment = (id: string | number) => {
  commentLikes.value[id] = (commentLikes.value[id] || 0) + 1
}

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

import { onMounted } from 'vue'

const requestUrl = useRequestURL().href

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
  ogUrl: requestUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value.title,
  twitterDescription: () => truncatedSummary.value,
  twitterImage: () => post.value.imageUrl
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: requestUrl
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
        datePublished: post.value.scheduledAt || new Date().toISOString(),
        dateModified: post.value.scheduledAt || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: post.value.author || 'Cuong'
        },
        publisher: {
          '@type': 'Organization',
          name: 'TechDeal'
        },
        url: requestUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': requestUrl
        }
      })
    }
  ]
})

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
            class="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-555 dark:text-zinc-400 hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors group mb-2"
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
                <NuxtLink
                  :to="`/user/${post.author}`"
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
                {{ comments.length }} bình luận
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
          <div class="space-y-6 pt-6">
            <h3
              class="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
            >
              <MessageSquare class="w-5 h-5 text-[#3498db] dark:text-[#e74c3c]" />
              Bình luận ({{ mappedComments.length }})
            </h3>

            <!-- Comment Form (Shown only if authenticated) -->
            <form
              v-if="userStore.isAuthenticated"
              @submit.prevent="handleAddComment"
              class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-250 dark:border-zinc-850 shadow-xs space-y-4"
            >
              <span
                class="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
              >
                <Sparkles class="w-4 h-4 text-[#f1c40f]" />
                Gửi ý kiến của bạn (Bình luận dưới tên:
                <strong class="text-[#3498db]">{{ userStore.username }}</strong
                >)
              </span>
              <textarea
                v-model="newCommentContent"
                placeholder="Nhập nội dung bình luận ở đây..."
                rows="4"
                class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] resize-none"
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

            <!-- Login Prompt (Shown if not authenticated) -->
            <div
              v-else
              class="bg-blue-50 dark:bg-zinc-900/60 p-6 rounded-2xl border border-dashed border-blue-200 dark:border-zinc-800 text-center space-y-3"
            >
              <p class="text-xs text-zinc-600 dark:text-zinc-400">
                Bạn cần đăng nhập để gửi ý kiến phản hồi về bài viết này.
              </p>
              <NuxtLink
                to="/login"
                class="inline-block px-5 py-2.5 bg-[#3498db] hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Đăng nhập ngay
              </NuxtLink>
            </div>

            <!-- Comments List -->
            <div class="space-y-4">
              <div
                v-for="c in mappedComments"
                :key="c.id"
                class="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-150 dark:border-zinc-900 transition-all duration-300"
              >
                <NuxtLink :to="`/user/${c.author}`" class="shrink-0 block">
                  <img
                    :src="c.avatar"
                    :alt="c.author"
                    class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-zinc-850 hover:opacity-80 transition-opacity"
                  />
                </NuxtLink>
                <div class="flex-grow space-y-1">
                  <div class="flex items-center justify-between">
                    <NuxtLink
                      :to="`/user/${c.author}`"
                      class="hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors"
                    >
                      <h5 class="text-xs font-bold text-zinc-900 dark:text-white">
                        {{ c.author }}
                      </h5>
                    </NuxtLink>
                    <span class="text-[10px] text-zinc-400">{{ c.date }}</span>
                  </div>
                  <p class="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                    {{ c.content }}
                  </p>

                  <div class="pt-2 flex items-center gap-3">
                    <button
                      @click="handleLikeComment(c.id)"
                      class="text-[10px] font-bold text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      👍 Thích ({{ commentLikes[c.id] || 0 }})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Right Column: Sidebar (4 cols) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Sidebar Ad Banner -->
          <AdBanner
            width="300px"
            height="250px"
            :is-google-ad="true"
            slot-id="sidebar-ad"
            ad-format="rectangle"
          />

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
                :to="`/user/${post.author}`"
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
                :to="`/user/${post.author}`"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-[#3498db] dark:text-[#e74c3c] hover:underline transition-colors mt-1"
              >
                Xem hồ sơ →
              </NuxtLink>
            </div>
          </div>

          <!-- Google Subscribe with Google Widget -->

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

    <!-- Footer -->
    <Footer />
  </div>
</template>
