import { useState } from 'react'

import { ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useRefresh } from '@/core/hooks'
import { usePackagesQuery, PackagePicker } from '@/domains/payment'

export default function PackagesScreen() {
  const router = useRouter()

  const packagesQuery = usePackagesQuery()
  const { data: packages, isLoading, isError } = packagesQuery
  const { isRefreshing, onRefresh } = useRefresh(packagesQuery)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const insets = useSafeAreaInsets()

  const selectedPkg = packages?.find((p) => p.id === selectedId)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingHorizontal: 16,
            paddingBottom: 20,
            gap: 16,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" height={120} borderRadius="xl" />
          ))}
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Paketler yüklenemedi"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {packages && (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 8,
              paddingHorizontal: 16,
              paddingBottom: 128,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          >
            <ScreenTitle title="Seans Paketleri" />
            <Text variant="body" color="secondary" className="mb-4">
              Toplu paket alımında tasarruf edin. Paketler satın alımdan itibaren 6 ay geçerlidir.
            </Text>
            <PackagePicker packages={packages} selectedId={selectedId} onSelect={setSelectedId} />
          </ScrollView>

          <BottomActionBar
            actions={[
              {
                label: selectedPkg
                  ? `₺${selectedPkg.price.toLocaleString('tr-TR')} — Devam Et`
                  : 'Paket Seçin',
                onPress: () => {
                  if (selectedId) router.push(`/payment/checkout?packageId=${selectedId}`)
                },
                isDisabled: !selectedId,
              },
            ]}
          />
        </>
      )}
    </View>
  )
}
