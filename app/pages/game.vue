<script setup lang="ts">
import GamingPage from '@features/blog/pages/gaming.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Thế giới Game - Tin tức Game & Esports mới nhất | TechDeal',
        description:
          'Trang tin tức game, đánh giá game, esports, tin công nghệ phần cứng chơi game hàng đầu.',
        url: 'https://techdeal.io.vn/game'
      })
    }
  ]
})
</script>

<template>
  <GamingPage />
</template>
