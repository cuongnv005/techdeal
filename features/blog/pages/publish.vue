<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

import { useRoute } from '#app'
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Calendar,
  Plus,
  X,
  FileText,
  Clock,
  Sparkles,
  Info
} from 'lucide-vue-next'

import { blogRepository } from '../api/blog'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'

// Load SCEditor CDN dependencies
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/sceditor@3/minified/themes/default.min.css'
    }
  ]
})

const route = useRoute()
const categoryId = ref((route.query.category as string) || 'technology')

// Map category key to Display Name
const categoryName = computed(() => {
  const map: Record<string, string> = {
    gaming: 'Thế giới Game',
    android: 'Android',
    ios: 'iOS',
    technology: 'Công nghệ',
    windows: 'Windows'
  }
  return map[categoryId.value] || 'Công nghệ'
})

// Map category key to Route URL
const categoryUrl = computed(() => {
  const map: Record<string, string> = {
    gaming: '/game',
    android: '/android',
    ios: '/ios',
    technology: '/cong-nghe',
    windows: '/windows'
  }
  return map[categoryId.value] || '/'
})

const editId = computed(() => route.query.edit as string | undefined)
const isEditMode = computed(() => !!editId.value)

const fetchPostToEdit = async () => {
  if (!editId.value) return
  try {
    const detail = await blogRepository.getPostBySlug(editId.value)
    if (detail && detail.post) {
      title.value = detail.post.title
      selectedTags.value = detail.tags || []
      if (detail.post.category) {
        const categoryMap: Record<string, string> = {
          'thế giới game': 'gaming',
          'android': 'android',
          'ios': 'ios',
          'công nghệ': 'technology',
          'windows': 'windows'
        }
        categoryId.value = categoryMap[detail.post.category.toLowerCase()] || 'technology'
      }
      isScheduled.value = !!detail.post.scheduledAt
      if (detail.post.scheduledAt) {
        const dt = new Date(detail.post.scheduledAt)
        const offset = dt.getTimezoneOffset() * 60000
        const local = new Date(dt.getTime() - offset)
        scheduleDate.value = local.toISOString().slice(0, 16)
      }
      
      const content = detail.post.content || ''
      const textarea = document.getElementById('sceditor-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.value = content
      }
      if (editorInstance && typeof editorInstance.val === 'function') {
        editorInstance.val(content)
      }
    }
  } catch (err) {
    console.error('Error fetching post for editing:', err)
  }
}

// Form fields state
const title = ref('')
const selectedTags = ref<string[]>([])
const newTagInput = ref('')
const isScheduled = ref(false)
const scheduleDate = ref('')

// Auto-save state
const autoSaveStatus = ref('')
const isPreviewing = ref(false)
const previewHtml = ref('')

// Predefined tags database
const systemTags = [
  'Gaming',
  'Esports',
  'Hardware',
  'Intel',
  'AMD',
  'Nvidia',
  'Nintendo',
  'PlayStation',
  'iOS',
  'iPhone',
  'Apple',
  'Android',
  'Google',
  'Windows',
  'Microsoft',
  'AI',
  'Review',
  'Calm'
]

// Editor instance reference
let editorInstance: any = null

const initEditor = () => {
  const textarea = document.getElementById('sceditor-textarea')
  if (!textarea) return

  try {
    // @ts-ignore
    window.sceditor.create(textarea, {
      format: 'bbcode',
      style: 'https://cdn.jsdelivr.net/npm/sceditor@3/minified/themes/content/default.min.css',
      emoticonsRoot: 'https://cdn.jsdelivr.net/npm/sceditor@3/minified/',
      width: '100%',
      height: '380px',
      toolbar:
        'bold,italic,underline,strike|left,center,right,justify|font,size,color,removeformat|cut,copy,paste,pastetext|bulletlist,orderedlist|table|code,quote|image,link|emoticon|youtube|date,time|maximize,source'
    })

    // @ts-ignore
    editorInstance = window.sceditor.instance(textarea)

    if (editorInstance) {
      // Auto-update preview Html on key and blur
      const syncPreview = () => {
        if (editorInstance && isPreviewing.value) {
          previewHtml.value = parseBBCode(editorInstance.val())
        }
      }
      editorInstance.bind('keyup blur', syncPreview)
    } else {
      console.warn('Failed to retrieve SCEditor instance via window.sceditor.instance')
    }
  } catch (e) {
    console.error('SCEditor init error:', e)
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve()
      return
    }
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

// Check and wait for SCEditor scripts load
let scriptCheckTimer: any = null
onMounted(async () => {
  if (isEditMode.value) {
    fetchPostToEdit()
  }
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/sceditor@3/minified/sceditor.min.js')
    await loadScript('https://cdn.jsdelivr.net/npm/sceditor@3/minified/formats/bbcode.js')

    // Check if sceditor is fully initialized
    // @ts-ignore
    if (window.sceditor && window.sceditor.formats && window.sceditor.formats.bbcode) {
      initEditor()
    } else {
      scriptCheckTimer = setInterval(() => {
        // @ts-ignore
        if (window.sceditor && window.sceditor.formats && window.sceditor.formats.bbcode) {
          clearInterval(scriptCheckTimer)
          initEditor()
        }
      }, 100)
    }
  } catch (err) {
    console.error('Failed to load SCEditor scripts dynamically:', err)
  }

  // Start auto-save timer (every 1 minute)
  autoSaveTimer = setInterval(triggerAutoSave, 60000)
})

// Auto-save logic
let autoSaveTimer: any = null
const triggerAutoSave = async () => {
  if (!editorInstance) return
  const content = editorInstance.val()
  if (!title.value.trim() && !content.trim()) return

  autoSaveStatus.value = 'Đang tự động lưu...'
  try {
    // Simulated API call (e.g. HttpService.post('/api/posts/autosave', ...))
    await new Promise((resolve) => setTimeout(resolve, 800))
    const now = new Date()
    const timeStr = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    autoSaveStatus.value = `Đã tự động lưu nháp lúc ${timeStr}`
  } catch (e) {
    autoSaveStatus.value = 'Lỗi tự động lưu nháp!'
  }
}

onUnmounted(() => {
  if (scriptCheckTimer) clearInterval(scriptCheckTimer)
  if (autoSaveTimer) clearInterval(autoSaveTimer)
})

// Tags management
const handleAddTags = () => {
  if (!newTagInput.value.trim()) return

  // Split tags by comma to support adding multiple tags at once
  const tags = newTagInput.value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  tags.forEach((tag) => {
    // Avoid duplicates (case-insensitive)
    const exists = selectedTags.value.some((t) => t.toLowerCase() === tag.toLowerCase())
    if (!exists) {
      selectedTags.value.push(tag)
    }
  })

  newTagInput.value = ''
}

const toggleSystemTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index >= 0) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const removeTag = (index: number) => {
  selectedTags.value.splice(index, 1)
}

// Custom Tag Parser (Regex based)
const parseBBCode = (bbcode: string) => {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML tags to prevent XSS during preview
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Parse [prebreak]...[/prebreak] to highlight summary / lead card paragraph
  html = html.replace(
    /\[prebreak\]([\s\S]*?)\[\/prebreak\]/gi,
    '<div class="bg-blue-500/5 dark:bg-blue-500/10 border-l-4 border-[#3498db] dark:border-[#e74c3c] p-4 my-4 rounded-r-xl font-semibold text-zinc-900 dark:text-zinc-100 flex gap-3"><span class="text-xl">💡</span><div><p class="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-1">Đoạn tóm tắt (Prebreak)</p><p>$1</p></div></div>'
  )

  // Parse [similar]...[/similar]
  html = html.replace(
    /\[similar\]([\s\S]*?)\[\/similar\]/gi,
    '<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20 my-2 select-none"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>Bài viết liên quan: $1</span>'
  )

  // Basic tags
  html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
  html = html.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
  html = html.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
  html = html.replace(/\[strike\]([\s\S]*?)\[\/strike\]/gi, '<s>$1</s>')
  html = html.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<s>$1</s>')

  // Lists [LIST] and [*]
  html = html.replace(/\[list(?:=([^\]]+))?\]([\s\S]*?)\[\/list\]/gi, (match: string, type: string | undefined, listContent: string) => {
    const items = listContent.split(/\[\*\]/)
    const listItems = items
      .slice(1)
      .map((item: string) => `<li style="list-style: inherit;" data-xf-list-type="${type ? 'ol' : 'ul'}">${item.trim()}</li>`)
      .join('')
    const tag = type ? 'ol' : 'ul'
    const attrib = type ? ` type="${type}"` : ''
    const listStyle = type ? 'decimal' : 'disc'
    return `<${tag}${attrib} style="list-style-type: ${listStyle}; padding-left: 20px; margin-top: 8px; margin-bottom: 8px; display: block;">${listItems}</${tag}>`
  })

  // Font color and size
  html = html.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, '<span style="color: $1">$2</span>')
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
    const fontSize = sizeMap[size.trim()] || (isNaN(Number(size)) ? size.trim() : `${size.trim()}px`)
    return `<span style="font-size: ${fontSize}">${content}</span>`
  })

  // Align
  html = html.replace(/\[left\]([\s\S]*?)\[\/left\]/gi, '<div class="text-left">$1</div>')
  html = html.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div class="text-center">$1</div>')
  html = html.replace(/\[right\]([\s\S]*?)\[\/right\]/gi, '<div class="text-right">$1</div>')

  // Custom links and images (stripping optional surrounding quotes in url)
  html = html.replace(
    /\[url=['"]?([^\]'"]+?)['"]?\]([\s\S]*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" class="text-[#3498db] hover:underline font-bold">$2</a>'
  )
  html = html.replace(
    /\[url\]([\s\S]*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" class="text-[#3498db] hover:underline">$1</a>'
  )
  html = html.replace(
    /\[img\]([\s\S]*?)\[\/img\]/gi,
    '<div class="my-4 flex justify-center"><img src="$1" class="max-w-full h-auto rounded-xl shadow-md border border-gray-100 dark:border-zinc-800" /></div>'
  )

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

const handlePreview = () => {
  try {
    let content = ''
    if (editorInstance) {
      if (typeof editorInstance.val === 'function') {
        content = editorInstance.val()
      } else {
        console.warn('editorInstance.val is not a function')
      }
    } else {
      const textarea = document.getElementById('sceditor-textarea') as HTMLTextAreaElement
      if (textarea) {
        content = textarea.value
      }
    }
    console.log('Preview raw content:', content)
    previewHtml.value = parseBBCode(content)
    console.log('Parsed HTML content:', previewHtml.value)
    isPreviewing.value = !isPreviewing.value
  } catch (err: any) {
    console.error('Preview error:', err)
    alert('Lỗi khi xem thử: ' + err.message)
  }
}

// Publish post action
const isSubmitting = ref(false)
const handlePublish = async () => {
  if (!title.value.trim()) {
    alert('Vui lòng điền tiêu đề bài viết!')
    return
  }

  if (!editorInstance) return
  const content = editorInstance.val()
  if (!content.trim()) {
    alert('Vui lòng nhập nội dung bài viết!')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare post data
    const postData = {
      title: title.value,
      content,
      category: categoryId.value,
      tags: selectedTags.value,
      scheduledAt:
        isScheduled.value && scheduleDate.value ? new Date(scheduleDate.value).toISOString() : null
    }

    let response
    if (isEditMode.value && editId.value) {
      response = await blogRepository.updatePost(editId.value, postData)
    } else {
      response = await blogRepository.createPost(postData)
    }

    if (response && response.success) {
      alert(
        isEditMode.value
          ? 'Chúc mừng! Bài viết đã được cập nhật thành công!'
          : `Chúc mừng! Bài viết đã được ${postData.scheduledAt ? 'hẹn giờ đăng thành công!' : 'đăng thành công!'}`
      )
      // Redirect to the post detail page if slug is available, otherwise to homepage
      if (response.data?.slug) {
        await navigateTo(`/blog/${response.data.slug}`)
      } else {
        await navigateTo('/')
      }
    } else {
      alert(response?.message || 'Có lỗi xảy ra khi xử lý bài viết!')
    }
  } catch (e) {
    alert('Có lỗi xảy ra khi xử lý bài viết!')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <!-- publish main workspace -->
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Back Link -->
      <NuxtLink
        :to="categoryUrl"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors group mb-6"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Quay lại chuyên mục {{ categoryName }}
      </NuxtLink>

      <!-- Page Header -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-5 mb-8"
      >
        <div>
          <h1
            class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2"
          >
            <span class="p-1.5 bg-[#3498db]/10 text-[#3498db] rounded-lg">📝</span>
            {{ isEditMode ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới' }}
          </h1>
          <p class="text-xs text-zinc-550 mt-1">
            {{ isEditMode ? 'Chỉnh sửa bài viết trong chuyên mục:' : 'Đăng bài trong chuyên mục:' }}
            <strong class="text-zinc-700 dark:text-zinc-300">{{ categoryName }}</strong>
          </p>
        </div>

        <!-- Auto save indicator -->
        <div
          v-if="autoSaveStatus"
          class="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {{ autoSaveStatus }}
        </div>
      </div>

      <!-- Main Form Card -->
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-850 p-6 md:p-8 shadow-xs space-y-6"
      >
        <!-- Post Title -->
        <div class="space-y-2">
          <label
            class="text-xs font-black uppercase tracking-wider text-zinc-650 dark:text-zinc-450 flex items-center gap-1"
          >
            Tiêu đề bài viết <span class="text-red-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="Nhập tiêu đề ấn tượng cho bài viết..."
            class="w-full text-sm px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] font-semibold"
            required
          />
        </div>

        <!-- BBCode Editor -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label
              class="text-xs font-black uppercase tracking-wider text-zinc-650 dark:text-zinc-450 flex items-center gap-1"
            >
              Nội dung chi tiết <span class="text-red-500">*</span>
            </label>

            <div
              class="flex items-center gap-4 text-[10px] text-zinc-450 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-800 select-none"
            >
              <span class="font-bold flex items-center gap-1"
                ><Info class="w-3 h-3 text-[#3498db]" /> Cú pháp đặc biệt:</span
              >
              <span><code>[prebreak]tóm tắt[/prebreak]</code></span>
              <span><code>[similar]tag[/similar]</code></span>
            </div>
          </div>

          <div class="rounded-xl overflow-hidden border border-gray-250 dark:border-zinc-800">
            <textarea
              id="sceditor-textarea"
              placeholder="Nhập nội dung bài viết bằng mã BBCode..."
              class="w-full h-80 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none"
            ></textarea>
          </div>
        </div>

        <!-- Publish & Preview Actions -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button
            @click="handlePublish"
            :disabled="isSubmitting"
            class="px-5 py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 select-none"
          >
            <Send class="w-4 h-4" />
            {{ isSubmitting ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật bài viết' : 'Đăng bài viết') }}
          </button>

          <button
            @click="handlePreview"
            class="px-5 py-3 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            <Eye class="w-4 h-4" />
            {{ isPreviewing ? 'Đóng xem thử' : 'Xem thử' }}
          </button>

          <button
            @click="triggerAutoSave"
            class="px-3.5 py-3 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-950 text-zinc-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer select-none"
            title="Lưu nháp thủ công"
          >
            <Save class="w-4 h-4" />
          </button>
        </div>

        <!-- Dynamic Preview Area -->
        <div
          v-if="isPreviewing"
          class="border border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-950/20 p-6 rounded-2xl animate-fadeIn space-y-4"
        >
          <div class="border-b border-gray-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
            <span
              class="text-xs font-extrabold uppercase tracking-widest text-[#3498db] dark:text-[#e74c3c]"
              >Xem trước bài viết</span
            >
            <span
              class="px-1.5 py-0.5 text-[9px] bg-gray-200 dark:bg-zinc-800 rounded font-bold text-gray-500 dark:text-gray-400 select-none"
              >PREVIEW</span
            >
          </div>

          <!-- Mock Post Template inside Preview -->
          <article class="space-y-4 max-w-none">
            <h2 class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
              {{ title || 'Chưa nhập tiêu đề bài viết' }}
            </h2>

            <!-- Rendered HTML Content -->
            <div
              class="prose prose-zinc dark:prose-invert text-sm leading-relaxed space-y-3 pt-2"
              v-html="
                previewHtml ||
                `<p class=&quot;text-zinc-400 italic&quot;>Nhập nội dung để bắt đầu xem thử...</p>`
              "
            ></div>
          </article>
        </div>

        <!-- Tags Selection & Input -->
        <div class="border-t border-gray-150 dark:border-zinc-850 pt-6 space-y-4">
          <label
            class="text-xs font-black uppercase tracking-wider text-zinc-650 dark:text-zinc-450 flex items-center gap-1.5"
          >
            <Sparkles class="w-4 h-4 text-amber-500" />
            Gán thẻ bài viết (Tags)
          </label>

          <!-- Custom Tags Adder -->
          <div class="flex gap-2">
            <input
              v-model="newTagInput"
              type="text"
              placeholder="Nhập thẻ mới (ngăn cách bằng dấu phẩy để thêm nhiều thẻ)..."
              @keydown.enter.prevent="handleAddTags"
              class="flex-grow text-xs px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
            <button
              @click.prevent="handleAddTags"
              class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus class="w-4 h-4" /> Thêm thẻ
            </button>
          </div>

          <!-- Active tags list -->
          <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="(tag, idx) in selectedTags"
              :key="idx"
              class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#3498db]/10 text-[#3498db] dark:bg-[#e74c3c]/10 dark:text-[#e74c3c] rounded-lg border border-[#3498db]/20 dark:border-[#e74c3c]/20"
            >
              {{ tag }}
              <button @click.prevent="removeTag(idx)" class="hover:text-red-500 cursor-pointer">
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          </div>

          <!-- Predefined tags -->
          <div class="space-y-2 pt-2">
            <p
              class="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider"
            >
              Chọn thẻ có sẵn trong hệ thống:
            </p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in systemTags"
                :key="tag"
                @click.prevent="toggleSystemTag(tag)"
                class="px-2.5 py-1 text-[11px] font-semibold border rounded-lg transition-all cursor-pointer"
                :class="
                  selectedTags.includes(tag)
                    ? 'bg-[#3498db] dark:bg-[#e74c3c] text-white border-transparent'
                    : 'bg-transparent border-gray-200 dark:border-zinc-800 hover:border-gray-300 text-zinc-650 dark:text-zinc-400'
                "
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Post Scheduler -->
        <div class="border-t border-gray-150 dark:border-zinc-850 pt-6 space-y-4">
          <div class="flex items-center justify-between">
            <label
              class="text-xs font-black uppercase tracking-wider text-zinc-650 dark:text-zinc-450 flex items-center gap-1.5 select-none"
            >
              <Clock class="w-4 h-4 text-[#3498db] dark:text-[#e74c3c]" />
              Hẹn giờ đăng bài viết
            </label>

            <input
              v-model="isScheduled"
              type="checkbox"
              id="schedule-toggle"
              class="w-4 h-4 text-[#3498db] rounded focus:ring-0 focus:outline-none cursor-pointer"
            />
          </div>

          <div v-if="isScheduled" class="space-y-2 animate-fadeIn">
            <input
              v-model="scheduleDate"
              type="datetime-local"
              class="w-full max-w-xs text-xs px-4 py-2.5 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3498db]"
            />
            <p class="text-[10px] text-zinc-450 italic">
              Hệ thống sẽ tự động xuất bản bài viết vào khung giờ bạn đã chọn bên trên.
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
