import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { assessmentKeys } from '../assessment.constants'
import { AssessmentResultSchema } from '../schemas/assessment.schema'

export function useAssessmentResultQuery(resultId: string) {
  return useQuery({
    queryKey: assessmentKeys.result(resultId),
    queryFn: async () => {
      const raw = await get(`/assessment/results/${resultId}`)
      return AssessmentResultSchema.parse(raw)
    },
    // Submit sonrası setQueryData ile doldurulan cache tazedir; yalnızca
    // deep link / yeniden açılış gibi cache-miss durumlarında fetch atılır.
    staleTime: Infinity,
    enabled: Boolean(resultId),
  })
}
