<script setup lang="ts">
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
  <ClientOnly>
    <LazyUiThemeToggle />
  </ClientOnly>
</template>
