import { useQuery } from '@tanstack/react-query'

import { matchKeys } from '../match.constants'
import { MatchDetailSchema } from '../schemas/match.schema'

import type { MatchDetail } from '../types/match.types'

import { get } from '@/lib/api'

export function useMatchDetailQuery(matchId: string) {
  return useQuery({
    queryKey: matchKeys.detail(matchId),
    queryFn: async () => {
      const raw = await get(`/matches/${matchId}`)
      const result = MatchDetailSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data as MatchDetail
    },
    staleTime: 30 * 1000,
    enabled: Boolean(matchId),
  })
}
