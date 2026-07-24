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
// analytics_storage KHÔNG khai báo ở đây — cố tình để GA hoạt động bình thường
// (thu thập đầy đủ) bất kể user Đồng ý hay Từ chối. Chỉ 3 tín hiệu quảng cáo
// (ad_storage/ad_user_data/ad_personalization) theo lựa chọn của user: Từ
// chối → AdSense chuyển sang quảng cáo không cá nhân hóa, không dùng dữ liệu
// đã thu thập để nhắm quảng cáo.
const CONSENT_DEFAULT_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
  });
`

const cookieConsent = useCookieConsent()

function pushConsentUpdate(value: 'accepted' | 'declined' | null) {
  if (typeof window === 'undefined' || typeof (window as any).gtag !== 'function') return
  const granted = value === 'accepted' ? 'granted' : 'denied'
  ;(window as any).gtag('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted
  })
}

watch(cookieConsent, pushConsentUpdate, { immediate: true })

// ---- Monetag (In-Page Push + Vignette Banner) — ĐANG TẮT ------------------
// TẮT vì 2 lý do: (1) user báo trên /go, sau khi tắt popup Vignette, bấm nút
// "Tới trang đích" bị cướp click nhảy sang loạt trang lạ — IPP/Vignette chèn
// vào chính luồng redirect, phá trải nghiệm và làm mất click thật; (2) CPM
// Monetag lẹt đẹt, không bù được thiệt hại đó. Giữ nguyên code + zone để bật
// lại nếu sau này muốn thử format không chặn thao tác. Khi bật lại thì bỏ
// comment khối trong useHead() ở cuối file.
// Zone cũ (11362747, 11363009) đã bị Monetag deactivate do nghi ngờ invalid
// traffic (test lặp lại bằng công cụ tự động + IP LAN) — tài khoản đã được mở
// lại, đây là 2 zone MỚI (11370001, 11367556). Cố tình KHÔNG đặt trên
// blog/trang chủ trong lúc MGID đang chờ xét duyệt.
// /giveaway ĐÃ GỠ IPP+Vignette (interstitial chặn luồng nhận key) — trang đó
// nay chỉ chạy Adsterra banner + Social Bar (khai báo ngay bên dưới).
// LƯU Ý: không test lặp lại nhiều lần bằng công cụ tự động trên zone này —
// chỉ xem qua trình duyệt thường 1-2 lần, để tránh lặp lại sự cố deactivate.
const MONETAG_ALLOWED_PREFIXES = ['/go']

const route = useRoute()
const monetagAllowed = computed(() => {
  const path = route.path
  return MONETAG_ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
})

const MONETAG_IPP_SCRIPT = `(function(s){s.dataset.zone='11370001',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
const MONETAG_VIGNETTE_SCRIPT = `(function(s){s.dataset.zone='11367556',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`

// ---- Social Bar — /giveaway + /go -----------------------------------------
// Widget nổi, KHÔNG chặn thao tác → hợp trang cần user bấm claim / bấm "Tới
// trang đích" tới cùng (khác Vignette/interstitial nên cố tình chỉ dùng format
// này ở đây). Thêm /go (2026-07-24) để bù doanh thu sau khi bỏ Monetag —
// chọn đúng format không cướp click, tránh lặp lại lỗi Monetag đã gây ra.
// Vẫn KHÔNG đặt trên blog/trang chủ (giữ sạch cho MGID/AdSense sau này).
const SOCIALBAR_ALLOWED_PREFIXES = ['/giveaway', '/go']
const socialBarAllowed = computed(() => {
  const path = route.path
  return SOCIALBAR_ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
})
const SOCIALBAR_SRC =
  'https://pl30479529.effectivecpmnetwork.com/15/ca/9b/15ca9b44193b21b86a4339747cf54092.js'

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
    // Monetag TẮT (xem lý do ở khối MONETAG_* phía trên). Chỉ chạy Adsterra.
    /*
    ...(monetagAllowed.value
      ? [
          { innerHTML: MONETAG_IPP_SCRIPT, type: 'text/javascript' },
          { innerHTML: MONETAG_VIGNETTE_SCRIPT, type: 'text/javascript' }
        ]
      : []),
    */
    ...(socialBarAllowed.value ? [{ src: SOCIALBAR_SRC, async: true }] : [])
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
