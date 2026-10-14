import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from '../store/authStore'

import { post } from '@/lib/api'
import { unregisterPushToken } from '@/lib/pushToken'
import { queryClient } from '@/lib/queryClient'
import { tokenStorage } from '@/lib/storage'

export function useFreezeAccountMutation() {
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      await unregisterPushToken()
      return post('/auth/freeze')
    },
    onSuccess: async () => {
      await tokenStorage.clearTokens()
      clearAuth()
      queryClient.clear()
    },
  })
}
