import { useMutation } from '@tanstack/react-query'

import type { ForgotPasswordRequest } from '../types/auth.types'

import { post } from '@/lib/api'

export function useForgotPasswordMutation() {
  return useMutation({
    meta: { suppressErrorAlert: true },
    mutationFn: async (data: ForgotPasswordRequest) => {
      return post<{ success: boolean }>('/auth/forgot-password', data)
    },
  })
}
