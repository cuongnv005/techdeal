<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed } from 'vue'

import MaintenanceView from '~/components/ui/MaintenanceView.vue'

const props = defineProps({
  error: Object as () => NuxtError
})

// Kiểm tra xem lỗi có phải do Backend sập / D1 row read limit / Network failure / 500 / 502 / 503 / 504 không
const isBackendOrD1Down = computed(() => {
  if (!props.error) return false
  const status = Number(props.error.statusCode)
  const msg = (props.error.message || props.error.statusMessage || '').toLowerCase()

  // Kiểm tra HTTP status codes liên quan đến backend sập / gateway / timeout / service unavailable
  if ([500, 502, 503, 504].includes(status)) {
    return true
  }

  // Kiểm tra nội dung message liên quan đến D1 row read, database, network hoặc timeout
  if (
    msg.includes('d1') ||
    msg.includes('row read') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('network error') ||
    msg.includes('econnrefused') ||
    msg.includes('etimedout') ||
    msg.includes('failed to fetch')
  ) {
    return true
  }

  return false
})

const handleErrorClear = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="w-full min-h-screen">
    <!-- Trường hợp backend sập, vượt D1 row read, hoặc server error (500, 502, 503, 504) -->
    <MaintenanceView v-if="isBackendOrD1Down" :show-retry="true" />

    <!-- Các lỗi khác (ví dụ: 404 Not Found) -->
    <div
      v-else
      class="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100"
    >
      <div class="max-w-md w-full text-center space-y-6">
        <h1
          class="text-8xl font-black font-display tracking-tight text-[#3498db] dark:text-[#e74c3c]"
        >
          {{ error?.statusCode || 404 }}
        </h1>
        <div class="space-y-2">
          <h2 class="text-xl font-bold">
            {{
              error?.statusCode === 404
                ? $t('error.page_not_found')
                : $t('error.something_went_wrong')
            }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-zinc-400">
            {{
              error?.statusCode === 404
                ? $t('error.page_not_found_desc')
                : error?.statusMessage || error?.message || $t('error.something_went_wrong')
            }}
          </p>
        </div>
        <button
          type="button"
          @click="handleErrorClear"
          class="inline-flex items-center justify-center px-6 py-3 bg-[#3498db] hover:bg-[#2980b9] dark:bg-[#e74c3c] dark:hover:bg-[#c0392b] text-white text-sm font-semibold rounded-2xl transition-all shadow-md cursor-pointer"
        >
          {{ $t('error.go_home') }}
        </button>
      </div>
    </div>
  </div>
</template>
