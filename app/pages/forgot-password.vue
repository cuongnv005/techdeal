<script setup lang="ts">
import ForgotPasswordPage from '@features/auth/pages/forgot-password.page.vue'

const { t } = useI18n()
useSeoMeta({
  title: () => t('seo.forgot_password_title'),
  robots: 'noindex, nofollow'
})
</script>
<template>
  <ForgotPasswordPage />
</template>
