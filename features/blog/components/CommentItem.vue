<script setup lang="ts">
import { computed } from 'vue'

import { Heart, Flag, Ban } from 'lucide-vue-next'

import type { ApiComment } from '../api/blog'

interface Props {
  comment: ApiComment
  isAuthenticated: boolean
  currentUserId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reply: [comment: ApiComment]
  like: [comment: ApiComment]
  report: [comment: ApiComment]
  block: [comment: ApiComment]
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'

const avatar = computed(() => props.comment.author_avatar || DEFAULT_AVATAR)

const formattedDate = computed(() =>
  new Date(props.comment.created_at).toLocaleString(locale.value === 'en' ? 'en-US' : 'vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh'
  })
)

// Chỉ hiện "@username" khi trả lời 1 trả lời cấp 2 khác - không hiện khi trả lời thẳng vào gốc
// (reply_to_comment_id === parent_comment_id trong trường hợp đó, xem docs/WEB/comments-upgrade-plan.md §4.3)
const showMention = computed(
  () =>
    !!props.comment.reply_to &&
    props.comment.reply_to.comment_id !== props.comment.parent_comment_id
)

const isSelf = computed(() => {
  return (
    props.currentUserId &&
    props.comment.author_id &&
    String(props.currentUserId) === String(props.comment.author_id)
  )
})
</script>

<template>
  <div class="flex gap-3.5">
    <NuxtLink :to="localePath(`/user/${comment.author_id}`)" class="shrink-0 block">
      <img
        :src="avatar"
        :alt="comment.author_name"
        class="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-zinc-850 hover:opacity-80 transition-opacity"
      />
    </NuxtLink>
    <div class="flex-grow space-y-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <NuxtLink
          :to="localePath(`/user/${comment.author_id}`)"
          class="hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors"
        >
          <h5 class="text-xs font-bold text-zinc-900 dark:text-white">
            {{ comment.author_name }}
          </h5>
        </NuxtLink>
        <span class="text-[10px] text-zinc-400 shrink-0">{{ formattedDate }}</span>
      </div>
      <p class="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed break-words">
        <span v-if="showMention" class="text-[#3498db] dark:text-[#e74c3c] font-bold">
          @{{ comment.reply_to?.username }}
        </span>
        {{ comment.content }}
      </p>

      <div v-if="isAuthenticated" class="pt-1 flex items-center gap-4 flex-wrap">
        <button
          @click="emit('like', comment)"
          class="text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
          :class="comment.liked_by_me ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'"
        >
          <Heart class="w-3 h-3" :fill="comment.liked_by_me ? 'currentColor' : 'none'" />
          {{ $t('comments.like') }}{{ comment.like_count > 0 ? ` (${comment.like_count})` : '' }}
        </button>
        <button
          @click="emit('reply', comment)"
          class="text-[10px] font-bold text-zinc-500 hover:text-[#3498db] dark:hover:text-[#e74c3c] transition-colors cursor-pointer"
        >
          {{ $t('comments.reply') }}
        </button>

        <button
          v-if="!isSelf"
          @click="emit('report', comment)"
          class="text-[10px] font-bold text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-1 cursor-pointer ml-auto"
          :title="$t('moderation.report_btn')"
        >
          <Flag class="w-3 h-3" />
          {{ $t('moderation.report_btn') }}
        </button>

        <button
          v-if="!isSelf && comment.author_id"
          @click="emit('block', comment)"
          class="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
          :title="$t('moderation.block_user_btn')"
        >
          <Ban class="w-3 h-3" />
          {{ $t('moderation.block_user_btn') }}
        </button>
      </div>
    </div>
  </div>
</template>
