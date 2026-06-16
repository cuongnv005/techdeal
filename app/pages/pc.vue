<script setup lang="ts">
import PcPage from '@features/blog/pages/pc.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'PC máy tính - Tin tức PC | TechDeal',
        description:
          'Chuyên mục PC máy tính: Cập nhật tin tức phần cứng máy tính và linh kiện PC mới nhất.',
        url: 'https://techdeal.io.vn/pc'
      })
    }
  ]
})
</script>

<template>
  <PcPage />
</template>
