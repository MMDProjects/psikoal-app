import { z } from 'zod'

import { NotificationSchema, NotificationTypeSchema } from '../schemas/notification.schema'

export type Notification = z.infer<typeof NotificationSchema>
export type NotificationType = z.infer<typeof NotificationTypeSchema>

export type RegisterPushTokenBody = {
  token: string
  platform: 'ios' | 'android'
  deviceId?: string
}
