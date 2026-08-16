import { useMutation, useQueryClient } from '@tanstack/react-query'

import { offerKeys } from '../offer.constants'

import { listingKeys } from '@/domains/listing'
import { matchKeys } from '@/domains/match'
import { post } from '@/lib/api'

export function useAcceptOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (offerId: string) => {
      return post(`/offers/${offerId}/accept`, {})
    },
    onSuccess: (_data, offerId) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.detail(offerId) })
      queryClient.invalidateQueries({ queryKey: offerKeys.listings() })
      queryClient.invalidateQueries({ queryKey: listingKeys.all })
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
    },
  })
}
