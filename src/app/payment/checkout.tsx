import { useEffect, useRef } from 'react'

import { View } from 'react-native'

import { useColorScheme } from 'nativewind'
import WebView from 'react-native-webview'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useInitiateCheckoutMutation } from '@/domains/payment'

export default function CheckoutScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>()
  const router = useRouter()
  const { colorScheme } = useColorScheme()

  const {
    mutate: initiateCheckout,
    data: session,
    isPending,
    isError,
  } = useInitiateCheckoutMutation()
  const hasInitiated = useRef(false)

  useEffect(() => {
    if (packageId && !hasInitiated.current) {
      hasInitiated.current = true
      initiateCheckout({ packageId })
    }
  }, [packageId, initiateCheckout])

  const handleNavigationChange = (navState: { url: string }) => {
    if (navState.url.includes('/payment/success')) {
      router.replace('/(tabs)/profile')
    } else if (navState.url.includes('/payment/failure')) {
      router.back()
    }
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScreenTitle
        title="Güvenli Ödeme"
        topInset
        className="border-b border-neutral-100 dark:border-dark-border"
      >
        <View className="flex-row items-center gap-1">
          <Icon name="Lock" size={10} color={colorScheme === 'dark' ? '#A3A3A3' : '#737373'} />
          <Text variant="caption" color="secondary">
            Iyzico ile güvenli
          </Text>
        </View>
      </ScreenTitle>

      {isPending && (
        <View className="flex-1 gap-4 p-4">
          <Skeleton variant="rect" height={50} borderRadius="xl" />
          <Skeleton variant="rect" height={200} borderRadius="xl" />
          <Skeleton variant="rect" height={60} borderRadius="xl" />
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Ödeme başlatılamadı"
          description="Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {session && (
        <WebView
          source={{ uri: session.paymentPageUrl }}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-surface-base dark:bg-dark-bg">
              <Skeleton variant="rect" height={300} borderRadius="xl" />
            </View>
          )}
        />
      )}
    </View>
  )
}
