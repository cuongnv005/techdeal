<script setup lang="ts">
import { Cookie } from 'lucide-vue-next'

import { useCookieConsent } from '@shared/composables/use-cookie-consent'

const cookieConsent = useCookieConsent()
</script>

<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="transition-all duration-200"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="cookieConsent === null"
        class="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 flex justify-center"
      >
        <div
          class="w-full max-w-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl"
        >
          <Cookie class="w-6 h-6 text-[#3498db] dark:text-[#e74c3c] shrink-0" />
          <p class="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed flex-grow">
            TechDeal sử dụng cookie để duy trì đăng nhập và cùng các đối tác quảng cáo hiển thị nội
            dung phù hợp hơn. Xem chi tiết tại
            <NuxtLink to="/privacy" class="underline text-[#3498db] dark:text-[#e74c3c]">
              Chính sách Bảo mật
            </NuxtLink>
            .
          </p>
          <div class="w-full sm:w-auto flex gap-2 shrink-0">
            <button
              @click="cookieConsent = 'declined'"
              class="flex-1 sm:flex-none px-4 py-2.5 bg-transparent border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Từ chối
            </button>
            <button
              @click="cookieConsent = 'accepted'"
              class="flex-1 sm:flex-none px-5 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>
