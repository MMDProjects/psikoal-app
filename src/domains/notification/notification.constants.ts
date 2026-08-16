import type { NotificationType } from './types/notification.types'
import type { IconName } from '@/core/components/atoms/Icon'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
} as const

export const NOTIFICATION_STALE_TIME = 60 * 1000

type NotificationTypeConfig = {
  icon: IconName
  bgClass: string
  iconColorLight: string
  iconColorDark: string
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  OFFER_RECEIVED: {
    icon: 'SendHorizonal',
    bgClass: 'bg-sky-100 dark:bg-sky-900',
    iconColorLight: '#0EA5E9',
    iconColorDark: '#38BDF8',
  },
  OFFER_ACCEPTED: {
    icon: 'CheckCircle',
    bgClass: 'bg-green-100 dark:bg-green-900',
    iconColorLight: '#16A34A',
    iconColorDark: '#4ADE80',
  },
  LISTING_EXPIRING: {
    icon: 'FileText',
    bgClass: 'bg-amber-100 dark:bg-amber-900',
    iconColorLight: '#D97706',
    iconColorDark: '#FCD34D',
  },
  LISTING_APPROVED: {
    icon: 'CheckCircle2',
    bgClass: 'bg-green-100 dark:bg-green-900',
    iconColorLight: '#16A34A',
    iconColorDark: '#4ADE80',
  },
  LISTING_REJECTED: {
    icon: 'XCircle',
    bgClass: 'bg-red-100 dark:bg-red-900',
    iconColorLight: '#DC2626',
    iconColorDark: '#F87171',
  },
  EXPERT_APPROVED: {
    icon: 'BadgeCheck',
    bgClass: 'bg-green-100 dark:bg-green-900',
    iconColorLight: '#16A34A',
    iconColorDark: '#4ADE80',
  },
  EXPERT_REJECTED: {
    icon: 'XCircle',
    bgClass: 'bg-red-100 dark:bg-red-900',
    iconColorLight: '#DC2626',
    iconColorDark: '#F87171',
  },
  REVIEW_APPROVED: {
    icon: 'MessageSquareText',
    bgClass: 'bg-green-100 dark:bg-green-900',
    iconColorLight: '#16A34A',
    iconColorDark: '#4ADE80',
  },
  REVIEW_REJECTED: {
    icon: 'MessageSquareText',
    bgClass: 'bg-red-100 dark:bg-red-900',
    iconColorLight: '#DC2626',
    iconColorDark: '#F87171',
  },
  SYSTEM: {
    icon: 'Bell',
    bgClass: 'bg-neutral-100 dark:bg-neutral-800',
    iconColorLight: '#737373',
    iconColorDark: '#A3A3A3',
  },
}
