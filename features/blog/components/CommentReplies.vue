<script setup lang="ts">
import { ChevronDown, Loader2 } from 'lucide-vue-next'

import CommentItem from './CommentItem.vue'

import type { ApiComment } from '../api/blog'

interface Props {
  items: ApiComment[]
  total: number
  hasMore: boolean
  loading?: boolean
  isAuthenticated: boolean
  currentUserId?: string
}

defineProps<Props>()

const emit = defineEmits<{
  expand: []
  reply: [comment: ApiComment]
  like: [comment: ApiComment]
  report: [comment: ApiComment]
  block: [comment: ApiComment]
}>()
</script>

<template>
  <div v-if="items.length > 0" class="pl-12 space-y-4">
    <CommentItem
      v-for="reply in items"
      :key="reply.id"
      :comment="reply"
      :is-authenticated="isAuthenticated"
      :current-user-id="currentUserId"
      @reply="emit('reply', $event)"
      @like="emit('like', $event)"
      @report="emit('report', $event)"
      @block="emit('block', $event)"
    />

    <button
      v-if="hasMore"
      @click="emit('expand')"
      :disabled="loading"
      class="text-[11px] font-bold text-[#3498db] dark:text-[#e74c3c] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
    >
      <Loader2 v-if="loading" class="w-3 h-3 animate-spin" />
      <ChevronDown v-else class="w-3 h-3" />
      {{
        loading
          ? $t('comments.loading_short')
          : $t('comments.load_more_replies', { count: total - items.length })
      }}
    </button>
  </div>
</template>
