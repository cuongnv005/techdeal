<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HttpService } from '@core/api/service'

interface SquareAdItem {
  id: string
  name: string
  ad_type: string
  platform: string
  target_url: string
  title?: string | null
  description?: string | null
  product_image_url?: string | null
  background_image_url?: string | null
}

const props = withDefaults(
  defineProps<{
    page?: string
    fallbackTitle?: string
    fallbackDescription?: string
    fallbackProductImage?: string
    fallbackTargetUrl?: string
  }>(),
  {
    page: 'go',
    fallbackTitle: '10.10',
    fallbackDescription: 'DISC UP TO 70% OFF',
    fallbackProductImage: '',
    fallbackTargetUrl: 'https://shopee.vn'
  }
)

const ad = ref<SquareAdItem | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  if (!process.client) return

  try {
    const res = await HttpService.get<
      unknown,
      { data: { success: boolean; data: SquareAdItem[] } }
    >(`/affiliate/ads/active?type=square_banner&page=${props.page}`)

    const items = res.data?.data
    if (items && items.length > 0) {
      // Chọn 1 ad ngẫu nhiên trong danh sách active
      const picked = items[Math.floor(Math.random() * items.length)]
      if (picked) {
        ad.value = picked

        // Ghi nhận impression ngầm
        if (ad.value?.id) {
          try {
            HttpService.post(`/affiliate/ads/${ad.value.id}/impression`, {})
          } catch (e) {
            // ignore
          }
        }
      }
    }
  } catch (err) {
    console.error('Fetch square affiliate banner error:', err)
  } finally {
    isLoading.value = false
  }
})

const displayTitle = computed(() => ad.value?.title || props.fallbackTitle)
const displayDescription = computed(() => ad.value?.description || props.fallbackDescription)
const displayProductImage = computed(
  () => ad.value?.product_image_url || props.fallbackProductImage
)
const displayTargetUrl = computed(() => ad.value?.target_url || props.fallbackTargetUrl)
const displayBackground = computed(
  () => ad.value?.background_image_url || '/images/affiliate_square_bg.jpg'
)

const handleClick = () => {
  if (ad.value?.id) {
    try {
      HttpService.post(`/affiliate/ads/${ad.value.id}/click`, {})
    } catch (e) {
      // ignore
    }
  }
}
</script>

<template>
  <div class="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto select-none group">
    <!-- Anchor wrap -->
    <a
      :href="displayTargetUrl"
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      @click="handleClick"
      class="block relative w-full aspect-square rounded-[24px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.25)] border border-red-500/20 transition-transform duration-300 transform group-hover:scale-[1.02] cursor-pointer"
    >
      <!-- Background Template -->
      <img
        :src="displayBackground"
        alt="Affiliate Flash Sale Banner"
        class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <!-- Dynamic Header: 3D Sale Title & Description -->
      <div
        class="absolute top-[16%] inset-x-0 flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none"
      >
        <!-- 3D Gold / Orange Headline (e.g. 10.10, 9.9) -->
        <div
          class="font-black text-[42px] sm:text-[48px] leading-none tracking-tight sale-3d-text uppercase"
        >
          {{ displayTitle }}
        </div>

        <!-- Subtitle / Promo Description (e.g. DISC UP TO 70% OFF) -->
        <p
          class="text-white font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1.5 font-sans"
        >
          {{ displayDescription }}
        </p>
      </div>

      <!-- Dynamic Product on Podium -->
      <div
        class="absolute inset-x-0 top-[34%] bottom-[20%] flex items-center justify-center z-10 pointer-events-none px-8"
      >
        <img
          v-if="displayProductImage"
          :src="displayProductImage"
          alt="Product Sale"
          class="max-w-[72%] max-h-[90%] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <!-- Interactive Mouse Pointer Click Indicator (Góc phải phía dưới) -->
      <div
        class="absolute right-[8%] bottom-[6%] z-20 pointer-events-none flex items-center justify-center cursor-indicator"
      >
        <!-- Click Ping Ring -->
        <span
          class="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-sky-400/60 animate-ping"
        ></span>

        <!-- Mouse Cursor Icon -->
        <img
          src="/images/cursor_click.png"
          alt="Click Here"
          class="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] cursor-bounce"
        />
      </div>
    </a>
  </div>
</template>

<style scoped>
/* 3D Bold Gradient Effect for Sale Title */
.sale-3d-text {
  font-family: 'Montserrat', 'Poppins', 'Outfit', system-ui, sans-serif;
  color: #ffde59;
  background: linear-gradient(180deg, #fff7ad 0%, #ffde59 45%, #ff9100 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 0px #b83200) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45));
}

/* Mouse cursor scale pulse and slight bounce */
.cursor-bounce {
  animation: cursorPulse 1.6s ease-in-out infinite;
  transform-origin: top left;
}

@keyframes cursorPulse {
  0%,
  100% {
    transform: scale(1) rotate(-5deg) translateY(0);
  }
  50% {
    transform: scale(1.18) rotate(0deg) translateY(-4px);
  }
}
</style>
