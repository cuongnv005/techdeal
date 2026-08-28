<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HttpService } from '@core/api/service'

interface VerticalAdItem {
  id: string
  name: string
  ad_type: string
  platform: string
  image_url: string
  target_url: string
  side_position?: 'left' | 'right' | 'both'
}

const props = withDefaults(
  defineProps<{
    page?: string
  }>(),
  {
    page: 'go'
  }
)

const leftAd = ref<VerticalAdItem | null>(null)
const rightAd = ref<VerticalAdItem | null>(null)

onMounted(async () => {
  if (!process.client) return

  try {
    const res = await HttpService.get<
      unknown,
      { data: { success: boolean; data: VerticalAdItem[] } }
    >(`/affiliate/ads/active?type=vertical_banner&page=${props.page}`)

    const items = res.data?.data
    if (items && items.length > 0) {
      const leftItems = items.filter(
        (i) => i.side_position === 'left' || i.side_position === 'both' || !i.side_position
      )
      const rightItems = items.filter(
        (i) => i.side_position === 'right' || i.side_position === 'both' || !i.side_position
      )

      if (leftItems.length > 0) {
        const pickedLeft = leftItems[Math.floor(Math.random() * leftItems.length)]
        if (pickedLeft) {
          leftAd.value = pickedLeft
          HttpService.post(`/affiliate/ads/${pickedLeft.id}/impression`, {}).catch(() => {})
        }
      }
      if (rightItems.length > 0) {
        const pickedRight = rightItems[Math.floor(Math.random() * rightItems.length)]
        if (pickedRight) {
          rightAd.value = pickedRight
          HttpService.post(`/affiliate/ads/${pickedRight.id}/impression`, {}).catch(() => {})
        }
      }
    }
  } catch (err) {
    console.error('Fetch vertical affiliate banners error:', err)
  }
})

const handleClick = (adItem?: VerticalAdItem | null) => {
  if (adItem?.id) {
    HttpService.post(`/affiliate/ads/${adItem.id}/click`, {}).catch(() => {})
  }
}
</script>

<template>
  <ClientOnly>
    <!-- Left Skyscraper Banner (Desktop XL only) -->
    <div
      v-if="leftAd && leftAd.image_url"
      class="hidden xl:block fixed left-4 top-[150px] z-20 transition-opacity duration-300"
    >
      <a
        :href="leftAd.target_url"
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        @click="handleClick(leftAd)"
        class="block w-[120px] 2xl:w-[160px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-black/10 hover:opacity-95 transition-all transform hover:scale-[1.01]"
      >
        <img :src="leftAd.image_url" :alt="leftAd.name" class="w-full h-full object-cover" />
      </a>
    </div>

    <!-- Right Skyscraper Banner (Desktop XL only) -->
    <div
      v-if="rightAd && rightAd.image_url"
      class="hidden xl:block fixed right-4 top-[150px] z-20 transition-opacity duration-300"
    >
      <a
        :href="rightAd.target_url"
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        @click="handleClick(rightAd)"
        class="block w-[120px] 2xl:w-[160px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-black/10 hover:opacity-95 transition-all transform hover:scale-[1.01]"
      >
        <img :src="rightAd.image_url" :alt="rightAd.name" class="w-full h-full object-cover" />
      </a>
    </div>
  </ClientOnly>
</template>
