<script setup lang="ts">
import { onMounted } from 'vue'

// Ads banner component for Google Ads or custom sponsorships
const props = withDefaults(
  defineProps<{
    slotId?: string
    width?: string
    height?: string
    bannerUrl?: string
    linkUrl?: string
    isGoogleAd?: boolean
    adFormat?: string
  }>(),
  {
    isGoogleAd: false,
    adFormat: 'auto',
    slotId: '1234567890'
  }
)

onMounted(() => {
  if (props.isGoogleAd) {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.warn('Google Adsense push error:', e)
    }
  }
})
</script>

<template>
  <div class="w-full flex justify-center py-4">
    <!-- Google AdSense Mode -->
    <div
      v-if="isGoogleAd"
      class="w-full flex flex-col items-center justify-center overflow-hidden bg-gray-100/50 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-2 select-none min-h-[90px] relative group/ad"
      :style="{ maxWidth: width || '970px', minHeight: height || '90px' }"
    >
      <!-- Visual Indicator for Local Testing -->
      <span class="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 z-10">
        Google Ad (Test Mode)
      </span>
      
      <!-- Actual Google Ins Element -->
      <ins
        class="adsbygoogle"
        style="display:block; width:100%;"
        :style="{ height: height || 'auto' }"
        data-ad-client="ca-pub-3940256099942544"
        :data-ad-slot="slotId"
        :data-ad-format="adFormat"
        data-full-width-responsive="true"
      ></ins>

      <!-- Mock Banner Fallback displayed when Google Ads is unfilled or blocked -->
      <div 
        class="ad-mock-fallback absolute inset-0 bg-gray-200/80 dark:bg-zinc-800/80 flex items-center justify-center pointer-events-none transition-opacity duration-300 opacity-100"
      >
        <div class="text-center p-4">
          <p class="text-xs font-bold text-gray-600 dark:text-gray-300">Google Test Ad Placement</p>
          <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Size: {{ width || '100%' }} x {{ height || 'Auto' }}</p>
        </div>
      </div>
    </div>

    <!-- Custom Banner/Sponsorship Mode -->
    <div
      v-else
      class="relative overflow-hidden bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-center text-xs text-gray-400 select-none group"
      :style="{ maxWidth: width || '970px', height: height || '90px', width: '100%' }"
    >
      <a
        v-if="linkUrl && bannerUrl"
        :href="linkUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full h-full block"
      >
        <img :src="bannerUrl" alt="Advertisement" class="w-full h-full object-cover" />
      </a>
      <div v-else class="flex flex-col items-center gap-1">
        <span
          class="font-bold text-[10px] tracking-wider uppercase bg-gray-250 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400"
        >
          Advertisement
        </span>
        <span class="text-gray-400 dark:text-gray-500"
          >Google AdSense Slot ({{ width || '970' }}x{{ height || '90' }})</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide the placeholder block if Google AdSense loaded an ad successfully */
ins.adsbygoogle[data-adsbygoogle-status="done"] ~ .ad-mock-fallback,
ins.adsbygoogle[data-ad-status="filled"] ~ .ad-mock-fallback {
  display: none !important;
}
</style>

