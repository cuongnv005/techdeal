<script setup lang="ts">
import { ref } from 'vue'

import { Send } from 'lucide-vue-next'

interface Props {
  submitting?: boolean
  placeholder?: string
  mentionUsername?: string | null
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
  placeholder: 'Nhập nội dung bình luận ở đây...',
  mentionUsername: null,
  showCancel: false
})

const emit = defineEmits<{
  submit: [content: string]
  cancel: []
}>()

const content = ref(props.mentionUsername ? `@${props.mentionUsername} ` : '')

const handleSubmit = () => {
  const trimmed = content.value.trim()
  if (!trimmed) return
  emit('submit', trimmed)
  content.value = ''
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-250 dark:border-zinc-850 shadow-xs space-y-3"
  >
    <textarea
      v-model="content"
      :placeholder="placeholder"
      rows="3"
      class="w-full text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db] dark:focus:ring-[#e74c3c] resize-none"
      required
    ></textarea>
    <div class="flex items-center justify-end gap-2">
      <button
        v-if="showCancel"
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="submitting"
        class="px-5 py-2.5 bg-[#3498db] dark:bg-[#e74c3c] hover:bg-sky-600 dark:hover:bg-[#c0392b] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>{{ submitting ? 'Đang gửi...' : 'Gửi bình luận' }}</span>
        <Send class="w-4 h-4" />
      </button>
    </div>
  </form>
</template>
