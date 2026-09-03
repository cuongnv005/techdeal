<script setup lang="ts">
import { AlertTriangle, Clock, RefreshCw } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  message?: string
  showRetry?: boolean
}>()

const isReloading = ref(false)

const handleReload = () => {
  if (process.client) {
    isReloading.value = true
    window.location.reload()
  }
}
</script>

<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 text-slate-800 dark:text-zinc-100 select-none z-[9999]"
  >
    <div
      class="w-full max-w-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center animate-fade-in"
    >
      <!-- Image container -->
      <div class="relative w-full max-w-[280px] sm:max-w-[340px] mb-6 drop-shadow-md">
        <img
          src="/images/maintenance.png"
          alt="System Under Maintenance"
          class="w-full h-auto object-contain mx-auto"
          loading="eager"
        />
      </div>

      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold mb-4"
      >
        <Clock class="w-4 h-4 animate-spin-slow" />
        <span>{{ $t('error.maintenance.badge') }}</span>
      </div>

      <!-- Heading -->
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 font-display">
        {{ title || $t('error.maintenance.title') }}
      </h1>

      <!-- Description -->
      <p
        class="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-md mb-8"
      >
        {{ message || $t('error.maintenance.desc') }}
      </p>

      <!-- Reassurance Card -->
      <div
        class="w-full p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/50 mb-8 flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-zinc-400"
      >
        <AlertTriangle class="w-4 h-4 text-amber-500 shrink-0" />
        <span>{{ $t('error.maintenance.reassurance') }}</span>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <button
          v-if="showRetry !== false"
          type="button"
          @click="handleReload"
          :disabled="isReloading"
          class="w-full sm:w-auto px-6 py-3 bg-[#3498db] hover:bg-[#2980b9] dark:bg-[#e74c3c] dark:hover:bg-[#c0392b] text-white text-sm font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isReloading }" />
          <span>{{
            isReloading ? $t('error.maintenance.retrying') : $t('error.maintenance.retry')
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
