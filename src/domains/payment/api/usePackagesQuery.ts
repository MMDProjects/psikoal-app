import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { paymentKeys } from '../payment.constants'
import { PackageSchema } from '../schemas/payment.schema'

import { get } from '@/lib/api'

export function usePackagesQuery() {
  return useQuery({
    queryKey: paymentKeys.packages(),
    queryFn: async () => {
      const raw = await get('/payment/packages')
      return z.array(PackageSchema).parse(raw)
    },
    staleTime: 10 * 60 * 1000,
  })
}
