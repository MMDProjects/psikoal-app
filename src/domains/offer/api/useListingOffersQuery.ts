import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { offerKeys, OFFER_STALE_TIME } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

import { get } from '@/lib/api'

const ListingOffersResponseSchema = z.object({
  data: z.array(OfferSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useListingOffersQuery(listingId: string) {
  return useQuery({
    queryKey: offerKeys.forListing(listingId),
    queryFn: async () => {
      const raw = await get(`/listings/${listingId}/offers`)
      const result = ListingOffersResponseSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data
    },
    staleTime: OFFER_STALE_TIME,
    enabled: Boolean(listingId),
  })
}
