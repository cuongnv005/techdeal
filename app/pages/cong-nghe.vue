<script setup lang="ts">
import TechnologyPage from '@features/blog/pages/technology.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Công nghệ - Tin tức Công nghệ | TechDeal',
        description:
          'Chuyên mục Công nghệ: Cập nhật nhanh nhất các xu hướng công nghệ, tin tức AI, phần cứng và thế giới số.',
        url: 'https://techdeal.io.vn/cong-nghe'
      })
    }
  ]
})
</script>

<template>
  <TechnologyPage />
</template>
