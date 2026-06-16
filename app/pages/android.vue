<script setup lang="ts">
import AndroidPage from '@features/blog/pages/android.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Android - Tin tức Android | TechDeal',
        description:
          'Chuyên mục Android: Cập nhật tin tức điện thoại Android, các bản cập nhật Android 16 mới nhất, đánh giá thiết bị và thủ thuật.',
        url: 'https://techdeal.io.vn/android'
      })
    }
  ]
})
</script>

<template>
  <AndroidPage />
</template>
