<script setup lang="ts">
import RegisterPage from '@features/auth/pages/register.page.vue'

const { t } = useI18n()
useSeoMeta({
  title: () => t('seo.register_title'),
  robots: 'noindex, nofollow'
})
</script>
<template>
  <RegisterPage />
</template>
