import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { assessmentKeys } from '../assessment.constants'
import { MyAssessmentResultSchema } from '../schemas/assessment.schema'

import { get } from '@/lib/api'

const MyResultsResponseSchema = z.object({
  data: z.array(MyAssessmentResultSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useMyAssessmentResultsQuery() {
  return useQuery({
    queryKey: assessmentKeys.myResults(),
    queryFn: async () => {
      const raw = await get('/assessment/results/my')
      const result = MyResultsResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
