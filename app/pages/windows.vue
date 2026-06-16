<script setup lang="ts">
import WindowsPage from '@features/blog/pages/windows.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Windows - Tin tức Windows | TechDeal',
        description:
          'Chuyên mục Windows: Cập nhật thủ thuật Windows 11, tin tức hệ điều hành Microsoft, ứng dụng PC và hiệu năng phần cứng.',
        url: 'https://techdeal.io.vn/windows'
      })
    }
  ]
})
</script>

<template>
  <WindowsPage />
</template>
