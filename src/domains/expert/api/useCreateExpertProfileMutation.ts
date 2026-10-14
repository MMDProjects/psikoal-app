import { useMutation } from '@tanstack/react-query'

import type { ExpertOnboarding } from '../schemas/expert.schema'

import { post } from '@/lib/api'

export function useCreateExpertProfileMutation() {
  return useMutation({
    meta: { suppressErrorAlert: true },
    mutationFn: (data: ExpertOnboarding) => post('/experts/profile', data),
  })
}
