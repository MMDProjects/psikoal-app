import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { assessmentKeys } from '../assessment.constants'
import { AssessmentListItemSchema } from '../schemas/assessment.schema'

import { get } from '@/lib/api'

export function useAssessmentListQuery(category?: string) {
  return useQuery({
    queryKey: assessmentKeys.list(category),
    queryFn: async () => {
      const raw = await get<{ data?: unknown[] }>(
        '/assessment',
        category ? { params: { category } } : undefined
      )
      return z.array(AssessmentListItemSchema).parse(raw.data ?? [])
    },
    staleTime: 10 * 60 * 1000,
  })
}
