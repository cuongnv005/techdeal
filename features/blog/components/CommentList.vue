<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { ChevronDown, Loader2, MessageSquare } from 'lucide-vue-next'

import { blogRepository, type ApiComment, type ApiPagination } from '../api/blog'

import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'
import CommentReplies from './CommentReplies.vue'

import { useUserStore } from '@stores/user'

interface Props {
  postId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  count: [total: number]
}>()
const userStore = useUserStore()

const rootComments = ref<ApiComment[]>([])
const pagination = ref<ApiPagination | null>(null)
const loadingInitial = ref(false)
const loadingMore = ref(false)
const postingRoot = ref(false)
const postingReply = ref(false)

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

// Trạng thái hiển thị trả lời của 1 bình luận gốc: dùng preview từ API list cho tới khi user
// bấm "Xem thêm trả lời" (expandedReplies), lúc đó thay bằng toàn bộ trả lời tải riêng
const repliesView = (root: ApiComment) => {
  const expanded = expandedReplies.value[root.id]
  if (expanded) {
    return {
      items: expanded.items,
      total: expanded.total,
      hasMore: expanded.loading,
      loading: expanded.loading
    }
  }
  return {
    items: root.replies?.items ?? [],
    total: root.replies?.total ?? 0,
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
      alert('Không thể gửi bình luận. Vui lòng kiểm tra lại trạng thái đăng nhập.')
    }
  } catch (e) {
    console.error(e)
    alert('Có lỗi xảy ra khi gửi bình luận!')
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
      alert('Không thể gửi trả lời. Vui lòng kiểm tra lại trạng thái đăng nhập.')
    }
  } catch (e) {
    console.error(e)
    alert('Có lỗi xảy ra khi gửi trả lời!')
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
      Bình luận{{ pagination ? ` (${pagination.total_items})` : '' }}
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
        Bạn cần đăng nhập để gửi ý kiến phản hồi về bài viết này.
      </p>
      <NuxtLink
        to="/login"
        class="inline-block px-5 py-2.5 bg-[#3498db] hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
      >
        Đăng nhập ngay
      </NuxtLink>
    </div>

    <div
      v-if="loadingInitial"
      class="text-center py-8 text-xs text-zinc-400 flex items-center justify-center gap-2"
    >
      <Loader2 class="w-4 h-4 animate-spin" />
      Đang tải bình luận...
    </div>

    <div v-else-if="rootComments.length === 0" class="text-center py-8 text-xs text-zinc-400">
      Chưa có bình luận nào. Hãy là người đầu tiên!
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="root in rootComments"
        :key="root.id"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-150 dark:border-zinc-900 space-y-4"
      >
        <CommentItem
          :comment="root"
          :is-authenticated="userStore.isAuthenticated"
          @reply="openReply"
          @like="handleLike"
        />

        <CommentReplies
          :items="repliesView(root).items"
          :total="repliesView(root).total"
          :has-more="repliesView(root).hasMore"
          :loading="repliesView(root).loading"
          :is-authenticated="userStore.isAuthenticated"
          @expand="expandReplies(root)"
          @reply="openReply"
          @like="handleLike"
        />

        <CommentForm
          v-if="replyTarget?.rootId === root.id"
          :key="replyTarget.replyToId"
          :submitting="postingReply"
          show-cancel
          placeholder="Viết trả lời của bạn..."
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
        {{ loadingMore ? 'Đang tải...' : 'Xem thêm bình luận' }}
      </button>
    </div>
  </div>
</template>
