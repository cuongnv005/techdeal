<script setup lang="ts">
import IosPage from '@features/blog/pages/ios.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'iOS - Tin tức Apple | TechDeal',
        description:
          'Chuyên mục iOS: Cập nhật tin tức iPhone, iPad, các bản cập nhật iOS mới nhất, thủ thuật sử dụng và đánh giá ứng dụng Apple.',
        url: 'https://techdeal.io.vn/ios'
      })
    }
  ]
})
</script>

<template>
  <IosPage />
</template>
