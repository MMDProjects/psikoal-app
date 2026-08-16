import { useMutation, useQueryClient } from '@tanstack/react-query'

import { listingKeys } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

import type { CreateListingRequest } from '../types/listing.types'

import { post } from '@/lib/api'

export function useCreateListingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateListingRequest) => {
      const raw = await post('/listings', data)
      return ListingSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.my() })
    },
  })
}
