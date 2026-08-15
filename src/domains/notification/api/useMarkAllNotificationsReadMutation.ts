import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notificationKeys } from '../notification.constants'

import { post } from '@/lib/api'

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return post('/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
