<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <ClientOnly>
    <button
      @click="toggleDark()"
      class="fixed bottom-6 right-6 z-50 p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-red-500"
      aria-label="Toggle Theme"
    >
      <span class="relative block w-5 h-5 overflow-hidden">
        <!-- Sun Icon (Visible in Light Mode) -->
        <Sun
          class="absolute inset-0 w-full h-full text-amber-500 transition-transform duration-500 rotate-0 scale-100 dark:rotate-90 dark:scale-0 group-hover:rotate-45"
          :stroke-width="2.5"
        />
        <!-- Moon Icon (Visible in Dark Mode) -->
        <Moon
          class="absolute inset-0 w-full h-full text-indigo-400 transition-transform duration-500 -rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:-rotate-12"
          :stroke-width="2.5"
        />
      </span>
    </button>
  </ClientOnly>
</template>
