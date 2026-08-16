import { Pressable, View } from 'react-native'

import { LISTING_STATUS_CONFIG, SESSION_TYPE_LABELS } from '../listing.constants'

import type { Listing } from '../types/listing.types'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'
import { formatDate } from '@/core/utils/formatDate'

export type ListingCardProps = {
  listing: Listing
  onPress: () => void
  hideStatus?: boolean
  className?: string
}

export function ListingCard({ listing, onPress, hideStatus = false, className }: ListingCardProps) {
  const statusConfig = LISTING_STATUS_CONFIG[listing.status]
  const sessionLabel =
    SESSION_TYPE_LABELS[listing.preferredSessionType] ?? listing.preferredSessionType
  const dateLabel = formatDate(listing.createdAt, 'dayMonth')

  return (
    <Pressable onPress={onPress} className={cn('gap-3 px-4 py-4 active:opacity-90', className)}>
      <View className="flex-row items-start justify-between gap-2">
        <Text
          variant="label"
          className="flex-1 font-semibold leading-snug text-neutral-900 dark:text-[#F5F5F7]"
        >
          {listing.title}
        </Text>
        {!hideStatus && (
          <View className="shrink-0 flex-row items-center gap-1">
            <Icon name={statusConfig.icon} size={13} color={statusConfig.iconColor} />
            <Text
              variant="caption"
              className="font-medium"
              style={{ color: statusConfig.iconColor }}
            >
              {statusConfig.label}
            </Text>
          </View>
        )}
      </View>

      {listing.description ? (
        <Text variant="caption" color="secondary" numberOfLines={2} className="-mt-1">
          {listing.description}
        </Text>
      ) : null}

      <View className="flex-row flex-wrap gap-1.5">
        {listing.specialization.slice(0, 3).map((spec) => (
          <Chip key={spec} label={spec} variant="filter" isSelected />
        ))}
        {listing.specialization.length > 3 && (
          <Chip label={`+${listing.specialization.length - 3}`} variant="filter" />
        )}
        <Chip label={listing.budgetLabel} variant="tag" isSelected />
        <Chip label={sessionLabel} variant="session" isSelected />
      </View>

      <View className="flex-row items-center justify-between pt-1">
        {listing.client ? (
          <View className="mr-3 flex-1 flex-row items-center gap-2">
            <Avatar
              size="xs"
              initials={listing.client.initials ?? ''}
              src={listing.client.avatarUrl ?? undefined}
            />
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {listing.clientDisplayName ?? ''}
            </Text>
          </View>
        ) : (
          <View className="flex-1" />
        )}
        <Text variant="caption" color="tertiary">
          {dateLabel}
        </Text>
      </View>
    </Pressable>
  )
}
