<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ShieldAlert, UserX, Loader2, CheckCircle2 } from 'lucide-vue-next'
import { moderationRepository, type BlockedUser } from '../api/moderation'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'unblocked', userId: string): void
}>()

const { t } = useI18n()

const blockedUsers = ref<BlockedUser[]>([])
const isLoading = ref(false)
const unblockingId = ref<string | null>(null)
const errorMsg = ref('')

const fetchBlockedUsers = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    blockedUsers.value = await moderationRepository.getBlockedUsers()
  } catch (err: any) {
    errorMsg.value = err.message || 'Không thể tải danh sách đã chặn'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      fetchBlockedUsers()
    }
  }
)

const handleUnblock = async (user: BlockedUser) => {
  if (!confirm(t('moderation.unblock_confirm', { name: user.display_name || user.username }))) {
    return
  }

  unblockingId.value = user.id
  try {
    const res = await moderationRepository.unblockUser(user.id)
    if (res.success) {
      blockedUsers.value = blockedUsers.value.filter((u) => u.id !== user.id)
      emit('unblocked', user.id)
    } else {
      alert(res.error || 'Lỗi khi bỏ chặn người dùng!')
    }
  } catch (err: any) {
    alert(err.message || 'Lỗi khi bỏ chặn người dùng!')
  } finally {
    unblockingId.value = null
  }
}

const close = () => {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 flex items-center justify-center shrink-0"
            >
              <ShieldAlert class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-zinc-900 dark:text-white">
                {{ $t('moderation.blocked_users_title') || 'Danh sách người dùng đã chặn' }}
              </h3>
              <p class="text-[11px] text-zinc-500">
                {{ $t('moderation.blocked_users_desc') || 'Quản lý những người dùng bạn đã chặn' }}
              </p>
            </div>
          </div>
          <button
            @click="close"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 overflow-y-auto flex-1 space-y-3">
          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-12 text-zinc-400"
          >
            <Loader2 class="w-7 h-7 animate-spin text-[#3498db] mb-2" />
            <p class="text-xs">{{ $t('common.loading') || 'Đang tải...' }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMsg" class="text-center py-8 text-red-500 text-xs">
            <p>{{ errorMsg }}</p>
            <button
              @click="fetchBlockedUsers"
              class="mt-3 px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 font-bold hover:bg-gray-200"
            >
              {{ $t('common.retry') || 'Thử lại' }}
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="blockedUsers.length === 0"
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <div
              class="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3"
            >
              <UserX class="w-6 h-6" />
            </div>
            <p class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {{ $t('moderation.no_blocked_users') || 'Bạn chưa chặn người dùng nào' }}
            </p>
            <p class="text-[11px] text-zinc-500 mt-1 max-w-xs">
              {{
                $t('moderation.no_blocked_users_desc') ||
                'Khi chặn ai đó, họ sẽ không thể tương tác hoặc xuất hiện trong bảng tin của bạn.'
              }}
            </p>
          </div>

          <!-- Users List -->
          <div v-else class="space-y-2">
            <div
              v-for="user in blockedUsers"
              :key="user.id"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/80 hover:border-gray-200 dark:hover:border-zinc-700 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="
                    user.avatar_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'
                  "
                  alt="avatar"
                  class="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
                />
                <div class="min-w-0">
                  <p class="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {{ user.display_name || user.username }}
                  </p>
                  <p class="text-[10px] text-zinc-500 truncate">@{{ user.username }}</p>
                </div>
              </div>

              <button
                @click="handleUnblock(user)"
                :disabled="unblockingId === user.id"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-gray-200 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Loader2 v-if="unblockingId === user.id" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ $t('moderation.unblock_user_btn') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 flex justify-end"
        >
          <button
            @click="close"
            class="px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
