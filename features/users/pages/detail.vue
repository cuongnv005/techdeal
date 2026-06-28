<script setup lang="ts">
import { ref, computed } from 'vue'

import { useRoute } from '#app'

import UserAvatar from '../components/UserAvatar.vue'
import UserPostList from '../components/UserPostList.vue'
import UserProfileInfo from '../components/UserProfileInfo.vue'
import { useUser } from '../composables/use-user'

import type { UserProfile } from '../types/user.type'

import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'
import { useUserStore } from '@stores/user'

const route = useRoute()
const authorIdParam = route.params.id as string
const userStore = useUserStore()

// Composable setup
const { profileData, isLoading, error, page, updateProfile } = useUser(authorIdParam)

const isOwner = computed(() => {
  return userStore.isAuthenticated && userStore.id === authorIdParam
})

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
useSeoMeta({
  title: () =>
    profileData.value?.profile?.full_name
      ? `${profileData.value.profile.full_name} (@${usernameVal.value})`
      : `@${usernameVal.value || 'User'} - Trang cá nhân`,
  description: () =>
    profileData.value?.profile?.bio ||
    `Xem hồ sơ cá nhân và các bài viết của @${usernameVal.value || 'User'} trên TechDeal.`,
  ogTitle: () =>
    profileData.value?.profile?.full_name
      ? `${profileData.value.profile.full_name} (@${usernameVal.value})`
      : `@${usernameVal.value || 'User'}`,
  ogDescription: () =>
    profileData.value?.profile?.bio ||
    `Xem hồ sơ cá nhân và các bài viết của @${usernameVal.value || 'User'} trên TechDeal.`,
  ogImage: () => profileData.value?.profile?.avatar_url || defaultAvatar,
  ogUrl: requestUrl,
  ogType: 'profile',
  twitterCard: 'summary_large_image',
  twitterTitle: () =>
    profileData.value?.profile?.full_name
      ? `${profileData.value.profile.full_name} (@${usernameVal.value})`
      : `@${usernameVal.value || 'User'}`,
  twitterDescription: () =>
    profileData.value?.profile?.bio ||
    `Xem hồ sơ cá nhân và các bài viết của @${usernameVal.value || 'User'} trên TechDeal.`,
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
      alert('Cập nhật ảnh đại diện thành công!')
    } else {
      alert(res.error || 'Cập nhật ảnh đại diện thất bại!')
    }
  } catch (e) {
    alert('Có lỗi xảy ra khi cập nhật ảnh đại diện!')
  } finally {
    isSaving.value = false
  }
}

const handleProfileUpdate = async (updatedFields: any) => {
  isSaving.value = true
  try {
    const res = await updateProfile(updatedFields)
    if (res.success) {
      alert('Cập nhật thông tin cá nhân thành công!')
    } else {
      alert(res.error || 'Cập nhật thông tin thất bại!')
    }
  } catch (e) {
    alert('Có lỗi xảy ra khi cập nhật thông tin!')
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
          Đang tải thông tin người dùng...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 font-bold mb-2">Đã xảy ra lỗi: {{ error.message }}</p>
        <button
          @click="page = 1"
          class="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
        >
          Thử lại
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
                  {{ profileWithEmail.full_name || 'Chưa cập nhật tên thật' }}
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
              {{ profileWithEmail.bio || 'Chưa có thông tin giới thiệu bản thân.' }}
            </p>
          </div>
        </div>

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
