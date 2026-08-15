import { useQuery } from '@tanstack/react-query'

import { expertKeys, EXPERT_STALE_TIME } from '../expert.constants'
import { ExpertSchema } from '../schemas/expert.schema'

import { get } from '@/lib/api'

export function useExpertProfileQuery(expertId: string) {
  return useQuery({
    queryKey: expertKeys.profile(expertId),
    queryFn: async () => {
      const raw = await get(`/experts/${expertId}`)
      return ExpertSchema.parse(raw)
    },
    staleTime: EXPERT_STALE_TIME,
    enabled: Boolean(expertId),
  })
}
