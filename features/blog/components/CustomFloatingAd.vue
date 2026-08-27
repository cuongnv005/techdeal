<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { HttpService } from '@core/api/service'

interface ActiveAffiliateAd {
  id: string
  name: string
  platform: 'shopee' | 'lazada' | 'tiktok' | 'tiki' | 'other'
  image_url: string
  image_thumb_url: string | null
  target_url: string
  animation: 'zoom' | 'shake' | 'bounce' | 'pulse' | 'none'
  position_vertical: 'top' | 'bottom' | 'middle'
  position_horizontal: 'left' | 'right'
  offset_vertical: string
  offset_horizontal: string
  open_delay_ms: number
  auto_close_seconds: number
}

const ad = ref<ActiveAffiliateAd | null>(null)
const isVisible = ref(false)
const isClosed = ref(false)

const SESSION_KEY = 'techdeal_dismissed_affiliate_ad'

onMounted(async () => {
  if (!process.client) return

  // Nếu user đã tắt banner trong session này thì không hiện lại
  if (sessionStorage.getItem(SESSION_KEY)) {
    return
  }

  try {
    const res = await HttpService.get<
      unknown,
      { data: { success: boolean; data: ActiveAffiliateAd | null } }
    >('/affiliate/floating-ad/active')
    const adData = res.data?.data
    if (adData && adData.id && adData.image_url && adData.target_url) {
      ad.value = adData

      // Gửi impression ngầm
      try {
        HttpService.post(`/affiliate/floating-ad/${adData.id}/impression`, {})
      } catch (e) {
        // ignore
      }

      // Delay xuất hiện
      setTimeout(() => {
        if (!isClosed.value) {
          isVisible.value = true
        }
      }, adData.open_delay_ms || 2000)

      // Tự đóng sau X giây nếu được cấu hình
      if (adData.auto_close_seconds && adData.auto_close_seconds > 0) {
        setTimeout(
          () => {
            handleClose()
          },
          (adData.open_delay_ms || 2000) + adData.auto_close_seconds * 1000
        )
      }
    }
  } catch (err) {
    console.error('Fetch floating ad error:', err)
  }
})

const handleClose = () => {
  isVisible.value = false
  isClosed.value = true
  if (process.client) {
    sessionStorage.setItem(SESSION_KEY, 'true')
  }
}

const handleClick = () => {
  if (!ad.value) return

  // Ghi nhận click ngầm
  try {
    HttpService.post(`/affiliate/floating-ad/${ad.value.id}/click`, {})
  } catch (e) {
    // ignore
  }

  // Mở link affiliate Shopee/Lazada sang tab mới
  window.open(ad.value.target_url, '_blank', 'noopener,noreferrer')
}

// Cấu hình style vị trí
const getPositionStyle = () => {
  if (!ad.value) return {}
  const style: Record<string, string> = {}

  if (ad.value.position_vertical === 'top') {
    style.top = ad.value.offset_vertical || '20px'
  } else if (ad.value.position_vertical === 'middle') {
    style.top = '50%'
    style.transform = 'translateY(-50%)'
  } else {
    style.bottom = ad.value.offset_vertical || '20px'
  }

  if (ad.value.position_horizontal === 'left') {
    style.left = ad.value.offset_horizontal || '20px'
  } else {
    style.right = ad.value.offset_horizontal || '20px'
  }

  return style
}

// Class animation
const getAnimationClass = () => {
  if (!ad.value) return ''
  switch (ad.value.animation) {
    case 'shake':
      return 'animate-gentle-shake'
    case 'bounce':
      return 'animate-bounce-subtle'
    case 'pulse':
      return 'animate-pulse-glow'
    case 'zoom':
      return 'animate-zoom-in'
    default:
      return ''
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 scale-75 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75"
  >
    <div v-if="isVisible && ad" :style="getPositionStyle()" class="fixed z-50 select-none group">
      <div class="relative cursor-pointer" :class="getAnimationClass()">
        <!-- Close button -->
        <button
          @click.stop="handleClose"
          class="absolute -top-2 -right-2 w-5 h-5 bg-zinc-900/90 hover:bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 z-10 border border-white/30 cursor-pointer"
          title="Đóng quảng cáo"
          aria-label="Close Ad"
        >
          <X class="w-3 h-3" />
        </button>

        <!-- Banner Image Container -->
        <div
          @click="handleClick"
          class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700/80 p-1 flex items-center justify-center backdrop-blur-xs"
        >
          <img
            :src="ad.image_url"
            :alt="ad.name"
            class="w-full h-full object-contain rounded-xl drop-shadow-xs"
            loading="lazy"
          />

          <!-- Subtle Platform Badge in Corner -->
          <div
            v-if="ad.platform"
            class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase text-white tracking-widest shadow-xs"
            :class="
              ad.platform === 'shopee'
                ? 'bg-orange-500'
                : ad.platform === 'lazada'
                  ? 'bg-blue-600'
                  : ad.platform === 'tiktok'
                    ? 'bg-zinc-900'
                    : 'bg-emerald-600'
            "
          >
            {{ ad.platform }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes gentle-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-6deg);
  }
  40% {
    transform: rotate(6deg);
  }
  60% {
    transform: rotate(-3deg);
  }
  80% {
    transform: rotate(3deg);
  }
}

@keyframes bounce-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(52, 152, 219, 0));
  }
  50% {
    transform: scale(1.04);
    filter: drop-shadow(0 0 10px rgba(52, 152, 219, 0.4));
  }
}

@keyframes zoom-in {
  0% {
    transform: scale(0.85);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animate-gentle-shake {
  animation: gentle-shake 3s ease-in-out infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2.5s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-zoom-in {
  animation: zoom-in 1.5s ease-out;
}
</style>
