import { useMutation } from '@tanstack/react-query'

import { ResetPasswordRequestSchema } from '../schemas/auth.schema'

import type { ResetPasswordRequest } from '../types/auth.types'

import { post } from '@/lib/api'

export const RESET_TOKEN_INVALID = 'RESET_TOKEN_INVALID'

/** POST /auth/reset-password — 204 döner; geçersiz token 422 RESET_TOKEN_INVALID. */
export function useResetPasswordMutation() {
  return useMutation({
    meta: { suppressErrorAlert: true },
    mutationFn: async (body: ResetPasswordRequest) => {
      await post<void>('/auth/reset-password', ResetPasswordRequestSchema.parse(body))
    },
  })
}
