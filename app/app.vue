<script setup lang="ts">
import { useUserStore } from '@stores/user'

const userStore = useUserStore()
userStore.initializeAuth()
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <ClientOnly>
    <UiThemeToggle />
  </ClientOnly>
</template>
