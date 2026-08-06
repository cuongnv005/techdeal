<script setup lang="ts">
import { ref, computed } from 'vue'

import { Sparkles, Mail, Rss, Laptop, Gamepad2 } from 'lucide-vue-next'

import type { TeamMember } from '@features/users/types/user.type'

import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'
import { useTeam } from '@features/users/composables/use-team'

const { team } = useTeam()
const localePath = useLocalePath()
const { t, locale } = useI18n()

// Role labels from i18n
const ROLE_META = computed<
  Record<
    TeamMember['role'],
    { label: string; textClass: string; borderClass: string; gradientClass: string }
  >
>(() => ({
  admin: {
    label: t('about.role_admin'),
    textClass: 'text-[#3498db]',
    borderClass: 'border-[#3498db]/30',
    gradientClass: 'from-sky-400 to-blue-600'
  },
  mod: {
    label: t('about.role_mod'),
    textClass: 'text-red-500',
    borderClass: 'border-red-300/30',
    gradientClass: 'from-red-400 to-orange-500'
  }
}))

// Chữ cái đầu của 2 từ cuối trong họ tên, dùng làm avatar fallback khi chưa có avatar_url.
const getInitials = (fullName: string) => {
  const words = fullName.trim().split(/\s+/)
  return words
    .slice(-2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
}

useSeoMeta({
  title: computed(() => t('about.seo_title')),
  description: computed(() => t('about.seo_desc')),
  ogTitle: computed(() => t('about.seo_title')),
  ogType: 'website',
  ogUrl: 'https://techdeal.io.vn/about',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: 'https://techdeal.io.vn/about' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TechDeal',
        url: 'https://techdeal.io.vn',
        logo: 'https://techdeal.io.vn/images/logo.png',
        description:
          'Trang tin tức công nghệ, game và tổng hợp ưu đãi phần mềm, ứng dụng miễn phí.',
        email: 'contact@techdeal.io.vn',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+84822344589',
          contactType: 'customer support',
          areaServed: 'VN',
          availableLanguage: 'Vietnamese'
        }
      })
    }
  ]
})

const emailInput = ref('')
const isSubscribed = ref(false)

const handleSubscribe = () => {
  if (emailInput.value.trim()) {
    isSubscribed.value = true
    emailInput.value = ''
    alert(t('about.subscribe_success'))
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 md:p-10 shadow-xs space-y-8"
      >
        <!-- About Section -->
        <div class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4 flex items-center gap-2"
          >
            <Sparkles class="w-8 h-8 text-[#3498db] dark:text-[#e74c3c]" />
            {{ $t('about.heading') }}
          </h1>

          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            <strong>TechDeal</strong> {{ $t('about.para1') }}
          </p>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            {{ $t('about.para2') }}
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-3 pt-2">
            <div
              class="p-4 bg-blue-50 dark:bg-zinc-950 rounded-xl border border-blue-100 dark:border-zinc-800 text-center"
            >
              <p class="text-xl font-black text-[#3498db]">100+</p>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {{ $t('about.stat_articles') }}
              </p>
            </div>
            <div
              class="p-4 bg-green-50 dark:bg-zinc-950 rounded-xl border border-green-100 dark:border-zinc-800 text-center"
            >
              <p class="text-xl font-black text-green-500">{{ $t('about.stat_update_freq') }}</p>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {{ $t('about.stat_update') }}
              </p>
            </div>
            <div
              class="p-4 bg-amber-50 dark:bg-zinc-950 rounded-xl border border-amber-100 dark:border-zinc-800 text-center"
            >
              <p class="text-xl font-black text-amber-500">2026</p>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {{ $t('about.stat_founded') }}
              </p>
            </div>
          </div>

          <!-- Content pillars -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-800 flex gap-3"
            >
              <Laptop class="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">
                  {{ $t('about.pillar_tech_title') }}
                </h3>
                <p class="text-[11px] text-zinc-555 mt-1 leading-normal dark:text-zinc-400">
                  {{ $t('about.pillar_tech_desc') }}
                </p>
              </div>
            </div>
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-800 flex gap-3"
            >
              <Gamepad2 class="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">
                  {{ $t('about.pillar_game_title') }}
                </h3>
                <p class="text-[11px] text-zinc-555 mt-1 leading-normal dark:text-zinc-400">
                  {{ $t('about.pillar_game_desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-5">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">
            {{ $t('about.team_heading') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="member in team"
              :key="member.id"
              :to="localePath(`/user/${member.id}`)"
              class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-800 hover:border-[#3498db]/40 dark:hover:border-[#3498db]/40 transition-colors"
            >
              <img
                v-if="member.avatar_url"
                :src="member.avatar_url"
                :alt="member.full_name"
                class="w-12 h-12 rounded-full object-cover shrink-0 border-2"
                :class="ROLE_META[member.role].borderClass"
              />
              <div
                v-else
                class="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 text-white font-black text-sm border-2"
                :class="[ROLE_META[member.role].gradientClass, ROLE_META[member.role].borderClass]"
              >
                {{ getInitials(member.full_name) }}
              </div>
              <div>
                <p class="text-xs font-black text-zinc-900 dark:text-white">
                  {{ member.full_name }}
                </p>
                <p class="text-[10px] font-semibold mb-1" :class="ROLE_META[member.role].textClass">
                  {{ ROLE_META[member.role].label }}
                </p>
                <p
                  class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-4"
                >
                  {{ member.bio }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Values Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-5">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">
            {{ $t('about.values_heading') }}
          </h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <span class="text-green-500 font-black text-sm mt-0.5">✓</span>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-white">
                  {{ $t('about.value1_title') }}
                </p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {{ $t('about.value1_desc') }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-green-500 font-black text-sm mt-0.5">✓</span>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-white">
                  {{ $t('about.value2_title') }}
                </p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {{ $t('about.value2_desc') }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-green-500 font-black text-sm mt-0.5">✓</span>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-white">
                  {{ $t('about.value3_title') }}
                </p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {{ $t('about.value3_desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-6">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail class="w-6 h-6 text-[#3498db]" /> {{ $t('about.newsletter_heading') }}
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            {{ $t('about.newsletter_desc') }}
          </p>

          <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-2 max-w-lg">
            <input
              v-model="emailInput"
              type="email"
              :placeholder="$t('about.email_placeholder')"
              class="flex-grow text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
            <button
              type="submit"
              class="px-5 py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Rss class="w-4 h-4" /> {{ $t('about.subscribe_btn') }}
            </button>
          </form>
          <p class="text-[11px] text-zinc-450 dark:text-zinc-500">
            {{ $t('about.privacy_note') }}
          </p>
          <p v-if="isSubscribed" class="text-xs text-emerald-500 font-semibold">
            {{ $t('about.subscribe_success') }}
          </p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
