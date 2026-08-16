import { useEffect } from 'react'

import { Redirect, Stack, useSegments } from 'expo-router'

import { useAuthStore } from '@/domains/auth'
import { useOnboardingStore } from '@/store/onboardingStore'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasSeenWelcome = useOnboardingStore((s) => s.hasSeenWelcome)
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated)
  const onboardIntent = useOnboardingStore((s) => s.onboardIntent)
  const clearOnboardIntent = useOnboardingStore((s) => s.clearOnboardIntent)
  const segments = useSegments()

  // .at(1) kullanılıyor çünkü expo-router'ın typedRoutes tipleri `.expo/types/` altında
  // ÜRETİLİR ve gitignore'dadır. Temiz bir CI klonunda segments `[string]` tuple'ına düşer
  // ve `segments[1]` derleme hatası verir. `.at()` her iki durumda da `string | undefined`.
  const current = segments.at(1)

  useEffect(() => {
    if (current === 'onboarding' && onboardIntent) clearOnboardIntent()
  }, [current, onboardIntent, clearOnboardIntent])

  if (isAuthenticated && current !== 'onboarding') {
    if (onboardIntent) {
      return <Redirect href={onboardIntent as never} />
    }
    return <Redirect href="/(tabs)" />
  }

  if (!isAuthenticated && hasHydrated && !hasSeenWelcome && current !== 'welcome') {
    return <Redirect href="/(auth)/welcome" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
