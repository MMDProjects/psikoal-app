import type { OfferStatus } from './types/offer.types'
import type { IconName } from '@/core/components/atoms/Icon'

export const offerKeys = {
  all: ['offers'] as const,
  lists: () => [...offerKeys.all, 'list'] as const,
  my: (status?: string) => [...offerKeys.all, 'my', status ?? 'all'] as const,
  details: () => [...offerKeys.all, 'detail'] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  listings: () => [...offerKeys.all, 'listing'] as const,
  forListing: (listingId: string) => [...offerKeys.listings(), listingId] as const,
} as const

export const OFFER_STALE_TIME = 60 * 1000

export const OFFER_STATUS_CONFIG: Record<
  OfferStatus,
  { label: string; icon: IconName; iconColor: string }
> = {
  PENDING: { label: 'Beklemede', icon: 'Clock', iconColor: '#D97706' },
  ACCEPTED: { label: 'Kabul Edildi', icon: 'CheckCircle2', iconColor: '#16A34A' },
  REJECTED: { label: 'Reddedildi', icon: 'XCircle', iconColor: '#DC2626' },
  WITHDRAWN: { label: 'Geri Çekildi', icon: 'MinusCircle', iconColor: '#737373' },
}
