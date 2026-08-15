import { Alert, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import { AssessmentResultSummary } from '@/domains/assessment'
import { useAuthStore } from '@/domains/auth'
import { SESSION_TYPE_LABELS } from '@/domains/listing'
import { useMatchDetailQuery, useReleaseMatchMutation, MATCH_STATUS_CONFIG } from '@/domains/match'
import { OFFER_STATUS_CONFIG } from '@/domains/offer'

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const role = useAuthStore((s) => s.role)

  const matchQuery = useMatchDetailQuery(id ?? '')
  const { data: match, isLoading, isError } = matchQuery
  const { isRefreshing, onRefresh } = useRefresh(matchQuery)
  const insets = useSafeAreaInsets()

  const { mutate: releaseMatch, isPending: isReleasing } = useReleaseMatchMutation()

  const viewerReleasedAt = role === 'client' ? match?.clientReleasedAt : match?.expertReleasedAt
  const isWaitingForOtherParty = match?.status === 'ACTIVE' && Boolean(viewerReleasedAt)

  const handleRelease = () => {
    if (!match) return
    Alert.alert(
      'Eşleşmeyi Sonlandır',
      'Eşleşme sonlandırma iki tarafın onayını gerektirir. Sonlandırma talebiniz karşı tarafa iletilecek. Devam etmek istiyor musunuz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sonlandır',
          style: 'destructive',
          onPress: () => releaseMatch({ matchId: match.id }),
        },
      ]
    )
  }

  const statusCfg = match ? MATCH_STATUS_CONFIG[match.status] : null
  const clientInitials = match?.client.initials ?? ''
  const expertInitials = match?.expert?.initials ?? ''
  const matchDate = match ? formatDate(match.createdAt, 'long') : ''

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="items-center pb-3 pt-2">
            <Skeleton variant="line" width="35%" height={14} />
          </View>
          <View className="gap-4 px-4 py-5">
            <View className="flex-row items-center gap-3">
              <Skeleton variant="circle" width={56} height={56} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="45%" height={18} />
              </View>
            </View>
            <Skeleton variant="line" width="80%" height={18} />
            <Skeleton variant="line" width="50%" height={11} />
          </View>
          <Divider spacing="none" className="mx-4" />
          <View className="gap-4 px-4 py-5">
            <Skeleton variant="line" width="30%" height={11} />
            <Skeleton variant="line" width="75%" height={16} />
            <View className="flex-row gap-2">
              <Skeleton variant="rect" width={80} height={28} borderRadius="full" />
              <Skeleton variant="rect" width={100} height={28} borderRadius="full" />
            </View>
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Eşleşme bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {!isLoading && !isError && match && (
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingBottom: match?.status === 'ACTIVE' ? 56 + insets.bottom + 16 : 48,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          <ScreenTitle title="Eşleşme Detayı" />

          <View className="gap-4 px-4 py-5">
            <View className="flex-row items-center gap-3">
              <Avatar size="lg" initials={clientInitials} />
              <View className="flex-1">
                <Text variant="subheading" className="font-semibold leading-tight">
                  {match.client.fullName}
                </Text>
              </View>
            </View>

            {match.listing?.title ? (
              <Text variant="subheading" className="leading-snug">
                {match.listing.title}
              </Text>
            ) : null}

            <View className="flex-row flex-wrap items-center gap-3">
              {statusCfg && (
                <View className="shrink-0 flex-row items-center gap-1.5">
                  <Icon name={statusCfg.icon} size={13} color={statusCfg.iconColor} />
                  <Text variant="caption" style={{ color: statusCfg.iconColor }}>
                    {statusCfg.label}
                  </Text>
                </View>
              )}
              {match.listing?.city ? (
                <View className="shrink-0 flex-row items-center gap-1.5">
                  <Icon name="MapPin" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">
                    {match.listing.city}
                  </Text>
                </View>
              ) : null}
              {match.client.email ? (
                <View className="shrink flex-row items-center gap-1.5">
                  <Icon name="Mail" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary" numberOfLines={1} className="shrink">
                    {match.client.email}
                  </Text>
                </View>
              ) : null}
              {match.client.phone ? (
                <View className="shrink-0 flex-row items-center gap-1.5">
                  <Icon name="Phone" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">
                    {match.client.phone}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {match.listing && (
            <>
              <Divider spacing="none" className="mx-4" />
              <View className="gap-5 px-4 py-5">
                {match.listing.description ? (
                  <View className="gap-2">
                    <Text
                      variant="caption"
                      color="secondary"
                      className="font-semibold uppercase tracking-widest"
                    >
                      İlan Detayı
                    </Text>
                    <Text variant="body" color="secondary" className="leading-relaxed">
                      {match.listing.description}
                    </Text>
                  </View>
                ) : null}

                {match.listing.specialization.length > 0 && (
                  <View className="gap-2.5">
                    <Text
                      variant="caption"
                      color="secondary"
                      className="font-semibold uppercase tracking-widest"
                    >
                      Aranan Uzmanlık
                    </Text>
                    <View className="flex-row flex-wrap gap-1.5">
                      {match.listing.specialization.map((spec) => (
                        <Chip key={spec} label={spec} variant="filter" isSelected />
                      ))}
                    </View>
                  </View>
                )}

                <View className="gap-2">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Seans Tipi
                  </Text>
                  <View className="flex-row">
                    <Chip
                      label={
                        SESSION_TYPE_LABELS[match.listing.preferredSessionType] ??
                        match.listing.preferredSessionType
                      }
                      variant="session"
                      isSelected
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Fiyat Aralığı
                  </Text>
                  <View className="flex-row">
                    <Chip label={match.listing.budgetLabel ?? ''} variant="tag" isSelected />
                  </View>
                </View>
              </View>
            </>
          )}

          {match.listing?.assessmentResult ? (
            <>
              <Divider spacing="none" className="mx-4" />
              <AssessmentResultSummary result={match.listing.assessmentResult} />
            </>
          ) : null}

          <Divider spacing="none" className="mx-4" />
          <View className="gap-3 px-4 py-5">
            <Text
              variant="caption"
              color="secondary"
              className="font-semibold uppercase tracking-widest"
            >
              Danışan Hakkında
            </Text>
            <View className="flex-row items-center gap-3">
              <Avatar size="sm" initials={clientInitials} />
              <Text variant="label" className="font-medium">
                {match.client.fullName}
              </Text>
            </View>
            <View className="gap-1">
              {match.client.createdAt ? (
                <Text variant="caption" color="secondary">
                  {formatDate(match.client.createdAt, 'long')} tarihinde kayıt oldu.
                </Text>
              ) : null}
              <Text variant="caption" color="secondary">
                {matchDate} tarihinde eşleşildi.
              </Text>
            </View>
          </View>

          {match.offer && (
            <>
              <Divider spacing="none" className="mx-4" />
              <View className="gap-4 px-4 py-5">
                <Text
                  variant="caption"
                  color="secondary"
                  className="font-semibold uppercase tracking-widest"
                >
                  Teklif Özeti
                </Text>

                <View className="flex-row items-center gap-3">
                  <Avatar size="sm" initials={expertInitials} />
                  <Text variant="label" className="font-semibold">
                    {match.expert?.name ?? 'Uzman'}
                  </Text>
                </View>

                {match.offer.title ? (
                  <Text variant="label" className="font-medium leading-snug">
                    {match.offer.title}
                  </Text>
                ) : null}

                <View className="gap-2">
                  {match.offer.description ? (
                    <Text variant="caption" color="secondary">
                      {match.offer.description}
                    </Text>
                  ) : null}
                  <View className="flex-row items-center gap-1">
                    <Icon
                      name={OFFER_STATUS_CONFIG['ACCEPTED'].icon}
                      size={13}
                      color={OFFER_STATUS_CONFIG['ACCEPTED'].iconColor}
                    />
                    <Text
                      variant="caption"
                      className="font-medium"
                      style={{ color: OFFER_STATUS_CONFIG['ACCEPTED'].iconColor }}
                    >
                      {OFFER_STATUS_CONFIG['ACCEPTED'].label}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  <Chip
                    label={`₺${match.offer.price.toLocaleString('tr-TR')}`}
                    variant="price"
                    isSelected
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {!isLoading && !isError && match?.status === 'ACTIVE' && isWaitingForOtherParty && (
        <BottomActionBar>
          <View className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-amber-100 px-4 dark:bg-amber-900">
            <Icon name="Clock" size={16} color="#D97706" />
            <Text
              variant="label"
              className="font-semibold text-amber-700 dark:text-amber-200"
              numberOfLines={1}
            >
              Karşı tarafın onayı bekleniyor
            </Text>
          </View>
        </BottomActionBar>
      )}

      {!isLoading && !isError && match?.status === 'ACTIVE' && !isWaitingForOtherParty && (
        <BottomActionBar
          actions={[
            {
              label: 'Eşleşmeyi Sonlandır',
              loadingLabel: 'Sonlandırılıyor...',
              onPress: handleRelease,
              variant: 'danger',
              isLoading: isReleasing,
            },
          ]}
        />
      )}
    </View>
  )
}
