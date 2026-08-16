import { useMutation, useQueryClient } from '@tanstack/react-query'

import { expertKeys } from '../expert.constants'
import { ExpertSchema } from '../schemas/expert.schema'

import type { ExpertOnboarding } from '../types/expert.types'

import { useAuthStore } from '@/domains/auth'
import { patch } from '@/lib/api'

export function useExpertProfileMutation() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.userId)

  return useMutation({
    mutationFn: async (data: Partial<ExpertOnboarding>) => {
      const raw = await patch('/experts/profile', data)
      return ExpertSchema.parse(raw)
    },
    onSuccess: (updated) => {
      if (userId) {
        queryClient.setQueryData(expertKeys.profile(userId), updated)
      }
      queryClient.invalidateQueries({ queryKey: expertKeys.lists() })
    },
  })
}
