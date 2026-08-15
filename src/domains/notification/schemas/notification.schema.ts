import { z } from 'zod'

export const NotificationTypeSchema = z.enum([
  'OFFER_RECEIVED',
  'OFFER_ACCEPTED',
  'LISTING_EXPIRING',
  'LISTING_APPROVED',
  'LISTING_REJECTED',
  'EXPERT_APPROVED',
  'EXPERT_REJECTED',
  'REVIEW_APPROVED',
  'REVIEW_REJECTED',
  'SYSTEM',
])

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  timeLabel: z.string(),
  read: z.boolean(),
})

export const NotificationListResponseSchema = z.object({
  data: z.array(NotificationSchema),
  meta: z.object({
    page: z.number(),
    total: z.number(),
    perPage: z.number(),
    unreadCount: z.number().int().min(0),
  }),
})
