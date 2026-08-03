import { useNotificationsQuery } from '../api/useNotificationsQuery'

export function useUnreadNotificationCount(): number {
  const { data } = useNotificationsQuery()
  return data?.meta.unreadCount ?? 0
}
