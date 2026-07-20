<script setup lang="ts">
import { computed, watch } from 'vue'

import { useCookieConsent } from '@shared/composables/use-cookie-consent'
import { useUserStore } from '@stores/user'

const userStore = useUserStore()
userStore.initializeAuth()

// ---- Google Consent Mode v2 ----------------------------------------------
// Mặc định TỪ CHỐI toàn bộ (an toàn) — render SSR vào HTML gốc nên áp dụng
// trước khi AdSense/Analytics kịp chạy. Ngay khi biết lựa chọn thật của user
// (đã lưu từ trước, hoặc vừa bấm Đồng ý/Từ chối trên banner), gọi 'update' để
// cập nhật lại. Google đọc chung 1 trạng thái consent qua window.dataLayer
// cho cả AdSense lẫn Analytics — khai báo 1 lần ở đây, không cần sửa gì ở
// gtag.client.ts hay chỗ tải AdSense bên dưới. Khi 'denied': AdSense chuyển
// sang quảng cáo không cá nhân hóa (vẫn hiển thị, không dùng cookie theo dõi
// lịch sử duyệt web), Analytics không set cookie _ga/_gid.
const CONSENT_DEFAULT_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
  });
`

const cookieConsent = useCookieConsent()

function pushConsentUpdate(value: 'accepted' | 'declined' | null) {
  if (typeof window === 'undefined' || typeof (window as any).gtag !== 'function') return
  const granted = value === 'accepted' ? 'granted' : 'denied'
  ;(window as any).gtag('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted
  })
}

watch(cookieConsent, pushConsentUpdate, { immediate: true })

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
  script: [
    { innerHTML: CONSENT_DEFAULT_SCRIPT, type: 'text/javascript' },
    ...(adsAllowed.value
      ? [
          {
            src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`,
            async: true,
            crossorigin: 'anonymous'
          }
        ]
      : [])
  ]
}))
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <ClientOnly>
    <UiThemeToggle />
  </ClientOnly>
  <UiCookieConsentBanner />
</template>
