import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notificationKeys } from '../notification.constants'

import { post } from '@/lib/api'

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return post(`/notifications/${notificationId}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
