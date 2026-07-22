<script setup lang="ts">
import { computed, watch } from 'vue'

import { useCookieConsent } from '@shared/composables/use-cookie-consent'
import { useUserStore } from '@stores/user'

const userStore = useUserStore()
userStore.initializeAuth()

// ---- Google Consent Mode v2 ----------------------------------------------
// AdSense hiện KHÔNG chạy (tài khoản chưa được duyệt) — script adsbygoogle.js
// và toàn bộ logic chặn theo route đã gỡ, không còn ích gì khi chưa duyệt.
// Vẫn giữ Consent Mode vì Google Analytics (gtag.client.ts) dùng chung cơ chế
// này, và sẽ cần lại ngay khi AdSense được duyệt trong tương lai.
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

// ---- Monetag (In-Page Push + Vignette Banner) — chỉ /go và /giveaway ------
// Zone cũ (11362747, 11363009) đã bị Monetag deactivate do nghi ngờ invalid
// traffic (test lặp lại bằng công cụ tự động + IP LAN) — tài khoản đã được mở
// lại, đây là 2 zone MỚI (11370001, 11367556). Cố tình KHÔNG đặt trên
// blog/trang chủ trong lúc MGID đang chờ xét duyệt.
// LƯU Ý: không test lặp lại nhiều lần bằng công cụ tự động trên zone này —
// chỉ xem qua trình duyệt thường 1-2 lần, để tránh lặp lại sự cố deactivate.
const MONETAG_ALLOWED_PREFIXES = ['/go', '/giveaway']

const route = useRoute()
const monetagAllowed = computed(() => {
  const path = route.path
  return MONETAG_ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
})

const MONETAG_IPP_SCRIPT = `(function(s){s.dataset.zone='11370001',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
const MONETAG_VIGNETTE_SCRIPT = `(function(s){s.dataset.zone='11367556',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`

/* ---- AdSense (tạm tắt — tài khoản chưa được duyệt) ------------------------
 * Bỏ comment toàn bộ khối dưới đây + đổi useHead() cuối file khi AdSense được
 * duyệt lại. Nhớ thêm lại dòng google.com vào public/ads.txt cùng lúc.
 * (computed đã import sẵn ở đầu file cho Monetag, không cần import lại)
 *
 * // Không tải adsbygoogle.js trên các trang chức năng/redirect/đăng nhập để
 * // Auto Ads (và cả manual ad unit) KHÔNG BAO GIỜ render ở đó — tránh vi phạm
 * // chính sách AdSense (ads trên trang login / gateway / redirect / thin content).
 * // Chạy trong app.vue nên thẻ <script> được render SSR vào HTML thô (Google đọc được).
 * const AD_BLOCKED_PREFIXES = [
 *   '/giveaway',
 *   '/go',
 *   '/login',
 *   '/register',
 *   '/forgot-password',
 *   '/reset-password',
 *   '/admin',
 *   '/search',
 *   '/user',
 *   '/blog/publish'
 * ]
 *
 * const route = useRoute()
 * const adsAllowed = computed(() => {
 *   const path = route.path
 *   return !AD_BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
 * })
 *
 * const adClientId = import.meta.env.VITE_AD_CLIENT_ID || 'ca-pub-3940256099942544'
 * -------------------------------------------------------------------------- */

useHead(() => ({
  script: [
    { innerHTML: CONSENT_DEFAULT_SCRIPT, type: 'text/javascript' },
    ...(monetagAllowed.value
      ? [
          { innerHTML: MONETAG_IPP_SCRIPT, type: 'text/javascript' },
          { innerHTML: MONETAG_VIGNETTE_SCRIPT, type: 'text/javascript' }
        ]
      : [])
    // Bỏ comment dòng dưới khi AdSense được duyệt lại (cần cả khối trên đã bật):
    // ...(adsAllowed.value
    //   ? [
    //       {
    //         src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`,
    //         async: true,
    //         crossorigin: 'anonymous'
    //       }
    //     ]
    //   : [])
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
  <ClientOnly>
    <UiPrivacyNotice />
  </ClientOnly>
</template>
