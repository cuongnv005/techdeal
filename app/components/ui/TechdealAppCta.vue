<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { Smartphone, ArrowRight, ExternalLink } from 'lucide-vue-next'

// CTA mở/cài TechDeal app — dùng chung cho /go (shortlinks) và /giveaway.
// Chỉ render khi cha truyền threadId (gắn deal_thread_id) — không tự quyết định điều kiện hiện/ẩn.
const props = withDefaults(
  defineProps<{
    threadId: string
    appName?: string | null
    /** Chuỗi query gắn vào link (deferred deep link) */
    referrer?: string
    /** Ép buộc chế độ Light Mode (dành cho trang giveaway không có dark mode) */
    forceLight?: boolean
  }>(),
  {
    forceLight: false,
    referrer: ''
  }
)

const TECHDEAL_IOS_APP_ID = '6802750544'

const isIos = ref(false)

onMounted(() => {
  const ua = navigator.userAgent || ''
  if (/iphone|ipad|ipod/i.test(ua)) {
    isIos.value = true
  }
})

// Custom URL scheme để mở thẳng thread trong Techdeal App nếu đã cài trên iOS
const iosCustomSchemeUrl = computed(() => `techdeal://thread/${props.threadId}`)
const iosAppStoreUrl = computed(() => `https://apps.apple.com/app/id${TECHDEAL_IOS_APP_ID}`)
</script>

<template>
  <section
    class="border-2 border-black rounded-[28px] p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] text-center space-y-4"
    :class="props.forceLight ? 'bg-white text-zinc-900' : 'bg-white dark:bg-zinc-900'"
  >
    <div
      class="inline-flex items-center gap-1 bg-black text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full font-serif"
    >
      <Smartphone class="w-3.5 h-3.5" />
      {{ $t('go.app_cta_label') }}
    </div>
    <p
      class="text-xs leading-relaxed"
      :class="props.forceLight ? 'text-zinc-600' : 'text-zinc-600 dark:text-zinc-350'"
    >
      {{ $t('go.app_cta_desc')
      }}<template v-if="appName">
        <strong>{{ appName }}</strong></template
      >
    </p>

    <!-- Thiết bị iOS: Thử mở app qua custom scheme, có link phụ tới App Store -->
    <div v-if="isIos" class="flex flex-col items-center gap-2">
      <a
        :href="iosCustomSchemeUrl"
        class="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl transition-all shadow-lg uppercase tracking-wider border-2 text-white text-xs font-bold cursor-pointer hover:opacity-90"
        :class="
          props.forceLight
            ? 'border-zinc-900 bg-zinc-900'
            : 'border-zinc-900 dark:border-[#e74c3c] bg-zinc-900 dark:bg-[#e74c3c]'
        "
      >
        {{ $t('go.open_in_app') }} <ArrowRight class="w-4 h-4" />
      </a>
      <a
        :href="iosAppStoreUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-[10px] font-bold hover:underline cursor-pointer"
        :class="props.forceLight ? 'text-zinc-500' : 'text-zinc-450 dark:text-zinc-400'"
      >
        {{ $t('go.not_installed_ios') }}
      </a>
    </div>

    <!-- Desktop / Thiết bị khác: Dẫn trực tiếp tới App Store của TechDeal -->
    <a
      v-else
      :href="iosAppStoreUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl transition-all shadow-lg uppercase tracking-wider border-2 text-white text-xs font-bold cursor-pointer hover:opacity-90"
      :class="
        props.forceLight
          ? 'border-zinc-900 bg-zinc-900'
          : 'border-zinc-900 dark:border-[#e74c3c] bg-zinc-900 dark:bg-[#e74c3c]'
      "
    >
      {{ $t('go.not_installed_ios') }} <ExternalLink class="w-4 h-4" />
    </a>
  </section>
</template>
