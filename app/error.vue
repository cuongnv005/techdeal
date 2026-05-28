<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="h-screen w-screen grid grid-cols-1 place-content-center gap-2">
    <h1 class="text-9xl font-bold font-display text-center">{{ error?.statusCode }}</h1>
    <nuxt-link class="text-lg cursor-pointer text-center font-medium font-display underline" to="/">
      Go Home
    </nuxt-link>
  </div>
</template>
