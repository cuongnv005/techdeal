<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useRoute } from '#app'
import { Flag, Ban, ShieldAlert } from 'lucide-vue-next'

import UserAvatar from '../components/UserAvatar.vue'
import UserPostList from '../components/UserPostList.vue'
import UserProfileInfo from '../components/UserProfileInfo.vue'
import { useUser } from '../composables/use-user'

import type { UserProfile } from '../types/user.type'

import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'
import { useUserStore } from '@stores/user'
import ReportModal from '@features/moderation/components/ReportModal.vue'
import BlockedUsersModal from '@features/moderation/components/BlockedUsersModal.vue'
import { moderationRepository } from '@features/moderation/api/moderation'

const route = useRoute()
const authorIdParam = route.params.id as string
const userStore = useUserStore()
const { t } = useI18n()

// Composable setup
const { profileData, isLoading, error, page, updateProfile } = useUser(authorIdParam)

const isOwner = computed(() => {
  return userStore.isAuthenticated && userStore.id === authorIdParam
})

const isReportUserOpen = ref(false)
const isBlockedUsersOpen = ref(false)
const isBlocked = ref(false)

const checkBlockedStatus = async () => {
  if (userStore.isAuthenticated && !isOwner.value) {
    try {
      const blockedList = await moderationRepository.getBlockedUsers()
      isBlocked.value = blockedList.some((u) => String(u.id) === String(authorIdParam))
    } catch (e) {
      console.error('Error checking blocked status:', e)
    }
  }
}

watch(
  () => userStore.isAuthenticated,
  (auth) => {
    if (auth) checkBlockedStatus()
  },
  { immediate: true }
)

const handleBlockUser = async () => {
  if (
    !confirm(
      t('moderation.block_confirm', {
        name: profileWithEmail.value.full_name || profileWithEmail.value.username
      })
    )
  )
    return
  try {
    const res = await moderationRepository.blockUser(authorIdParam)
    if (res.success) {
      isBlocked.value = true
      alert(t('moderation.block_success'))
    } else {
      alert(res.error || 'Lỗi khi chặn người dùng!')
    }
  } catch (e: any) {
    alert(e.message || 'Lỗi khi chặn người dùng!')
  }
}

const handleUnblockUser = async () => {
  try {
    const res = await moderationRepository.unblockUser(authorIdParam)
    if (res.success) {
      isBlocked.value = false
      alert(t('moderation.unblock_success'))
    } else {
      alert(res.error || 'Lỗi khi bỏ chặn người dùng!')
    }
  } catch (e: any) {
    alert(e.message || 'Lỗi khi bỏ chặn người dùng!')
  }
}

const usernameVal = computed(() => profileData.value?.profile?.username || '')

// Merge user store email if owner (since public profile API doesn't return email)
const profileWithEmail = computed<UserProfile>(() => {
  const p = profileData.value?.profile
  if (!p)
    return {
      id: authorIdParam,
      username: '',
      role: isOwner.value && userStore.role ? userStore.role : 'user'
    } as UserProfile
  return {
    ...p,
    email: isOwner.value && userStore.email ? userStore.email : undefined,
    role: p.role || (isOwner.value && userStore.role ? userStore.role : 'user')
  } as UserProfile
})

const requestUrl = `https://techdeal.io.vn/user/${authorIdParam}`
const defaultAvatar =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'

// SEO metadata config
const usernameHandle = computed(() => `@${usernameVal.value || 'User'}`)

const seoTitle = computed(() =>
  profileData.value?.profile?.full_name
    ? `${profileData.value.profile.full_name} (${usernameHandle.value})`
    : t('user_profile.meta_title', { username: usernameHandle.value })
)
const seoDescription = computed(
  () =>
    profileData.value?.profile?.bio ||
    t('user_profile.meta_description', { username: usernameHandle.value })
)
const seoSocialTitle = computed(() =>
  profileData.value?.profile?.full_name
    ? `${profileData.value.profile.full_name} (${usernameHandle.value})`
    : usernameHandle.value
)

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoSocialTitle.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => profileData.value?.profile?.avatar_url || defaultAvatar,
  ogUrl: () => requestUrl,
  ogType: 'profile',
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoSocialTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => profileData.value?.profile?.avatar_url || defaultAvatar,
  robots: 'index, follow'
})

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: requestUrl
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: profileWithEmail.value.full_name || usernameVal.value || 'User',
          alternateName: usernameVal.value || 'User',
          image: profileWithEmail.value.avatar_url || defaultAvatar,
          description: profileWithEmail.value.bio || '',
          agentInteractionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/WriteAction',
            userInteractionCount: profileWithEmail.value.post_count || 0
          }
        },
        publisher: {
          '@type': 'Organization',
          name: 'TechDeal',
          url: 'https://techdeal.io.vn'
        }
      })
    }
  ]
}))

const isSaving = ref(false)

const handleAvatarUpdate = async (newUrl: string) => {
  isSaving.value = true
  try {
    const res = await updateProfile({ avatar_url: newUrl })
    if (res.success) {
      alert(t('user_profile.avatar_update_success'))
    } else {
      alert(res.error || t('user_profile.avatar_update_fail'))
    }
  } catch (e) {
    alert(t('user_profile.avatar_update_error'))
  } finally {
    isSaving.value = false
  }
}

const handleProfileUpdate = async (updatedFields: any) => {
  isSaving.value = true
  try {
    const res = await updateProfile(updatedFields)
    if (res.success) {
      alert(t('user_profile.profile_update_success'))
    } else {
      alert(res.error || t('user_profile.profile_update_fail'))
    }
  } catch (e) {
    alert(t('user_profile.profile_update_error'))
  } finally {
    isSaving.value = false
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getRoleBadgeClass = (role?: string) => {
  const r = role?.toLowerCase()
  if (r === 'admin')
    return 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 border-red-500/20'
  if (r === 'mod')
    return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20'
  return 'bg-zinc-500/10 text-zinc-500 dark:bg-zinc-550/20 dark:text-zinc-400 border-zinc-500/10'
}

const getRoleName = (role?: string) => {
  const r = role?.toLowerCase()
  if (r === 'admin') return 'Admin'
  if (r === 'mod') return 'Mod'
  return 'Member'
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans flex flex-col"
  >
    <Header />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-5xl">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div
          class="w-10 h-10 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-xs font-bold text-zinc-500 mt-4 tracking-wider animate-pulse">
          {{ $t('user_profile.loading') }}
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 font-bold mb-2">
          {{ $t('user_profile.error_prefix', { message: error.message }) }}
        </p>
        <button
          @click="page = 1"
          class="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
        >
          {{ $t('user_profile.retry') }}
        </button>
      </div>

      <div v-else class="space-y-8">
        <!-- Top Cover and Profile Header -->
        <div
          class="bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left"
        >
          <!-- User Avatar Component -->
          <UserAvatar
            :avatar-url="profileWithEmail.avatar_url"
            :is-editable="isOwner"
            @update:avatar="handleAvatarUpdate"
            class="shrink-0"
          />

          <!-- Quick statistics summary -->
          <div class="space-y-4 flex-grow">
            <div>
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 class="text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                  {{ profileWithEmail.full_name || $t('user_profile.no_full_name') }}
                </h1>
                <!-- Role Tag -->
                <span
                  v-if="profileWithEmail.role"
                  class="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border select-none shrink-0"
                  :class="getRoleBadgeClass(profileWithEmail.role)"
                >
                  {{ getRoleName(profileWithEmail.role) }}
                </span>
              </div>
              <p
                class="text-xs text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider mt-1"
              >
                @{{ profileWithEmail.username }}
              </p>
            </div>

            <p class="text-xs text-zinc-600 dark:text-zinc-450 line-clamp-2 italic max-w-lg">
              {{ profileWithEmail.bio || $t('user_profile.no_bio') }}
            </p>
          </div>

          <!-- Actions for owner: Blocked Users list -->
          <div v-if="isOwner" class="flex md:flex-col gap-2 shrink-0">
            <button
              @click="isBlockedUsersOpen = true"
              class="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              :title="$t('moderation.blocked_users_btn')"
            >
              <ShieldAlert class="w-3.5 h-3.5 text-red-500" />
              <span>{{ $t('moderation.blocked_users_btn') }}</span>
            </button>
          </div>

          <!-- Actions for non-owners: Report & Block User -->
          <div v-else-if="userStore.isAuthenticated" class="flex md:flex-col gap-2 shrink-0">
            <button
              @click="isReportUserOpen = true"
              class="px-3.5 py-2 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              :title="$t('moderation.report_btn')"
            >
              <Flag class="w-3.5 h-3.5" />
              <span>{{ $t('moderation.report_btn') }}</span>
            </button>

            <button
              v-if="!isBlocked"
              @click="handleBlockUser"
              class="px-3.5 py-2 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              :title="$t('moderation.block_user_btn')"
            >
              <Ban class="w-3.5 h-3.5" />
              <span>{{ $t('moderation.block_user_btn') }}</span>
            </button>

            <button
              v-else
              @click="handleUnblockUser"
              class="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              :title="$t('moderation.unblock_user_btn')"
            >
              <ShieldAlert class="w-3.5 h-3.5" />
              <span>{{ $t('moderation.unblock_user_btn') }}</span>
            </button>
          </div>
        </div>

        <!-- Report User Modal -->
        <ReportModal
          v-model:open="isReportUserOpen"
          target-type="user"
          :target-id="authorIdParam"
          :target-title="profileWithEmail.full_name || profileWithEmail.username"
        />

        <!-- Blocked Users Modal (Owner only) -->
        <BlockedUsersModal v-if="isOwner" v-model:open="isBlockedUsersOpen" />

        <!-- Details Grid: Info & Posts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left: User Profile Information -->
          <div class="lg:col-span-1">
            <UserProfileInfo
              :profile="profileWithEmail"
              :is-owner="isOwner"
              :is-saving="isSaving"
              @update:profile="handleProfileUpdate"
            />
          </div>

          <!-- Right: Paginated Posts List -->
          <div class="lg:col-span-2">
            <UserPostList
              :posts="profileData.posts"
              :pagination="profileData.pagination"
              @change-page="handlePageChange"
            />
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
