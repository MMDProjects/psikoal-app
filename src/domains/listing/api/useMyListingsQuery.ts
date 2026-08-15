import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { listingKeys, LISTING_STALE_TIME } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

import type { ListingStatus } from '../types/listing.types'

import { get } from '@/lib/api'

const MyListingsResponseSchema = z.object({
  data: z.array(ListingSchema),
  meta: z.object({
    page: z.number(),
    total: z.number(),
    perPage: z.number(),
    activeCount: z.number().int().min(0),
  }),
})

export function useMyListingsQuery(status?: ListingStatus) {
  return useQuery({
    queryKey: listingKeys.my(status),
    queryFn: async () => {
      const raw = await get('/listings/my', { params: status ? { status } : undefined })
      const result = MyListingsResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    staleTime: LISTING_STALE_TIME,
  })
}
