import { z } from 'zod'

import { NotificationTypeSchema } from '../schemas/notification.schema'

import type { NotificationType } from '../types/notification.types'

/**
 * Push `data` alanı (sözleşme §7): { type, entityId }. entityId, backend'in
 * bildirim verisindeki ilk kimliktir:
 *   OFFER_RECEIVED → listingId   OFFER_ACCEPTED → matchId
 *   LISTING_*      → listingId   EXPERT_* / REVIEW_* → yok
 * Bilinmeyen tür yönlendirmeyi bozmaz: bildirim listesine düşer.
 */
export const NotificationTapDataSchema = z.object({
  type: z.string(),
  entityId: z.string().nullable().optional(),
})

export type NotificationTapData = z.infer<typeof NotificationTapDataSchema>

export const NOTIFICATIONS_ROUTE = '/notifications'

function isKnownType(type: string): type is NotificationType {
  return NotificationTypeSchema.safeParse(type).success
}

export function resolveNotificationRoute(data: unknown): string {
  const parsed = NotificationTapDataSchema.safeParse(data)
  if (!parsed.success || !isKnownType(parsed.data.type)) return NOTIFICATIONS_ROUTE

  const { type } = parsed.data
  const entityId = parsed.data.entityId || null

  switch (type) {
    case 'OFFER_RECEIVED':
      return entityId ? `/listing/${entityId}` : '/(tabs)/offers'
    case 'OFFER_ACCEPTED':
      return entityId ? `/match/${entityId}` : '/(tabs)/matches'
    case 'LISTING_EXPIRING':
    case 'LISTING_APPROVED':
    case 'LISTING_REJECTED':
      return entityId ? `/listing/${entityId}` : '/(tabs)/offers'
    case 'EXPERT_APPROVED':
      return '/(tabs)'
    case 'EXPERT_REJECTED':
      return '/profile/professional'
    case 'REVIEW_APPROVED':
    case 'REVIEW_REJECTED':
    case 'SYSTEM':
      return NOTIFICATIONS_ROUTE
  }
}
