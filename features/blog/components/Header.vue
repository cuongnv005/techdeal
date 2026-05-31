<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from '#imports'

import { Search, Menu, X, Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

import { useUserStore } from '@stores/user'

const userStore = useUserStore()

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})
const toggleDark = useToggle(isDark)

const handleLogout = () => {
  userStore.logout()
  navigateTo('/')
}

const handleMobileLogout = () => {
  handleLogout()
  isSidebarOpen.value = false
}

interface Props {
  theme?: 'blue' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'blue'
})

// Search query
const searchQuery = ref('')
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    isSidebarOpen.value = false
  }
}

// Mobile sidebar open state
const isSidebarOpen = ref(false)

// Close mobile sidebar on route transition
const route = useRoute()
watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false
  }
)

// Compute theme-specific classes
const isBlue = computed(() => props.theme === 'blue')

const textPrimaryClass = computed(() => (isBlue.value ? 'text-[#3498db]' : 'text-[#e74c3c]'))
const textHoverClass = computed(() =>
  isBlue.value ? 'hover:text-[#3498db]' : 'hover:text-[#e74c3c]'
)
const bgPrimaryClass = computed(() => (isBlue.value ? 'bg-[#3498db]' : 'bg-[#e74c3c]'))
const bgHoverClass = computed(() => (isBlue.value ? 'hover:bg-sky-600' : 'hover:bg-[#c0392b]'))
const focusRingClass = computed(() =>
  isBlue.value ? 'focus:ring-[#3498db]' : 'focus:ring-[#e74c3c]'
)
const dotColorClass = computed(() => (isBlue.value ? 'text-[#f39c12]' : 'text-[#f1c40f]'))
const tagLabel = computed(() => (isBlue.value ? 'TECH' : 'GAMING'))
const headerBgClass = computed(() =>
  isBlue.value
    ? 'bg-white dark:bg-zinc-900 border-gray-250 dark:border-zinc-800'
    : 'bg-white dark:bg-[#13161c] border-gray-200 dark:border-zinc-900'
)
const shadowClass = computed(() => (isBlue.value ? 'shadow-sm' : 'shadow-md'))
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
        <NuxtLink
          to="/"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db] dark:!text-red-400"
          >Trang chủ</NuxtLink
        >
        <NuxtLink
          to="/cong-nghe"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >Công nghệ</NuxtLink
        >
        <NuxtLink
          to="/windows"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >Windows</NuxtLink
        >
        <NuxtLink
          to="/ios"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >iOS</NuxtLink
        >
        <NuxtLink
          to="/android"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >Android</NuxtLink
        >
        <NuxtLink
          to="/pc"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >PC máy tính</NuxtLink
        >
        <NuxtLink
          to="/game"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#e74c3c]"
          >Thế giới Game</NuxtLink
        >
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

        <!-- Theme Toggle (Desktop) -->
        <ClientOnly>
          <button
            @click="toggleDark()"
            class="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-400 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            <Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
            <Moon v-else class="w-4 h-4 text-zinc-600" />
          </button>
        </ClientOnly>

        <!-- Auth buttons -->
        <ClientOnly>
          <div
            class="hidden sm:flex items-center gap-3 border-l pl-3 border-gray-200 dark:border-zinc-800"
          >
            <template v-if="userStore.isAuthenticated">
              <span class="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                Chào,
                <strong class="text-zinc-850 dark:text-zinc-200">{{ userStore.username }}</strong>
              </span>
              <NuxtLink
                v-if="userStore.role === 'admin' || userStore.role === 'mod'"
                to="/admin/dashboard"
                class="text-xs font-bold px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                Dashboard
              </NuxtLink>
              <button
                @click="handleLogout"
                class="text-xs font-bold text-zinc-550 hover:text-red-500 transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </template>
            <template v-else>
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
            </template>
          </div>
        </ClientOnly>
        <button
          @click="isSidebarOpen = true"
          class="lg:hidden text-zinc-700 dark:text-white focus:outline-none"
          aria-label="Open menu"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Sidebar Drawer -->
    <Teleport to="body">
      <div v-if="isSidebarOpen" class="fixed inset-0 z-[100] lg:hidden">
        <!-- Backdrop overlay with transition -->
        <div
          @click="isSidebarOpen = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        ></div>

        <!-- Sidebar content panel -->
        <div
          class="fixed inset-y-0 right-0 w-80 max-w-[85vw] h-full flex flex-col transition-transform duration-300 ease-out transform shadow-2xl"
          :class="[
            isBlue
              ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100'
              : 'bg-white dark:bg-[#13161c] text-zinc-850 dark:text-zinc-100'
          ]"
        >
          <!-- Sidebar Header -->
          <div
            class="p-4 border-b flex items-center justify-between"
            :class="
              isBlue
                ? 'border-gray-100 dark:border-zinc-850'
                : 'border-gray-150 dark:border-zinc-800'
            "
          >
            <span class="text-2xl font-black tracking-tighter" :class="textPrimaryClass">
              TECHDEAL<span :class="dotColorClass">.</span>
            </span>
            <div class="flex items-center gap-1">
              <!-- Theme Toggle (Mobile Sidebar) -->
              <ClientOnly>
                <button
                  @click="toggleDark()"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Toggle Theme"
                >
                  <Sun v-if="isDark" class="w-5 h-5 text-amber-500" />
                  <Moon v-else class="w-5 h-5 text-zinc-650" />
                </button>
              </ClientOnly>

              <button
                @click="isSidebarOpen = false"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Sidebar Body / Navigation Links -->
          <div class="flex-1 overflow-y-auto p-5 flex flex-col justify-between">
            <div class="space-y-6">
              <!-- Mobile Search -->
              <form @submit.prevent="handleSearch" class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm kiếm tin tức..."
                  class="w-full bg-gray-100 dark:bg-zinc-800 text-sm px-4 py-2.5 pr-10 rounded-xl focus:outline-none focus:ring-1 dark:text-white"
                  :class="focusRingClass"
                />
                <button
                  type="submit"
                  class="absolute right-3 top-3 text-zinc-550"
                  :class="textHoverClass"
                >
                  <Search class="w-4 h-4" />
                </button>
              </form>

              <!-- Nav Links -->
              <nav class="flex flex-col gap-4 font-semibold text-base">
                <NuxtLink
                  to="/"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] dark:!text-red-400 font-bold"
                  @click="isSidebarOpen = false"
                >
                  Trang chủ
                </NuxtLink>
                <NuxtLink
                  to="/cong-nghe"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  Công nghệ
                </NuxtLink>
                <NuxtLink
                  to="/windows"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  Windows
                </NuxtLink>
                <NuxtLink
                  to="/ios"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  iOS
                </NuxtLink>
                <NuxtLink
                  to="/android"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  Android
                </NuxtLink>
                <NuxtLink
                  to="/pc"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  PC máy tính
                </NuxtLink>
                <NuxtLink
                  to="/game"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#e74c3c] font-bold"
                  @click="isSidebarOpen = false"
                >
                  Thế giới Game
                </NuxtLink>
              </nav>
            </div>

            <!-- Mobile Auth / Bottom section -->
            <ClientOnly>
              <div
                class="mt-8 pt-6 border-t"
                :class="
                  isBlue
                    ? 'border-gray-100 dark:border-zinc-850'
                    : 'border-gray-150 dark:border-zinc-800'
                "
              >
                <template v-if="userStore.isAuthenticated">
                  <div class="flex flex-col gap-4">
                    <div class="text-sm">
                      Chào,
                      <strong class="text-zinc-850 dark:text-zinc-200">{{
                        userStore.username
                      }}</strong>
                    </div>
                    <NuxtLink
                      v-if="userStore.role === 'admin' || userStore.role === 'mod'"
                      to="/admin/dashboard"
                      class="text-sm font-bold text-center px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                      @click="isSidebarOpen = false"
                    >
                      Dashboard
                    </NuxtLink>
                    <button
                      @click="handleMobileLogout"
                      class="text-sm font-bold text-center px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-550/10 transition-colors cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col gap-3">
                    <NuxtLink
                      to="/login"
                      class="text-sm font-bold text-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
                      @click="isSidebarOpen = false"
                    >
                      Đăng nhập
                    </NuxtLink>
                    <NuxtLink
                      to="/register"
                      class="text-sm font-bold text-center text-white py-2.5 rounded-xl transition-colors"
                      :class="[bgPrimaryClass, bgHoverClass]"
                      @click="isSidebarOpen = false"
                    >
                      Đăng ký
                    </NuxtLink>
                  </div>
                </template>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
