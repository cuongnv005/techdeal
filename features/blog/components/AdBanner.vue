<script setup lang="ts">
// Ads banner component for Google Ads or custom sponsorships
defineProps<{
  slotId?: string
  width?: string
  height?: string
  bannerUrl?: string
  linkUrl?: string
}>()
</script>

<template>
  <div class="w-full flex justify-center py-4">
    <div
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
