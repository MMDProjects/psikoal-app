import { useMutation, useQueryClient } from '@tanstack/react-query'

import { offerKeys } from '../offer.constants'
import { OfferSchema } from '../schemas/offer.schema'

import type { SendOfferRequest } from '../types/offer.types'

import { creditKeys, isInsufficientCreditsError } from '@/domains/credit'
import { listingKeys } from '@/domains/listing'
import { post } from '@/lib/api'

export function useSendOfferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { suppressErrorAlert: true },
    mutationFn: async (data: SendOfferRequest) => {
      const raw = await post('/offers', data)
      return OfferSchema.parse(raw)
    },
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: offerKeys.my() })
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(offer.listingId) })
      // Teklif kredi düşürür (OFFER_SPEND): bakiye ve defter bayatladı.
      queryClient.invalidateQueries({ queryKey: creditKeys.all })
    },
    onError: (error) => {
      // 422 INSUFFICIENT_CREDITS: ekrandaki bakiye eskiyse tazelensin ki kapı kapansın.
      if (isInsufficientCreditsError(error)) {
        queryClient.invalidateQueries({ queryKey: creditKeys.balance() })
      }
    },
  })
}
