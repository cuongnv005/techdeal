<script setup lang="ts">
import { ref } from 'vue'
import {
  Gift,
  Mail,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  RefreshCw
} from 'lucide-vue-next'
import { giveawayRepository, type GiveawayWaitlistResult } from '../api/giveaway'

const { t } = useI18n()

const email = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const result = ref<GiveawayWaitlistResult | null>(null)

const APP_STORE_URL = 'https://apps.apple.com/app/id6802750544'

const handleSubmit = async () => {
  errorMessage.value = ''
  const trimmed = email.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!trimmed || !emailRegex.test(trimmed)) {
    errorMessage.value = t('giveaway_waitlist.invalid_email')
    return
  }

  try {
    isSubmitting.value = true
    const res = await giveawayRepository.joinWaitlist(trimmed)
    result.value = res
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.error || err?.message || t('giveaway_waitlist.invalid_email')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-amber-500/30 dark:border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-white to-blue-500/5 dark:from-amber-950/20 dark:via-zinc-900 dark:to-blue-950/20 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md"
  >
    <!-- Background subtle glow -->
    <div
      class="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"
    ></div>

    <!-- FORM STATE: CHƯA ĐĂNG KÝ -->
    <div v-if="!result" class="relative z-10 space-y-4">
      <!-- Badge & Title -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5">
          <span
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs"
          >
            <Sparkles class="w-3 h-3" />
            {{ $t('giveaway_waitlist.badge') }}
          </span>
        </div>
        <h3
          class="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2 tracking-tight"
        >
          <Gift class="w-5 h-5 text-amber-500 shrink-0" />
          {{ $t('giveaway_waitlist.title') }}
        </h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {{ $t('giveaway_waitlist.subtitle') }}
        </p>
      </div>

      <!-- Form Input -->
      <form @submit.prevent="handleSubmit" class="space-y-2.5 pt-1">
        <div class="relative">
          <Mail
            class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
          />
          <input
            v-model="email"
            type="email"
            required
            :placeholder="$t('giveaway_waitlist.email_placeholder')"
            class="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            :disabled="isSubmitting"
          />
        </div>

        <p v-if="errorMessage" class="text-[11px] font-bold text-red-500 animate-shake">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"
        >
          <RefreshCw v-if="isSubmitting" class="w-3.5 h-3.5 animate-spin" />
          <ArrowRight v-else class="w-3.5 h-3.5" />
          <span>{{
            isSubmitting
              ? $t('giveaway_waitlist.btn_submitting')
              : $t('giveaway_waitlist.btn_submit')
          }}</span>
        </button>
      </form>
    </div>

    <!-- SUCCESS STATE: ĐÃ ĐĂNG KÝ / TRA CỨU -->
    <div v-else class="relative z-10 space-y-4">
      <!-- Success Header -->
      <div class="flex items-center gap-2">
        <div
          class="p-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg"
        >
          <CheckCircle2 class="w-5 h-5" />
        </div>
        <div>
          <span
            class="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
          >
            {{
              result.is_existing
                ? $t('giveaway_waitlist.existing_badge')
                : $t('giveaway_waitlist.success_badge')
            }}
          </span>
          <h4 class="text-sm font-bold text-zinc-900 dark:text-white">
            {{ result.email }}
          </h4>
        </div>
      </div>

      <!-- Queue Card Highlight -->
      <div
        class="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs rounded-xl p-4 border border-amber-500/30 dark:border-amber-500/20 text-center space-y-2 shadow-xs"
      >
        <p class="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {{ $t('giveaway_waitlist.queue_text', { queue: result.queue_number }) }}
        </p>
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
        >
          <Sparkles class="w-4 h-4 text-amber-500 animate-pulse" />
          <span class="text-sm font-black uppercase tracking-wide">
            {{ $t('giveaway_waitlist.batch_text', { batch: result.batch_number }) }}
          </span>
        </div>
        <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1">
          {{ $t('giveaway_waitlist.email_notice', { email: result.email }) }}
        </p>
      </div>

      <!-- App Download Prompt (Call-to-Action) -->
      <div
        class="rounded-xl border border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 space-y-2.5 text-center"
      >
        <div class="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400">
          <Smartphone class="w-4 h-4 shrink-0" />
          <h5 class="text-xs font-extrabold tracking-tight">
            {{ $t('giveaway_waitlist.app_prompt_title') }}
          </h5>
        </div>
        <p class="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {{ $t('giveaway_waitlist.app_prompt_desc') }}
        </p>

        <!-- App Store Official Badge -->
        <div class="pt-1">
          <a
            :href="APP_STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block transition-transform duration-200 hover:scale-105 active:scale-95 shadow-sm rounded-lg overflow-hidden"
          >
            <img
              src="/images/app/app_store_badge.webp"
              alt="Download on the App Store"
              class="h-10 w-auto object-contain mx-auto"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
