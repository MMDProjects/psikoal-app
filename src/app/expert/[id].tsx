import { ScrollView, View } from 'react-native'

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
import { RatingRow } from '@/core/components/molecules/RatingRow'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StatPill } from '@/core/components/molecules/StatPill'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import { getFullName, getInitials } from '@/core/utils/personName'
import { useExpertProfileQuery, useExpertReviewsQuery } from '@/domains/expert'
import { SESSION_TYPE_LABELS } from '@/domains/listing'

export default function ExpertProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const expertQuery = useExpertProfileQuery(id ?? '')
  const { data: expert, isLoading, isError } = expertQuery
  const reviewsQuery = useExpertReviewsQuery(id ?? '')
  const reviews = reviewsQuery.data
  const { isRefreshing, onRefresh } = useRefresh(expertQuery, reviewsQuery)
  const insets = useSafeAreaInsets()

  const initials = expert?.initials ?? getInitials(expert)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="items-center pb-3 pt-2">
            <Skeleton variant="line" width="30%" height={14} />
          </View>
          <View className="gap-4 px-4 py-5">
            <View className="flex-row items-center gap-4">
              <Skeleton variant="circle" width={80} height={80} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="60%" height={18} />
                <Skeleton variant="line" width="40%" height={14} />
              </View>
            </View>
          </View>
          <Divider spacing="none" className="mx-4" />
          <View className="gap-3 px-4 py-5">
            <Skeleton variant="line" width="30%" height={11} />
            <View className="flex-row gap-2">
              <Skeleton variant="rect" width={90} height={28} borderRadius="full" />
              <Skeleton variant="rect" width={110} height={28} borderRadius="full" />
            </View>
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Uzman bulunamadı"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {!isLoading && !isError && expert && (
        <>
          <ScrollView
            contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          >
            <ScreenTitle title="Uzman Profili" />

            <View className="gap-4 px-4 py-5">
              <View className="flex-row items-center gap-4">
                <Avatar
                  size="xl"
                  src={expert.avatarUrl ?? undefined}
                  initials={initials}
                  isVerified={expert.isVerified}
                />
                <View className="flex-1 gap-1">
                  <Text variant="subheading">{getFullName(expert)}</Text>
                  <Text variant="body" color="secondary">
                    {expert.title}
                  </Text>
                  <RatingRow rating={expert.rating} reviewCount={expert.reviewCount} size="sm" />
                </View>
              </View>

              {expert.status === 'pending' && (
                <View className="flex-row items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950">
                  <Icon name="Clock" size={18} color="#CA8A04" />
                  <Text variant="caption" className="flex-1 text-amber-700 dark:text-amber-400">
                    Bu profil henüz admin onayı bekliyor.
                  </Text>
                </View>
              )}
            </View>

            {expert.specializations.length > 0 && (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="gap-2.5 px-4 py-5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Uzmanlık Alanları
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {expert.specializations.map((spec) => (
                      <Chip key={spec} label={spec} variant="filter" isSelected />
                    ))}
                  </View>
                </View>
              </>
            )}

            <Divider spacing="none" className="mx-4" />
            <View className="px-4 py-5">
              <View className="flex-row items-center">
                <StatPill value={`${expert.experienceYears} yıl`} label="Deneyim" />
                <Divider orientation="vertical" spacing="none" className="h-10" />
                <StatPill value={expert.rating.toFixed(1)} label="Puan" />
                <Divider orientation="vertical" spacing="none" className="h-10" />
                <StatPill value={expert.reviewCount.toString()} label="Değerlendirme" />
              </View>
            </View>

            {expert.bio ? (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="gap-2 px-4 py-5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Biyografi
                  </Text>
                  <Text variant="body" color="secondary" className="leading-relaxed">
                    {expert.bio}
                  </Text>
                </View>
              </>
            ) : null}

            {expert.education ? (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="gap-2 px-4 py-5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Eğitim
                  </Text>
                  <Text variant="body" color="secondary" className="leading-relaxed">
                    {expert.education}
                  </Text>
                </View>
              </>
            ) : null}

            {(expert.cvUrl ||
              (expert.certificates && expert.certificates.length > 0) ||
              expert.personalWebsite) && (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="gap-3 px-4 py-5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Belgeler ve Bağlantılar
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {expert.cvUrl && (
                      <View className="flex-row items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 dark:bg-dark-control">
                        <Icon name="FileCheck2" size={13} color="#0EA5E9" />
                        <Text variant="caption" className="font-medium">
                          CV Mevcut
                        </Text>
                      </View>
                    )}
                    {expert.certificates?.map((cert) => (
                      <Chip key={cert} label={cert} variant="tag" isSelected />
                    ))}
                  </View>
                  {expert.personalWebsite && (
                    <View className="flex-row items-center gap-1.5">
                      <Icon name="Globe" size={13} color="#A3A3A3" />
                      <Text variant="caption" color="tertiary">
                        {expert.personalWebsite}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            {reviews && reviews.length > 0 && (
              <>
                <Divider spacing="none" className="mx-4" />
                <View className="gap-4 px-4 py-5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Değerlendirmeler ({reviews.length})
                  </Text>

                  <View className="gap-4">
                    {reviews.map((review, i) => (
                      <View key={review.id} className="gap-3">
                        {i > 0 && <Divider spacing="none" />}
                        <View className="gap-2">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                              <Avatar size="xs" />
                              <Text variant="caption" color="tertiary">
                                Danışan
                              </Text>
                            </View>
                            <Text variant="caption" color="tertiary">
                              {formatDate(review.createdAt, 'long')}
                            </Text>
                          </View>
                          <RatingRow rating={review.rating} size="sm" showEmpty={false} />
                          <Text variant="body" color="secondary" className="leading-relaxed">
                            {review.comment}
                          </Text>
                          {review.sessionType && (
                            <View className="flex-row">
                              <Chip
                                label={
                                  SESSION_TYPE_LABELS[review.sessionType] ?? review.sessionType
                                }
                                variant="session"
                                size="sm"
                                isSelected
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}
    </View>
  )
}
