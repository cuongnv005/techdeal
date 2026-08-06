<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

import { useDark, useToggle } from '@vueuse/core'
import { Search, Menu, X, Sun, Moon, ChevronDown } from 'lucide-vue-next'

import { useRoute } from '#imports'
import { useUserStore } from '@stores/user'

const userStore = useUserStore()

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const localeAlternateLink = useLocaleAlternateLink()

const switchLanguage = (lang: 'vi' | 'en') => {
  if (localeAlternateLink.value) {
    // Use hard navigation when on an article page so that the full locale context
    // (i18n state, useAsyncData cache, SSR) resets correctly for the target language.
    if (process.client) {
      window.location.href = localeAlternateLink.value
    }
  } else {
    navigateTo(switchLocalePath(lang))
  }
}

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

// Overflow dropdown for nav items hidden at smaller desktop widths
const isMoreOpen = ref(false)
const moreDropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (e: MouseEvent) => {
  if (moreDropdownRef.value && !moreDropdownRef.value.contains(e.target as Node)) {
    isMoreOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <header
    class="border-b sticky top-0 z-50 transition-colors duration-300"
    :class="[headerBgClass, shadowClass]"
  >
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span class="text-3xl font-black tracking-tighter font-sans" :class="textPrimaryClass">
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
          :to="localePath('/')"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db] dark:!text-red-400"
          >{{ $t('nav.home') }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/cong-nghe')"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >{{ $t('nav.technology') }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/windows')"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >{{ $t('nav.windows') }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/ios')"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >{{ $t('nav.ios') }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/android')"
          class="transition-colors duration-200"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >{{ $t('nav.android') }}</NuxtLink
        >
        <!-- PC: visible on 2xl+, hidden below → goes into ··· dropdown -->
        <NuxtLink
          :to="localePath('/pc')"
          class="2xl:inline transition-colors duration-200 hidden"
          :class="textHoverClass"
          active-class="!text-[#3498db]"
          >{{ $t('nav.pc') }}</NuxtLink
        >
        <!-- Deals dropdown: always visible on desktop -->
        <div class="relative group cursor-pointer py-2">
          <span
            class="inline-flex items-center gap-1 transition-colors duration-200"
            :class="textHoverClass"
          >
            {{ $t('nav.deals') }}
            <ChevronDown
              class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
            />
          </span>
          <div
            class="absolute left-0 top-full hidden group-hover:block w-36 bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-gray-150 dark:border-zinc-800 py-1.5 z-50 transition-all"
          >
            <NuxtLink
              :to="localePath('/deals/ios')"
              class="block px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-sky-500 transition-colors"
            >
              iOS
            </NuxtLink>
            <NuxtLink
              :to="localePath('/deals/android')"
              class="block px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-sky-500 transition-colors"
            >
              Android
            </NuxtLink>
          </div>
        </div>
        <!-- Gaming: visible on 2xl+, hidden below → goes into ··· dropdown -->
        <NuxtLink
          :to="localePath('/game')"
          class="2xl:inline transition-colors duration-200 hidden"
          :class="textHoverClass"
          active-class="!text-[#e74c3c]"
          >{{ $t('nav.gaming') }}</NuxtLink
        >
        <!-- ··· overflow dropdown: visible below 2xl, hides on 2xl+ -->
        <div class="relative 2xl:hidden" ref="moreDropdownRef">
          <button
            @click="isMoreOpen = !isMoreOpen"
            class="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg transition-colors duration-200 text-zinc-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 text-base font-bold tracking-widest"
            :class="{ 'bg-gray-100 dark:bg-zinc-800': isMoreOpen }"
            aria-label="More navigation items"
          >
            ···
          </button>
          <div
            v-if="isMoreOpen"
            class="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-gray-150 dark:border-zinc-800 py-1.5 z-50"
          >
            <NuxtLink
              :to="localePath('/pc')"
              class="block px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              :class="textHoverClass"
              @click="isMoreOpen = false"
            >
              {{ $t('nav.pc') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/game')"
              class="block px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              :class="textHoverClass"
              @click="isMoreOpen = false"
            >
              {{ $t('nav.gaming') }}
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Search & Auth -->
      <div class="flex items-center gap-3">
        <form @submit.prevent="handleSearch" class="relative hidden sm:block">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.search_placeholder')"
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

        <!-- Language Switcher (Desktop) -->
        <div class="relative group py-2 hidden sm:block">
          <button
            class="flex items-center gap-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-400 transition-colors cursor-pointer text-xs font-bold"
            aria-label="Switch Language"
          >
            🌐 {{ locale === 'en' ? 'EN' : 'VI' }}
            <ChevronDown class="w-3 h-3 opacity-60" />
          </button>
          <div
            class="absolute right-0 top-full hidden group-hover:block w-32 bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-gray-150 dark:border-zinc-800 py-1 z-50"
          >
            <button
              @click="switchLanguage('vi')"
              class="block w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              @click="switchLanguage('en')"
              class="block w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              🇬🇧 English
            </button>
          </div>
        </div>

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
              <span class="text-xs font-semibold text-zinc-555 dark:text-zinc-400">
                {{ $t('common.welcome_user') }}
                <NuxtLink
                  :to="localePath('/user/' + userStore.id)"
                  class="hover:underline transition-colors text-zinc-850 dark:text-zinc-200 hover:text-[#3498db] dark:hover:text-[#e74c3c]"
                >
                  <strong class="font-bold">{{ userStore.username }}</strong>
                </NuxtLink>
              </span>
              <NuxtLink
                v-if="userStore.role === 'admin' || userStore.role === 'mod'"
                :to="localePath('/admin/dashboard')"
                class="text-xs font-bold px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                {{ $t('common.dashboard') }}
              </NuxtLink>
              <button
                @click="handleLogout"
                class="text-xs font-bold text-zinc-550 hover:text-red-500 transition-colors cursor-pointer"
              >
                {{ $t('common.logout') }}
              </button>
            </template>
            <template v-else>
              <NuxtLink
                :to="localePath('/login')"
                class="text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors"
                :class="textHoverClass"
                >{{ $t('common.login') }}</NuxtLink
              >
              <NuxtLink
                :to="localePath('/register')"
                class="text-xs font-bold text-white px-3.5 py-1.5 rounded-full transition-colors"
                :class="[bgPrimaryClass, bgHoverClass]"
                >{{ $t('common.register') }}</NuxtLink
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
            <span class="text-2xl font-black tracking-tighter font-sans" :class="textPrimaryClass">
              TECHDEAL<span :class="dotColorClass">.</span>
            </span>
            <div class="flex items-center gap-1">
              <!-- Language Switcher (Mobile Sidebar) -->
              <button
                @click="switchLanguage(locale === 'en' ? 'vi' : 'en')"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-xs font-bold text-zinc-600 dark:text-zinc-400"
                aria-label="Switch Language"
              >
                🌐 {{ locale === 'en' ? 'EN' : 'VI' }}
              </button>

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
                  :placeholder="$t('common.search_placeholder')"
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
                  :to="localePath('/')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] dark:!text-red-400 font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.home') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/cong-nghe')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.technology') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/windows')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.windows') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/ios')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.ios') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/android')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.android') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/pc')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.pc') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/deals/ios')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors flex items-center justify-between"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  <span>{{ $t('nav.deals') }} iOS</span>
                  <span
                    class="text-[10px] bg-sky-500/10 text-sky-500 font-bold px-2 py-0.5 rounded-md"
                    >FREE</span
                  >
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/deals/android')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors flex items-center justify-between"
                  :class="textHoverClass"
                  active-class="!text-[#3498db] font-bold"
                  @click="isSidebarOpen = false"
                >
                  <span>{{ $t('nav.deals') }} Android</span>
                  <span
                    class="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-md"
                    >FREE</span
                  >
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/game')"
                  class="py-2 border-b border-gray-100 dark:border-zinc-850 transition-colors"
                  :class="textHoverClass"
                  active-class="!text-[#e74c3c] font-bold"
                  @click="isSidebarOpen = false"
                >
                  {{ $t('nav.gaming') }}
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
                      {{ $t('common.welcome_user') }}
                      <NuxtLink
                        :to="localePath('/user/' + userStore.id)"
                        class="hover:underline transition-colors text-zinc-850 dark:text-zinc-200 hover:text-[#3498db] dark:hover:text-[#e74c3c]"
                        @click="isSidebarOpen = false"
                      >
                        <strong class="font-bold">{{ userStore.username }}</strong>
                      </NuxtLink>
                    </div>
                    <NuxtLink
                      v-if="userStore.role === 'admin' || userStore.role === 'mod'"
                      :to="localePath('/admin/dashboard')"
                      class="text-sm font-bold text-center px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                      @click="isSidebarOpen = false"
                    >
                      {{ $t('common.dashboard') }}
                    </NuxtLink>
                    <button
                      @click="handleMobileLogout"
                      class="text-sm font-bold text-center px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-550/10 transition-colors cursor-pointer"
                    >
                      {{ $t('common.logout') }}
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col gap-3">
                    <NuxtLink
                      :to="localePath('/login')"
                      class="text-sm font-bold text-center py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
                      @click="isSidebarOpen = false"
                    >
                      {{ $t('common.login') }}
                    </NuxtLink>
                    <NuxtLink
                      :to="localePath('/register')"
                      class="text-sm font-bold text-center text-white py-2.5 rounded-xl transition-colors"
                      :class="[bgPrimaryClass, bgHoverClass]"
                      @click="isSidebarOpen = false"
                    >
                      {{ $t('common.register') }}
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
