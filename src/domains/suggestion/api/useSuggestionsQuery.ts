import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { SuggestionSchema } from '../schemas/suggestion.schema'
import { suggestionKeys, SUGGESTION_STALE_TIME } from '../suggestion.constants'

import type { SuggestionAudience } from '../types/suggestion.types'

import { get } from '@/lib/api'

const SuggestionListResponseSchema = z.object({
  data: z.array(SuggestionSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useSuggestionsQuery(audience: Exclude<SuggestionAudience, 'all'>) {
  return useQuery({
    queryKey: suggestionKeys.list(audience),
    queryFn: async () => {
      const raw = await get('/suggestions', { params: { audience } })
      const result = SuggestionListResponseSchema.safeParse(raw)
      if (!result.success) {
        throw result.error
      }
      return result.data.data
    },
    staleTime: SUGGESTION_STALE_TIME,
  })
}
