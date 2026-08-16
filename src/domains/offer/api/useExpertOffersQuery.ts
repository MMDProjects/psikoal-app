import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { offerKeys, OFFER_STALE_TIME } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

import type { OfferStatus } from '../types/offer.types'

import { get } from '@/lib/api'

const ExpertOffersResponseSchema = z.object({
  data: z.array(OfferSchema),
  meta: z.object({
    page: z.number(),
    total: z.number(),
    perPage: z.number(),
    pendingCount: z.number().int().min(0),
  }),
})

export function useExpertOffersQuery(status?: OfferStatus) {
  return useQuery({
    queryKey: offerKeys.my(status),
    queryFn: async () => {
      const raw = await get('/offers/my', { params: status ? { status } : undefined })
      const result = ExpertOffersResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    staleTime: OFFER_STALE_TIME,
  })
}
