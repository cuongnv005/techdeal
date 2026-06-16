<script setup lang="ts">
import BlogIndexPage from '@features/blog/pages/index.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TechDeal',
        url: 'https://techdeal.io.vn/',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://techdeal.io.vn/?search={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})
</script>

<template>
  <BlogIndexPage />
</template>
