import { useMutation } from '@tanstack/react-query'

import { del } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { tokenStorage } from '@/lib/storage'

import { useAuthStore } from '../store/authStore'

export function useDeleteAccountMutation() {
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      return del('/auth/me')
    },
    onSuccess: async () => {
      await tokenStorage.clearTokens()
      clearAuth()
      queryClient.clear()
    },
  })
}
