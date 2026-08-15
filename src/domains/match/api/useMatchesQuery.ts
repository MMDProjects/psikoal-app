import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { matchKeys } from '../match.constants'
import { MatchSchema } from '../schemas/match.schema'

import { get } from '@/lib/api'

const MatchesResponseSchema = z.object({
  data: z.array(MatchSchema),
  meta: z.object({
    page: z.number(),
    total: z.number(),
    perPage: z.number(),
    activeCount: z.number().int().min(0),
    pastCount: z.number().int().min(0),
  }),
})

export function useMatchesQuery(status?: string[]) {
  return useQuery({
    queryKey: matchKeys.list(status),
    queryFn: async () => {
      const raw = await get('/matches', { params: status ? { status } : undefined })
      const result = MatchesResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    staleTime: 30 * 1000,
  })
}
