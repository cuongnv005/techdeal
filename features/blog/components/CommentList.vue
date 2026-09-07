<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { ChevronDown, Loader2, MessageSquare } from 'lucide-vue-next'

import { blogRepository, type ApiComment, type ApiPagination } from '../api/blog'

import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'
import CommentReplies from './CommentReplies.vue'

import { useUserStore } from '@stores/user'
import ReportModal from '@features/moderation/components/ReportModal.vue'
import { moderationRepository } from '@features/moderation/api/moderation'

interface Props {
  postId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  count: [total: number]
}>()
const userStore = useUserStore()
const localePath = useLocalePath()
const { t } = useI18n()

const rootComments = ref<ApiComment[]>([])
const pagination = ref<ApiPagination | null>(null)
const loadingInitial = ref(false)
const loadingMore = ref(false)
const postingRoot = ref(false)
const postingReply = ref(false)

// Danh sách user bị chặn trong phiên hiện tại để ẩn ngay lập tức nội dung
const blockedUserIds = ref<Set<string>>(new Set())

// Report Modal state
const isReportOpen = ref(false)
const reportTargetId = ref<string>('')
const reportTargetTitle = ref<string>('')

interface ExpandedReplies {
  items: ApiComment[]
  total: number
  loading: boolean
}

const expandedReplies = ref<Record<string, ExpandedReplies>>({})

interface ReplyTarget {
  rootId: string
  replyToId: string
  replyToUsername: string
}

const replyTarget = ref<ReplyTarget | null>(null)

// Tải danh sách user bị chặn của tài khoản hiện tại khi đã đăng nhập
const loadBlockedUsers = async () => {
  if (userStore.isAuthenticated) {
    try {
      const list = await moderationRepository.getBlockedUsers()
      blockedUserIds.value = new Set(list.map((u) => String(u.id)))
    } catch (e) {
      console.error('Error fetching blocked users in comments:', e)
    }
  }
}

watch(
  () => userStore.isAuthenticated,
  (auth) => {
    if (auth) loadBlockedUsers()
  },
  { immediate: true }
)

// Lọc các comment mà author không nằm trong danh sách chặn
const visibleRootComments = computed(() => {
  return rootComments.value.filter(
    (c) => !c.author_id || !blockedUserIds.value.has(String(c.author_id))
  )
})

const hasMoreRoot = computed(
  () => !!pagination.value && pagination.value.current_page < pagination.value.total_pages
)

const fetchComments = async (page = 1, append = false) => {
  if (!props.postId) return
  if (append) loadingMore.value = true
  else loadingInitial.value = true
  try {
    const result = await blogRepository.getComments(props.postId, { page, limit: 5 })
    rootComments.value = append ? [...rootComments.value, ...result.items] : result.items
    pagination.value = result.pagination
    emit('count', result.pagination.total_items)
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

watch(
  () => props.postId,
  (id) => {
    if (id) fetchComments(1, false)
  },
  { immediate: true }
)

const loadMore = () => {
  if (!pagination.value || !hasMoreRoot.value) return
  fetchComments(pagination.value.current_page + 1, true)
}

// Trạng thái hiển thị trả lời của 1 bình luận gốc: lọc sạch các comment bị chặn
const repliesView = (root: ApiComment) => {
  const expanded = expandedReplies.value[root.id]
  if (expanded) {
    const visibleItems = expanded.items.filter(
      (c) => !c.author_id || !blockedUserIds.value.has(String(c.author_id))
    )
    return {
      items: visibleItems,
      total: visibleItems.length,
      hasMore: expanded.loading,
      loading: expanded.loading
    }
  }
  const rawItems = root.replies?.items ?? []
  const visibleItems = rawItems.filter(
    (c) => !c.author_id || !blockedUserIds.value.has(String(c.author_id))
  )
  return {
    items: visibleItems,
    total: visibleItems.length,
    hasMore: root.replies?.has_more ?? false,
    loading: false
  }
}

const expandReplies = async (root: ApiComment) => {
  if (expandedReplies.value[root.id]) return
  expandedReplies.value[root.id] = {
    items: root.replies?.items ?? [],
    total: root.replies?.total ?? 0,
    loading: true
  }
  const result = await blogRepository.getReplies(props.postId, root.id, { page: 1, limit: 100 })
  expandedReplies.value[root.id] = {
    items: result.items,
    total: result.pagination.total_items,
    loading: false
  }
}

const openReply = (comment: ApiComment) => {
  const rootId = comment.parent_comment_id ?? comment.id
  replyTarget.value = { rootId, replyToId: comment.id, replyToUsername: comment.author_name }
}

const cancelReply = () => {
  replyTarget.value = null
}

const handleLike = async (comment: ApiComment) => {
  if (!userStore.isAuthenticated) return
  const result = await blogRepository.likeComment(props.postId, comment.id)
  if (result) {
    comment.like_count = result.like_count
    comment.liked_by_me = result.liked
  }
}

const handleReportComment = (comment: ApiComment) => {
  reportTargetId.value = comment.id
  reportTargetTitle.value = `Bình luận của ${comment.author_name}: "${comment.content.slice(0, 40)}..."`
  isReportOpen.value = true
}

const handleBlockAuthor = async (comment: ApiComment) => {
  if (!comment.author_id) return
  const authorId = String(comment.author_id)
  if (!confirm(t('moderation.block_confirm', { name: comment.author_name }))) return

  try {
    const res = await moderationRepository.blockUser(authorId)
    if (res.success) {
      blockedUserIds.value.add(authorId)
      alert(t('moderation.block_success'))
    } else {
      alert(res.error || 'Lỗi khi chặn người dùng!')
    }
  } catch (e: any) {
    alert(e.message || 'Lỗi khi chặn người dùng!')
  }
}

const submitRootComment = async (content: string) => {
  postingRoot.value = true
  try {
    const created = await blogRepository.submitComment(props.postId, { content })
    if (created) {
      rootComments.value.unshift({ ...created, replies: { items: [], total: 0, has_more: false } })
      if (pagination.value) {
        pagination.value.total_items += 1
        emit('count', pagination.value.total_items)
      }
    } else {
      alert(t('comments.post_failed'))
    }
  } catch (e) {
    console.error(e)
    alert(t('comments.post_error'))
  } finally {
    postingRoot.value = false
  }
}

const submitReply = async (content: string) => {
  if (!replyTarget.value) return
  const { rootId, replyToId } = replyTarget.value
  postingReply.value = true
  try {
    const created = await blogRepository.submitComment(props.postId, {
      content,
      parentCommentId: rootId,
      replyToCommentId: replyToId
    })
    if (created) {
      const expanded = expandedReplies.value[rootId]
      if (expanded) {
        expanded.items.push(created)
        expanded.total += 1
      } else {
        const root = rootComments.value.find((r) => r.id === rootId)
        if (root?.replies) {
          root.replies.items.push(created)
          if (root.replies.items.length > 3) root.replies.items.shift()
          root.replies.total += 1
          root.replies.has_more = root.replies.total > 3
        }
      }
      replyTarget.value = null
    } else {
      alert(t('comments.reply_failed'))
    }
  } catch (e) {
    console.error(e)
    alert(t('comments.reply_error'))
  } finally {
    postingReply.value = false
  }
}
</script>

<template>
  <div class="space-y-6 pt-6">
    <h3
      class="text-lg font-black uppercase text-zinc-900 dark:text-white tracking-tight flex items-center gap-2"
    >
      <MessageSquare class="w-5 h-5 text-[#3498db] dark:text-[#e74c3c]" />
      {{ $t('comments.title') }}{{ pagination ? ` (${pagination.total_items})` : '' }}
    </h3>

    <CommentForm
      v-if="userStore.isAuthenticated"
      :submitting="postingRoot"
      @submit="submitRootComment"
    />
    <div
      v-else
      class="bg-blue-50 dark:bg-zinc-900/60 p-6 rounded-2xl border border-dashed border-blue-200 dark:border-zinc-800 text-center space-y-3"
    >
      <p class="text-xs text-zinc-600 dark:text-zinc-400">
        {{ $t('comments.login_required') }}
      </p>
      <NuxtLink
        :to="localePath('/login')"
        class="inline-block px-5 py-2.5 bg-[#3498db] hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
      >
        {{ $t('comments.login_now') }}
      </NuxtLink>
    </div>

    <div
      v-if="loadingInitial"
      class="text-center py-8 text-xs text-zinc-400 flex items-center justify-center gap-2"
    >
      <Loader2 class="w-4 h-4 animate-spin" />
      {{ $t('comments.loading') }}
    </div>

    <div
      v-else-if="visibleRootComments.length === 0"
      class="text-center py-8 text-xs text-zinc-400"
    >
      {{ $t('comments.empty') }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="root in visibleRootComments"
        :key="root.id"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-150 dark:border-zinc-900 space-y-4"
      >
        <CommentItem
          :comment="root"
          :is-authenticated="userStore.isAuthenticated"
          :current-user-id="userStore.id || undefined"
          @reply="openReply"
          @like="handleLike"
          @report="handleReportComment"
          @block="handleBlockAuthor"
        />

        <CommentReplies
          :items="repliesView(root).items"
          :total="repliesView(root).total"
          :has-more="repliesView(root).hasMore"
          :loading="repliesView(root).loading"
          :is-authenticated="userStore.isAuthenticated"
          :current-user-id="userStore.id || undefined"
          @expand="expandReplies(root)"
          @reply="openReply"
          @like="handleLike"
          @report="handleReportComment"
          @block="handleBlockAuthor"
        />

        <CommentForm
          v-if="replyTarget?.rootId === root.id"
          :key="replyTarget.replyToId"
          :submitting="postingReply"
          show-cancel
          :placeholder="$t('comments.reply_placeholder')"
          :mention-username="
            replyTarget.replyToId !== replyTarget.rootId ? replyTarget.replyToUsername : null
          "
          @submit="submitReply"
          @cancel="cancelReply"
        />
      </div>

      <button
        v-if="hasMoreRoot"
        @click="loadMore"
        :disabled="loadingMore"
        class="w-full py-2.5 text-xs font-bold text-[#3498db] dark:text-[#e74c3c] hover:underline flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
      >
        <Loader2 v-if="loadingMore" class="w-3.5 h-3.5 animate-spin" />
        <ChevronDown v-else class="w-3.5 h-3.5" />
        {{ loadingMore ? $t('comments.loading_short') : $t('comments.load_more') }}
      </button>
    </div>

    <!-- Report Modal for Comments -->
    <ReportModal
      v-model:open="isReportOpen"
      target-type="comment"
      :target-id="reportTargetId"
      :target-title="reportTargetTitle"
    />
  </div>
</template>
