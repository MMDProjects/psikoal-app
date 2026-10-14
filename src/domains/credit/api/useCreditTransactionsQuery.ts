import { useInfiniteQuery } from '@tanstack/react-query'

import { creditKeys, CREDIT_STALE_TIME, CREDIT_TRANSACTIONS_PER_PAGE } from '../credit.constants'
import { CreditTransactionListResponseSchema } from '../schemas/credit.schema'

import type { CreditTransactionPage } from '../types/credit.types'

import { useAuthStore } from '@/domains/auth'
import { get } from '@/lib/api'

/**
 * Sonraki sayfa numarası backend'in döndüğü meta'dan okunur (page * perPage < total).
 * Sayfalama aritmetiği iş mantığı değil, istemcinin hangi sayfayı isteyeceğidir.
 */
export function getNextCreditPage(lastPage: CreditTransactionPage): number | undefined {
  const { page, perPage, total } = lastPage.meta
  return page * perPage < total ? page + 1 : undefined
}

/** GET /credits/transactions?page=&perPage= — yalnız uzman, en yeni önce. */
export function useCreditTransactionsQuery() {
  const isExpert = useAuthStore((s) => s.role === 'expert')

  return useInfiniteQuery({
    queryKey: creditKeys.transactions(),
    queryFn: async ({ pageParam }) => {
      const raw = await get('/credits/transactions', {
        params: { page: pageParam, perPage: CREDIT_TRANSACTIONS_PER_PAGE },
      })
      const result = CreditTransactionListResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    initialPageParam: 1,
    getNextPageParam: getNextCreditPage,
    staleTime: CREDIT_STALE_TIME,
    enabled: isExpert,
  })
}
