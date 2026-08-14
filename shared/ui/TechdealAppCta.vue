<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { Smartphone, ArrowRight } from 'lucide-vue-next'

// CTA mở/cài TechDeal app — dùng chung cho /go (shortlinks) và /giveaway.
// Chỉ render khi cha truyền threadId (gắn deal_thread_id) — không tự quyết định điều kiện hiện/ẩn.
const props = defineProps<{
  threadId: string
  appName?: string | null
  /** Chuỗi query gắn vào link Play Store để app đọc lại referrer sau khi cài (deferred deep link). */
  referrer: string
}>()

// TODO: điền App Store numeric ID thật của TechDeal app sau khi được Apple duyệt (Phase 8)
const TECHDEAL_ANDROID_PACKAGE = 'io.techdeal.app'
const TECHDEAL_IOS_APP_ID = 'REPLACE_WITH_REAL_APPLE_APP_ID'

const clientPlatform = ref<'android' | 'ios' | 'other'>('other')

onMounted(() => {
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) {
    clientPlatform.value = 'android'
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    clientPlatform.value = 'ios'
  }
})

const androidPlayStoreUrl = computed(() => {
  const referrer = encodeURIComponent(props.referrer)
  return `https://play.google.com/store/apps/details?id=${TECHDEAL_ANDROID_PACKAGE}&referrer=${referrer}`
})

// 1 link duy nhất: đã cài TechDeal -> mở thẳng thread; chưa cài -> tự rơi về Play Store kèm referrer
const androidIntentUrl = computed(() => {
  const fallback = encodeURIComponent(androidPlayStoreUrl.value)
  return `intent://thread/${props.threadId}#Intent;scheme=techdeal;package=${TECHDEAL_ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`
})

// iOS không có 1-link-fallback như Android — cần 2 nút riêng
const iosCustomSchemeUrl = computed(() => `techdeal://thread/${props.threadId}`)
const iosAppStoreUrl = computed(() => `https://apps.apple.com/app/id${TECHDEAL_IOS_APP_ID}`)
</script>

<template>
  <section
    class="border-2 border-black rounded-[28px] p-6 bg-white dark:bg-zinc-900 shadow-[8px_8px_0_rgba(0,0,0,1)] text-center space-y-4"
  >
    <div
      class="inline-flex items-center gap-1 bg-black text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full font-serif"
    >
      <Smartphone class="w-3.5 h-3.5" />
      {{ $t('go.app_cta_label') }}
    </div>
    <p class="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed">
      {{ $t('go.app_cta_desc')
      }}<template v-if="appName">
        <strong>{{ appName }}</strong></template
      >
    </p>

    <!-- Android: 1 link duy nhất, tự xử lý cả 2 trường hợp đã cài/chưa cài -->
    <a
      v-if="clientPlatform === 'android'"
      :href="androidIntentUrl"
      class="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl transition-all shadow-lg uppercase tracking-wider border-2 border-zinc-900 dark:border-[#e74c3c] bg-zinc-900 dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold cursor-pointer"
    >
      {{ $t('go.open_or_install_app') }} <ArrowRight class="w-4 h-4" />
    </a>

    <!-- iOS: không gộp được 1 link như Android, tách 2 nút riêng -->
    <div v-else-if="clientPlatform === 'ios'" class="flex flex-col items-center gap-2">
      <a
        :href="iosCustomSchemeUrl"
        class="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl transition-all shadow-lg uppercase tracking-wider border-2 border-zinc-900 dark:border-[#e74c3c] bg-zinc-900 dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold cursor-pointer"
      >
        {{ $t('go.open_in_app') }} <ArrowRight class="w-4 h-4" />
      </a>
      <a
        :href="iosAppStoreUrl"
        class="text-[10px] font-bold text-zinc-450 hover:underline cursor-pointer"
      >
        {{ $t('go.not_installed_ios') }}
      </a>
    </div>

    <!-- Desktop/khác: chỉ hiện link cài đặt Android làm gợi ý mặc định -->
    <a
      v-else
      :href="androidPlayStoreUrl"
      class="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl transition-all shadow-lg uppercase tracking-wider border-2 border-zinc-900 dark:border-[#e74c3c] bg-zinc-900 dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold cursor-pointer"
    >
      {{ $t('go.install_app') }} <ArrowRight class="w-4 h-4" />
    </a>
  </section>
</template>
