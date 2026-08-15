import { useMutation, useQueryClient } from '@tanstack/react-query'

import { listingKeys } from '../listing.constants'
import { ListingSchema } from '../schemas/listing.schema'

import { post } from '@/lib/api'

export function useCloseListingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (listingId: string) => {
      const raw = await post(`/listings/${listingId}/close`, {})
      return ListingSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all })
    },
  })
}
