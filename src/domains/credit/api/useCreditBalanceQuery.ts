import { useQuery } from '@tanstack/react-query'

import { creditKeys, CREDIT_STALE_TIME } from '../credit.constants'
import { CreditBalanceResponseSchema } from '../schemas/credit.schema'

import { useAuthStore } from '@/domains/auth'
import { get } from '@/lib/api'

/**
 * GET /credits/me — yalnız uzman. Danışan token'ı 403 EXPERT_ROLE_REQUIRED alır;
 * bu yüzden rol uzman değilse istek hiç atılmaz.
 */
export function useCreditBalanceQuery() {
  const isExpert = useAuthStore((s) => s.role === 'expert')

  return useQuery({
    queryKey: creditKeys.balance(),
    queryFn: async () => {
      const raw = await get('/credits/me')
      const result = CreditBalanceResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data.data
    },
    staleTime: CREDIT_STALE_TIME,
    enabled: isExpert,
  })
}
