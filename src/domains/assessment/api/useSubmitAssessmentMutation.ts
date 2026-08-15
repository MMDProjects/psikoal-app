import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assessmentKeys } from '../assessment.constants'
import { AssessmentResultSchema } from '../schemas/assessment.schema'

import type { SubmitAssessmentRequest } from '../types/assessment.types'

import { post } from '@/lib/api'

export function useSubmitAssessmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubmitAssessmentRequest) => {
      const raw = await post('/assessment/submit', data)
      return AssessmentResultSchema.parse(raw)
    },
    onSuccess: (result) => {
      queryClient.setQueryData(assessmentKeys.result(result.id), result)
    },
  })
}
