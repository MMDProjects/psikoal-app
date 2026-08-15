import { ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Avatar } from '@/core/components/atoms/Avatar'
import { Badge } from '@/core/components/atoms/Badge'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import { useClientProfileQuery, MATCH_STATUS_CONFIG } from '@/domains/client'

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const clientQuery = useClientProfileQuery(id ?? '')
  const { data: client, isLoading, isError } = clientQuery
  const { isRefreshing, onRefresh } = useRefresh(clientQuery)
  const insets = useSafeAreaInsets()

  const initials = client?.initials ?? ''

  const statusCfg = client ? MATCH_STATUS_CONFIG[client.matchStatus] : null

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
              <Skeleton variant="circle" width={56} height={56} />
              <View className="flex-1 gap-2">
                <Skeleton variant="line" width="50%" height={18} />
                <Skeleton variant="line" width="65%" height={14} />
              </View>
            </View>
          </View>
          <Divider spacing="none" className="mx-4" />
          <View className="gap-3 px-4 py-5">
            <Skeleton variant="line" width="25%" height={11} />
            <Skeleton variant="rect" width={100} height={28} borderRadius="full" />
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Yüklenemedi"
          description="Danışan bilgileri alınamadı."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {client && (
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          <ScreenTitle title="Danışan Profili" />

          <View className="gap-4 px-4 py-5">
            <View className="flex-row items-center gap-3">
              <Avatar size="lg" initials={initials} />
              <View className="flex-1">
                <Text variant="subheading" className="leading-tight">
                  {client.fullName}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap items-center gap-3">
              {client.email ? (
                <View className="shrink flex-row items-center gap-1.5">
                  <Icon name="Mail" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary" numberOfLines={1} className="shrink">
                    {client.email}
                  </Text>
                </View>
              ) : null}
              {client.phone ? (
                <View className="shrink-0 flex-row items-center gap-1.5">
                  <Icon name="Phone" size={13} color="#A3A3A3" />
                  <Text variant="caption" color="tertiary">
                    {client.phone}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Divider spacing="none" className="mx-4" />
          <View className="gap-3 px-4 py-5">
            <Text
              variant="caption"
              color="secondary"
              className="font-semibold uppercase tracking-widest"
            >
              Eşleşme Durumu
            </Text>
            <View className="flex-row items-center gap-2">
              {statusCfg && <Badge label={statusCfg.label} variant={statusCfg.variant} />}
            </View>
          </View>

          {client.notes ? (
            <>
              <Divider spacing="none" className="mx-4" />
              <View className="gap-2 px-4 py-5">
                <View className="flex-row items-center gap-1.5">
                  <Text
                    variant="caption"
                    color="secondary"
                    className="font-semibold uppercase tracking-widest"
                  >
                    Notlar
                  </Text>
                  <Icon name="FileText" size={12} color="#A3A3A3" />
                </View>
                <Text variant="body" color="secondary" className="leading-relaxed">
                  {client.notes}
                </Text>
              </View>
            </>
          ) : null}

          <Divider spacing="none" className="mx-4" />
          <View className="gap-1 px-4 py-5">
            <Text
              variant="caption"
              color="secondary"
              className="font-semibold uppercase tracking-widest"
            >
              Kayıt Bilgisi
            </Text>
            <Text variant="caption" color="secondary">
              {formatDate(client.createdAt, 'long')} tarihinde kayıt oldu.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  )
}
