<script setup lang="ts">
import LoginPage from '@features/auth/pages/login.page.vue'

const { t } = useI18n()
useSeoMeta({
  title: () => t('seo.login_title'),
  robots: 'noindex, nofollow'
})
</script>
<template>
  <login-page />
</template>
