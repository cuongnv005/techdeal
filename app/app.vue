<script setup lang="ts">
import { computed } from 'vue'

import { useUserStore } from '@stores/user'

const userStore = useUserStore()
userStore.initializeAuth()

// ---- Kiểm soát script AdSense theo route --------------------------------
// Không tải adsbygoogle.js trên các trang chức năng/redirect/đăng nhập để
// Auto Ads (và cả manual ad unit) KHÔNG BAO GIỜ render ở đó — tránh vi phạm
// chính sách AdSense (ads trên trang login / gateway / redirect / thin content).
// Chạy trong app.vue nên thẻ <script> được render SSR vào HTML thô (Google đọc được).
const AD_BLOCKED_PREFIXES = [
  '/giveaway',
  '/go',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/admin',
  '/search',
  '/user',
  '/blog/publish'
]

const route = useRoute()
const adsAllowed = computed(() => {
  const path = route.path
  return !AD_BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
})

const adClientId = import.meta.env.VITE_AD_CLIENT_ID || 'ca-pub-3940256099942544'

useHead(() => ({
  script: adsAllowed.value
    ? [
        {
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`,
          async: true,
          crossorigin: 'anonymous'
        }
      ]
    : []
}))
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <ClientOnly>
    <UiThemeToggle />
  </ClientOnly>
</template>
