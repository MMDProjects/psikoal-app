import { useQuery } from '@tanstack/react-query'

import { notificationKeys, NOTIFICATION_STALE_TIME } from '../notification.constants'
import { NotificationListResponseSchema } from '../schemas/notification.schema'

import { get } from '@/lib/api'

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const raw = await get('/notifications')
      const result = NotificationListResponseSchema.safeParse(raw)
      if (!result.success) throw result.error
      return result.data
    },
    staleTime: NOTIFICATION_STALE_TIME,
  })
}
