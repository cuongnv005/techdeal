<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import {
  ShieldAlert,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-vue-next'

import Footer from '../../blog/components/Footer.vue'
import Header from '../../blog/components/Header.vue'
import { usePublicShortlink } from '../composables/use-shortlink'

import { useAdBreakpoint } from '@shared/composables/use-ad-breakpoint'

const route = useRoute()
const hash = computed(() => (route.params.hash as string) || '')

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const { shortlink, isLoading, error, recordClick } = usePublicShortlink(hash.value)

// Banner chỉ mount đúng breakpoint của nó — xem lý do trong use-ad-breakpoint.
const { isDesktopAd, isMobileAd } = useAdBreakpoint()

useSeoMeta({
  title: () => shortlink.value?.name || 'Đang chuyển hướng'
})

const countdown = ref(5)
const isFinished = ref(false)
const hasRedirected = ref(false)

/**
 * Resolve the target URL, converting Apple App Store deep link schemes
 * (itms-apps:// / itms-appss://) to their https:// equivalent on desktop
 * browsers to avoid "no registered handler" console warnings.
 */
const resolveTargetUrl = (url: string): string => {
  if (!process.client) return url
  // Convert Apple App Store deep link schemes to https:// on ALL platforms.
  // iOS 11+ handles https://apps.apple.com/ natively and opens the App Store
  // app automatically — the itms-apps:// / itms-appss:// custom schemes are
  // legacy and cause "no registered handler" errors on non-iOS devices
  // (including F12 device emulation). No UA sniffing needed.
  if (/^itms-appss?:\/\//i.test(url)) {
    return url.replace(/^itms-appss?:\/\//i, 'https://')
  }
  return url
}

const triggerRedirect = async () => {
  if (hasRedirected.value || !shortlink.value?.target_url) return
  hasRedirected.value = true

  // Record click to API
  const referrer = typeof document !== 'undefined' ? document.referrer : ''
  await recordClick(referrer)

  // Redirect user to target URL
  if (process.client) {
    window.location.replace(resolveTargetUrl(shortlink.value.target_url))
  }
}

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 0
      clearInterval(timer)
      isFinished.value = true
      // Không tự động chuyển hướng nữa — user phải bấm nút "Tới trang đích".
    }
  }, 1000)
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-300 relative"
  >
    <Header />

    <!-- Banner Adsterra 160x600 — 2 bên, chỉ desktop (xl trở lên). -->
    <ClientOnly>
      <div v-if="isDesktopAd" class="fixed left-4 top-[150px] z-20">
        <UiAdsterraBanner adKey="e57cbadd5a5a30233c4d746856005893" :width="160" :height="600" />
      </div>
      <div v-if="isDesktopAd" class="fixed right-4 top-[150px] z-20">
        <UiAdsterraBanner adKey="e57cbadd5a5a30233c4d746856005893" :width="160" :height="600" />
      </div>
    </ClientOnly>

    <main
      class="flex-grow py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <!-- Background decoration -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div
          class="absolute -top-40 -left-40 w-96 h-96 bg-[#3498db]/20 dark:bg-[#e74c3c]/10 rounded-full blur-3xl animate-float"
        ></div>
        <div
          class="absolute -bottom-40 -right-40 w-96 h-96 bg-[#7C3AED]/10 dark:bg-zinc-800/20 rounded-full blur-3xl"
        ></div>
      </div>

      <div class="container mx-auto max-w-xl relative z-10">
        <!-- Loading state -->
        <div
          v-if="isLoading || (!shortlink && !error)"
          class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-850 p-8 rounded-3xl text-center space-y-6 shadow-xl"
        >
          <div
            class="w-12 h-12 border-[3px] border-[#3498db] dark:border-[#e74c3c] border-t-transparent rounded-full animate-spin mx-auto"
          ></div>
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
            Đang giải mã liên kết an toàn...
          </p>
        </div>

        <!-- Error state -->
        <div
          v-else-if="error || !shortlink"
          class="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-8 rounded-[32px] text-center space-y-6 shadow-xl"
        >
          <div
            class="w-16 h-16 mx-auto bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/20"
          >
            <ShieldAlert class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-black uppercase text-zinc-900 dark:text-white">
            Liên kết không tồn tại
          </h2>
          <p class="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
            Liên kết rút gọn này không hợp lệ, đã bị gỡ bỏ hoặc đã hết hạn truy cập. Vui lòng kiểm
            tra lại đường dẫn.
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black dark:bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            Về Trang Chủ
          </NuxtLink>
        </div>

        <!-- Redirecting state -->
        <div
          v-else
          class="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850 p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center space-y-8 animate-scaleUp"
        >
          <div class="space-y-2">
            <span
              class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#3498db] dark:text-[#e74c3c] bg-[#3498db]/10 dark:bg-[#e74c3c]/10 px-3 py-1 rounded-full"
            >
              <ShieldCheck class="w-3.5 h-3.5" /> Kiểm tra an toàn
            </span>
            <h2 class="text-base font-black text-zinc-900 dark:text-white leading-tight">
              Hệ thống đang kiểm tra liên kết an toàn tới:<br />
              <span
                class="text-[#3498db] dark:text-[#e74c3c] break-all block mt-2 font-serif text-lg"
              >
                {{ shortlink.name }}
              </span>
            </h2>
          </div>

          <!-- Countdown circular layout -->
          <div class="relative w-32 h-32 mx-auto flex items-center justify-center">
            <div
              class="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-zinc-850"
            ></div>
            <div
              class="absolute inset-0 rounded-full border-4 border-[#3498db] dark:border-[#e74c3c] border-t-transparent"
              :class="{ 'animate-spin': !isFinished }"
              style="animation-duration: 2s"
            ></div>
            <div class="text-center">
              <span class="text-4xl font-serif font-black text-zinc-900 dark:text-white block">
                {{ countdown }}
              </span>
              <span class="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400"
                >giây</span
              >
            </div>
          </div>

          <div class="space-y-1">
            <p class="text-xs font-bold text-zinc-550 dark:text-zinc-350">
              Vui lòng đợi trong giây lát
            </p>
            <p class="text-[10px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Sau khi đếm ngược kết thúc, bấm nút bên dưới để tới trang đích.
            </p>
          </div>

          <!-- Manual link action block -->
          <div class="pt-4 border-t border-gray-100 dark:border-zinc-850">
            <Transition name="fade">
              <div v-if="isFinished" class="space-y-3">
                <p class="text-[10px] text-zinc-400">Bấm nút bên dưới để tiếp tục:</p>
                <a
                  href="javascript:void(0)"
                  @click="triggerRedirect"
                  class="inline-flex items-center gap-1.5 px-6 py-3 bg-zinc-900 dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-lg uppercase tracking-wider cursor-pointer"
                >
                  Tới trang đích <ArrowRight class="w-4 h-4" />
                </a>
              </div>
            </Transition>
          </div>

          <!-- Bottom Advice Tip Box -->
          <div
            class="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-100 dark:border-zinc-850 text-left flex items-start gap-3"
          >
            <HelpCircle class="w-5 h-5 text-zinc-450 shrink-0 mt-0.5" />
            <div>
              <span
                class="text-[10px] font-black uppercase text-zinc-450 tracking-wider block mb-0.5"
                >Mẹo hữu ích</span
              >
              <p class="text-[11px] text-zinc-650 dark:text-zinc-350 leading-relaxed">
                Hãy đảm bảo máy tính của bạn đủ cấu hình tối thiểu trước khi tải.
              </p>
            </div>
          </div>
        </div>

        <!-- Banner Adsterra giữa — 728x90 desktop, 300x250 mobile -->
        <ClientOnly>
          <div v-if="isDesktopAd" class="mt-8 flex justify-center w-full relative z-10">
            <UiAdsterraBanner adKey="d27b0d6bc702034be86f143c0b574ec9" :width="728" :height="90" />
          </div>
          <div v-else-if="isMobileAd" class="mt-8 flex justify-center w-full relative z-10">
            <UiAdsterraBanner adKey="de4c283a402db789fc1517d138bbe90b" :width="300" :height="250" />
          </div>
        </ClientOnly>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
