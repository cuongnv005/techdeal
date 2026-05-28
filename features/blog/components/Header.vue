<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Menu } from 'lucide-vue-next'

interface Props {
  theme?: 'blue' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'blue'
})

// Search query
const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value) {
    alert(`Tìm kiếm với từ khóa: ${searchQuery.value}`)
  }
}

// Compute theme-specific classes
const isBlue = computed(() => props.theme === 'blue')

const textPrimaryClass = computed(() => isBlue.value ? 'text-[#3498db]' : 'text-[#e74c3c]')
const textHoverClass = computed(() => isBlue.value ? 'hover:text-[#3498db]' : 'hover:text-[#e74c3c]')
const bgPrimaryClass = computed(() => isBlue.value ? 'bg-[#3498db]' : 'bg-[#e74c3c]')
const bgHoverClass = computed(() => isBlue.value ? 'hover:bg-sky-600' : 'hover:bg-[#c0392b]')
const focusRingClass = computed(() => isBlue.value ? 'focus:ring-[#3498db]' : 'focus:ring-[#e74c3c]')
const dotColorClass = computed(() => isBlue.value ? 'text-[#f39c12]' : 'text-[#f1c40f]')
const tagLabel = computed(() => isBlue.value ? 'TECH' : 'GAMING')
const headerBgClass = computed(() => isBlue.value ? 'bg-white dark:bg-zinc-900 border-gray-250 dark:border-zinc-800' : 'bg-white dark:bg-[#13161c] border-gray-200 dark:border-zinc-900')
const shadowClass = computed(() => isBlue.value ? 'shadow-sm' : 'shadow-md')
</script>

<template>
  <header
    class="border-b sticky top-0 z-50 transition-colors duration-300"
    :class="[headerBgClass, shadowClass]"
  >
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <span class="text-3xl font-black tracking-tighter" :class="textPrimaryClass">
          TECHDEAL<span :class="dotColorClass">.</span>
        </span>
        <span
          class="px-2 py-0.5 text-[10px] font-bold text-white rounded transition-colors duration-300"
          :class="[bgPrimaryClass, { 'hidden sm:inline-block': isBlue }]"
        >
          {{ tagLabel }}
        </span>
      </NuxtLink>

      <!-- Navigation Links -->
      <nav
        class="hidden lg:flex items-center gap-6 font-semibold text-sm text-zinc-700 dark:text-zinc-300"
      >
        <NuxtLink to="/" class="transition-colors duration-200" :class="textHoverClass" active-class="!text-[#3498db] dark:!text-red-400">Trang chủ</NuxtLink>
        <NuxtLink to="/game" class="transition-colors duration-200" :class="textHoverClass" active-class="!text-[#e74c3c]">Thế giới Game</NuxtLink>
        <NuxtLink to="/cong-nghe" class="transition-colors duration-200" :class="textHoverClass" active-class="!text-[#3498db]">Công nghệ</NuxtLink>
        <NuxtLink to="/windows" class="transition-colors duration-200" :class="textHoverClass" active-class="!text-[#3498db]">Windows</NuxtLink>
        <NuxtLink to="/ios" class="transition-colors duration-200" :class="textHoverClass" active-class="!text-[#3498db]">iOS</NuxtLink>
        <NuxtLink to="/android" class="transition-colors duration-200" :class="textHoverClass" active-class="!text-[#3498db]">Android</NuxtLink>
      </nav>

      <!-- Search & Auth -->
      <div class="flex items-center gap-3">
        <form @submit.prevent="handleSearch" class="relative hidden sm:block">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm tin tức..."
            class="bg-gray-150 dark:bg-zinc-800 text-xs px-3 py-1.5 pr-8 rounded-full focus:outline-none focus:ring-1 w-48 dark:text-white"
            :class="focusRingClass"
          />
          <button
            type="submit"
            class="absolute right-2 top-1.5 text-zinc-500"
            :class="textHoverClass"
          >
            <Search class="w-4 h-4" />
          </button>
        </form>

        <!-- Auth buttons -->
        <div
          class="hidden sm:flex items-center gap-3 border-l pl-3 border-gray-200 dark:border-zinc-800"
        >
          <NuxtLink
            to="/login"
            class="text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors"
            :class="textHoverClass"
            >Đăng nhập</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="text-xs font-bold text-white px-3.5 py-1.5 rounded-full transition-colors"
            :class="[bgPrimaryClass, bgHoverClass]"
            >Đăng ký</NuxtLink
          >
        </div>
        <button class="lg:hidden text-zinc-700 dark:text-white">
          <Menu class="w-6 h-6" />
        </button>
      </div>
    </div>
  </header>
</template>
