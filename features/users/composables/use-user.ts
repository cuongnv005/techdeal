import { ref, type Ref } from 'vue'
import { userRepository } from '../api/user'
import type { UserProfileUpdatePayload, UserDetailsResponse } from '../types/user.type'

export function useUser(
  authorId: string,
  initialPage: number = 1
): {
  profileData: Ref<UserDetailsResponse>
  isLoading: Ref<boolean>
  error: Ref<any>
  page: Ref<number>
  limit: Ref<number>
  refresh: () => Promise<any>
  updateProfile: (payload: UserProfileUpdatePayload) => Promise<any>
} {
  const page = ref(initialPage)
  const limit = ref(10)

  const {
    data: profileData,
    pending: isLoading,
    error,
    refresh
  } = useAsyncData(
    `user-profile-${authorId}`,
    async () => {
      const resp = await userRepository.getProfile(authorId, {
        page: page.value,
        limit: limit.value
      })
      return resp.data
    },
    {
      watch: [page],
      server: true,
      default: () => ({
        profile: { id: authorId } as any,
        posts: [],
        pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1 }
      })
    }
  )

  const updateProfile = async (payload: UserProfileUpdatePayload) => {
    const resp = await userRepository.updateProfile(payload)
    if (resp.success) {
      await refresh()
    }
    return resp
  }

  return {
    profileData,
    isLoading,
    error,
    page,
    limit,
    refresh,
    updateProfile
  }
}
