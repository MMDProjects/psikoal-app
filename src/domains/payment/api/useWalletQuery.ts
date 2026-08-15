import { useQuery } from '@tanstack/react-query'

import { paymentKeys } from '../payment.constants'
import { WalletSchema } from '../schemas/payment.schema'

import { get } from '@/lib/api'

export function useWalletQuery() {
  return useQuery({
    queryKey: paymentKeys.wallet(),
    queryFn: async () => {
      const raw = await get('/payment/wallet')
      return WalletSchema.parse(raw)
    },
    staleTime: 2 * 60 * 1000,
  })
}
