import { useMutation } from '@tanstack/react-query'

import { post } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { tokenStorage } from '@/lib/storage'

import { useAuthStore } from '../store/authStore'

export function useFreezeAccountMutation() {
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      return post('/auth/freeze')
    },
    onSuccess: async () => {
      await tokenStorage.clearTokens()
      clearAuth()
      queryClient.clear()
    },
  })
}
