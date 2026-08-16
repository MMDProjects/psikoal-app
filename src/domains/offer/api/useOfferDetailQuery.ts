import { useQuery } from '@tanstack/react-query'

import { offerKeys, OFFER_STALE_TIME } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

import { get } from '@/lib/api'

export function useOfferDetailQuery(offerId: string) {
  return useQuery({
    queryKey: offerKeys.detail(offerId),
    queryFn: async () => {
      const raw = await get(`/offers/${offerId}`)
      const result = OfferSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: OFFER_STALE_TIME,
    enabled: Boolean(offerId),
  })
}
