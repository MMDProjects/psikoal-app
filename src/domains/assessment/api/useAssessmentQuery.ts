import { useQuery } from '@tanstack/react-query'

import { assessmentKeys } from '../assessment.constants'
import { AssessmentSchema } from '../schemas/assessment.schema'

import { get } from '@/lib/api'

export function useAssessmentQuery() {
  return useQuery({
    queryKey: assessmentKeys.active(),
    queryFn: async () => {
      const raw = await get('/assessment/active')
      return AssessmentSchema.parse(raw)
    },
    staleTime: 10 * 60 * 1000,
  })
}
