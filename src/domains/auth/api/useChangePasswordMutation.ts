import { useMutation } from '@tanstack/react-query'

import type { ChangePasswordRequest } from '../types/auth.types'

import { post } from '@/lib/api'

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      return post<{ success: boolean }>('/auth/change-password', data)
    },
  })
}
