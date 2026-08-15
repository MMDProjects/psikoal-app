export {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useRegisterPushTokenMutation,
} from './api'
export { useUnreadNotificationCount } from './hooks/useUnreadNotificationCount'
export { usePushTokenRegistration } from './hooks/usePushTokenRegistration'
export { notificationKeys, NOTIFICATION_TYPE_CONFIG } from './notification.constants'
export { NotificationSchema, NotificationTypeSchema } from './schemas/notification.schema'
export type {
  Notification,
  NotificationType,
  RegisterPushTokenBody,
} from './types/notification.types'
