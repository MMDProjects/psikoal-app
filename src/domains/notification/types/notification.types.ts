import type { NotificationSchema, NotificationTypeSchema } from '../schemas/notification.schema'
import type { z } from 'zod'

export type Notification = z.infer<typeof NotificationSchema>
export type NotificationType = z.infer<typeof NotificationTypeSchema>

export type RegisterPushTokenBody = {
  token: string
  platform: 'ios' | 'android'
  deviceId?: string
}
