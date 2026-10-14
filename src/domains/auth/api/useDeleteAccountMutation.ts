import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from '../store/authStore'

import { del } from '@/lib/api'
import { unregisterPushToken } from '@/lib/pushToken'
import { queryClient } from '@/lib/queryClient'
import { tokenStorage } from '@/lib/storage'

export function useDeleteAccountMutation() {
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      await unregisterPushToken()
      return del('/auth/me')
    },
    onSuccess: async () => {
      await tokenStorage.clearTokens()
      clearAuth()
      queryClient.clear()
    },
  })
}
