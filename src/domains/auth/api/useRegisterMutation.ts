import { useMutation } from '@tanstack/react-query'

import { LoginResponseSchema } from '../schemas/auth.schema'
import { useAuthStore } from '../store/authStore'

import type { RegisterRequest } from '../types/auth.types'

import { post } from '@/lib/api'
import { tokenStorage } from '@/lib/storage'

export function useRegisterMutation() {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const raw = await post('/auth/register', data)
      return LoginResponseSchema.parse(raw)
    },
    onSuccess: async ({ user, tokens }) => {
      await tokenStorage.setAccessToken(tokens.accessToken)
      await tokenStorage.setRefreshToken(tokens.refreshToken)
      setAuth(user, tokens.accessToken, tokens.refreshToken)
    },
  })
}
