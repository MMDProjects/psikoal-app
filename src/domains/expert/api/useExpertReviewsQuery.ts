import { useQuery } from '@tanstack/react-query'

import { expertKeys, EXPERT_STALE_TIME } from '../expert.constants'
import { ReviewSchema } from '../schemas/review.schema'

import { get } from '@/lib/api'

export function useExpertReviewsQuery(expertId: string) {
  return useQuery({
    queryKey: expertKeys.reviews(expertId),
    queryFn: async () => {
      const raw = await get(`/experts/${expertId}/reviews`)
      return ReviewSchema.array().parse(raw)
    },
    staleTime: EXPERT_STALE_TIME,
    enabled: Boolean(expertId),
  })
}
