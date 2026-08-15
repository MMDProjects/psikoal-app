import { useMutation } from '@tanstack/react-query'

import { CheckoutSessionSchema } from '../schemas/payment.schema'

import type { InitiateCheckoutRequest } from '../types/payment.types'

import { post } from '@/lib/api'

export function useInitiateCheckoutMutation() {
  return useMutation({
    mutationFn: async (data: InitiateCheckoutRequest) => {
      const raw = await post('/payment/checkout/initiate', data)
      return CheckoutSessionSchema.parse(raw)
    },
  })
}
