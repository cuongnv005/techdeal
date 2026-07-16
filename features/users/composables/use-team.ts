import type { Ref } from 'vue'

import { userRepository } from '../api/user'

import type { TeamMember } from '../types/user.type'

export function useTeam(): {
  team: Ref<TeamMember[]>
  isLoading: Ref<boolean>
  error: Ref<any>
} {
  const {
    data: team,
    pending: isLoading,
    error
  } = useAsyncData(
    'team-members',
    async () => {
      const resp = await userRepository.getTeam()
      return resp.data.team
    },
    {
      server: true,
      default: () => []
    }
  )

  return { team, isLoading, error }
}
