<script setup lang="ts">
import { ref, computed } from 'vue'
import { Flag, Loader2, X, ShieldAlert } from 'lucide-vue-next'
import { moderationRepository, type TargetType } from '../api/moderation'

interface Props {
  open: boolean
  targetType: TargetType
  targetId: string | number
  targetTitle?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  reported: []
}>()

const { t } = useI18n()

const REASONS = [
  { value: 'spam', key: 'moderation.reasons.spam' },
  { value: 'harassment', key: 'moderation.reasons.harassment' },
  { value: 'hate_speech', key: 'moderation.reasons.hate_speech' },
  { value: 'inappropriate', key: 'moderation.reasons.inappropriate' },
  { value: 'fraud', key: 'moderation.reasons.fraud' },
  { value: 'other', key: 'moderation.reasons.other' }
]

const selectedReason = ref('')
const details = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const close = () => {
  emit('update:open', false)
  selectedReason.value = ''
  details.value = ''
  errorMessage.value = ''
}

const handleSubmit = async () => {
  if (!selectedReason.value) {
    errorMessage.value = t('moderation.select_reason_error')
    return
  }

  if (selectedReason.value === 'other' && details.value.trim().length < 10) {
    errorMessage.value = t('moderation.detail_min_error')
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const res = await moderationRepository.submitReport({
      target_type: props.targetType,
      target_id: props.targetId,
      reason: selectedReason.value,
      details: details.value.trim() || undefined
    })

    if (res.success) {
      alert(t('moderation.report_success'))
      emit('reported')
      close()
    } else {
      errorMessage.value = res.error || 'Có lỗi xảy ra khi gửi báo cáo!'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Có lỗi xảy ra!'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-5 border-b border-gray-150 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50"
      >
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Flag class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              {{ $t('moderation.report_title') }}
            </h3>
            <p v-if="targetTitle" class="text-[11px] text-zinc-400 line-clamp-1 max-w-[260px]">
              {{ targetTitle }}
            </p>
          </div>
        </div>
        <button
          @click="close"
          class="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          {{ $t('moderation.report_desc') }}
        </p>

        <!-- 24-Hour Moderation Commitment Banner -->
        <div
          class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2"
        >
          <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p class="text-[11px] font-medium text-amber-900 dark:text-amber-400 leading-relaxed">
            {{ $t('moderation.action_24h_notice') }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {{ $t('moderation.reason_label') }}
          </label>
          <div class="space-y-1.5">
            <label
              v-for="r in REASONS"
              :key="r.value"
              class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-xs"
              :class="
                selectedReason === r.value
                  ? 'border-[#3498db] bg-[#3498db]/5 dark:border-[#e74c3c] dark:bg-[#e74c3c]/5 text-zinc-900 dark:text-white font-bold'
                  : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              "
            >
              <input
                type="radio"
                name="report_reason"
                :value="r.value"
                v-model="selectedReason"
                class="accent-[#3498db] dark:accent-[#e74c3c]"
              />
              <span>{{ $t(r.key) }}</span>
            </label>
          </div>
        </div>

        <!-- Expanded Details if reason is 'other' -->
        <div v-if="selectedReason === 'other'" class="space-y-1.5 animate-fadeIn">
          <label class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {{ $t('moderation.detail_label') }}
          </label>
          <textarea
            v-model="details"
            :placeholder="$t('moderation.detail_placeholder')"
            rows="3"
            class="w-full text-xs p-3 border border-gray-250 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#3498db]"
          ></textarea>
        </div>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-xs font-bold text-red-500">
          {{ errorMessage }}
        </p>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="close"
            class="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {{ $t('moderation.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !selectedReason"
            class="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span v-else>{{ $t('moderation.submit') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.15s ease-out forwards;
}
.animate-scaleUp {
  animation: scaleUp 0.15s ease-out forwards;
}
</style>
