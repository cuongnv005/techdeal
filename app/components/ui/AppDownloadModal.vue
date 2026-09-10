<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { X, Smartphone, Sparkles } from 'lucide-vue-next'

const props = defineProps<{
  /** Cờ bật/tắt popup từ admin (is_app_popup) */
  isAppPopup?: boolean | number
  /** Loại trang (shortlink hoặc giveaway) */
  targetType: 'shortlink' | 'giveaway'
  /** ID định danh (hash cho shortlink, id cho giveaway) để ghi log click */
  targetId?: string
}>()

const isOpen = ref(false)
const APP_STORE_URL = 'https://apps.apple.com/app/id6802750544'
const SESSION_KEY = 'techdeal_app_popup_seen'

const checkAndShow = () => {
  if (!process.client) return
  const isEnabled = props.isAppPopup === true || props.isAppPopup === 1
  if (!isEnabled) {
    isOpen.value = false
    return
  }

  const dismissed = sessionStorage.getItem(SESSION_KEY)
  if (!dismissed) {
    isOpen.value = true
  }
}

onMounted(() => {
  checkAndShow()
})

watch(
  () => props.isAppPopup,
  () => {
    checkAndShow()
  }
)

const handleClose = () => {
  isOpen.value = false
  if (process.client) {
    sessionStorage.setItem(SESSION_KEY, '1')
  }
}

const handleAppStoreClick = () => {
  if (process.client) {
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  // Gọi API ghi nhận click ngầm
  if (props.targetId) {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || ''
    const endpoint =
      props.targetType === 'shortlink'
        ? `${apiBase}/api/shortlinks/${encodeURIComponent(props.targetId)}/app-click`
        : `${apiBase}/api/giveaways/${encodeURIComponent(props.targetId)}/app-click`

    $fetch(endpoint, {
      method: 'POST',
      body: {
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      }
    }).catch(() => {
      // Bỏ qua lỗi tracking ngầm
    })
  }

  window.open(APP_STORE_URL, '_blank', 'noopener,noreferrer')
  isOpen.value = false
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
          @click.self="handleClose"
          id="app-download-modal-backdrop"
        >
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="isOpen"
              class="relative w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-[28px] overflow-hidden shadow-[10px_10px_0_rgba(0,0,0,1)] dark:shadow-[10px_10px_0_rgba(231,76,60,0.4)]"
              id="app-download-modal-card"
            >
              <!-- Nút đóng góc phải -->
              <button
                type="button"
                @click="handleClose"
                class="absolute top-3.5 right-3.5 z-10 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black text-white rounded-full transition-all duration-200 backdrop-blur-md cursor-pointer group"
                id="btn-close-app-popup"
                :title="$t('app_popup.close')"
              >
                <X class="w-4 h-4 transition-transform group-hover:rotate-90" />
              </button>

              <!-- Banner Ảnh đầu Popup -->
              <div class="relative w-full overflow-hidden bg-zinc-950 aspect-[16/9]">
                <img
                  src="/images/app/banner_app.webp"
                  alt="TechDeal iOS App"
                  class="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                ></div>
              </div>

              <!-- Nội dung Text & CTA -->
              <div class="p-6 text-center space-y-4">
                <div class="flex items-center justify-center">
                  <span
                    class="inline-flex items-center gap-1.5 bg-black dark:bg-[#e74c3c] text-white text-[10px] font-black tracking-widest uppercase px-3.5 py-1 rounded-full font-serif shadow-sm"
                  >
                    <Smartphone class="w-3.5 h-3.5" />
                    {{ $t('app_popup.badge') }}
                  </span>
                </div>

                <div class="space-y-2">
                  <h3
                    class="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug"
                  >
                    {{ $t('app_popup.title') }}
                  </h3>
                  <p
                    class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed px-2"
                  >
                    {{ $t('app_popup.desc') }}
                  </p>
                </div>

                <!-- Nút Badge App Store -->
                <div class="pt-2 flex flex-col items-center justify-center">
                  <button
                    type="button"
                    @click="handleAppStoreClick"
                    class="group inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
                    id="btn-app-store-download"
                  >
                    <img
                      src="/images/app/app_store_badge.webp"
                      :alt="$t('app_popup.cta_alt')"
                      class="h-12 w-auto object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all"
                    />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
