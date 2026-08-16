import { Pressable, View } from 'react-native'

import { MATCH_STATUS_CONFIG } from '../match.constants'

import type { Match } from '../types/match.types'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'
import { formatDate } from '@/core/utils/formatDate'

const SESSION_LABELS: Record<string, string> = {
  online: 'Online',
  yüz_yüze: 'Yüz yüze',
}

export type MatchRowProps = {
  match: Match
  onPress: () => void
  hideStatus?: boolean
  viewerRole: 'expert' | 'client'
}

export function MatchRow({ match, onPress, hideStatus, viewerRole }: MatchRowProps) {
  const colors = useThemeColors()
  const cfg = MATCH_STATUS_CONFIG[match.status]
  const isExpert = viewerRole === 'expert'

  const partyName = isExpert
    ? (match.client?.fullName ?? 'Danışan')
    : (match.expert?.name ?? 'Uzman')
  const initials = (isExpert ? match.client?.initials : match.expert?.initials) ?? ''

  const listing = match.listing
  const offer = match.offer
  const specs = listing?.specialization ?? []
  const dateLabel = formatDate(match.createdAt, 'dayMonth')

  return (
    <Pressable onPress={onPress} className="gap-3 px-4 py-4 active:opacity-90">
      <View className="flex-row items-start justify-between gap-2">
        <Text
          variant="label"
          className="flex-1 font-semibold leading-snug text-neutral-900 dark:text-[#F5F5F7]"
        >
          {listing?.title ?? 'İlan'}
        </Text>
        {!hideStatus && (
          <View className="shrink-0 flex-row items-center gap-1">
            <Icon name={cfg.icon} size={13} color={cfg.iconColor} />
            <Text variant="caption" className="font-medium" style={{ color: cfg.iconColor }}>
              {cfg.label}
            </Text>
          </View>
        )}
      </View>

      {listing?.description ? (
        <Text variant="caption" color="secondary" numberOfLines={2} className="-mt-1">
          {listing.description}
        </Text>
      ) : null}

      {(specs.length > 0 || offer) && (
        <View className="flex-row flex-wrap gap-1.5">
          {specs.slice(0, 3).map((s) => (
            <Chip key={s} label={s} variant="filter" isSelected />
          ))}
          {specs.length > 3 && <Chip label={`+${specs.length - 3}`} variant="filter" />}
          {offer && (
            <>
              <Chip label={`₺${offer.price.toLocaleString('tr-TR')}`} variant="price" isSelected />
              <Chip
                label={SESSION_LABELS[offer.sessionType] ?? offer.sessionType}
                variant="session"
                isSelected
              />
            </>
          )}
        </View>
      )}

      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center gap-2">
          <Avatar size="xs" initials={initials} />
          <Text variant="caption" color="secondary">
            {partyName}
          </Text>
          {listing?.city ? (
            <>
              <Text variant="caption" color="tertiary">
                ·
              </Text>
              <View className="flex-row items-center gap-1">
                <Icon name="MapPin" size={11} color={colors.contentDisabled} />
                <Text variant="caption" color="tertiary">
                  {listing.city}
                </Text>
              </View>
            </>
          ) : null}
        </View>
        <Text variant="caption" color="tertiary">
          {dateLabel}
        </Text>
      </View>
    </Pressable>
  )
}
