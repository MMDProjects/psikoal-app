import '../../global.css'

import { useEffect } from 'react'

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans'
import { useColorScheme } from 'nativewind'

import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'

import { AppProviders } from '@/core/components/templates/AppProviders'
import '@/domains/notification/pushNotificationHandler'
import { useAuthStore } from '@/domains/auth'
import { registerUnauthenticatedHandler } from '@/lib/api'
import { useThemeStore } from '@/store/themeStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const { setColorScheme } = useColorScheme()
  const preference = useThemeStore((s) => s.preference)

  useEffect(() => {
    setColorScheme(preference)
  }, [preference, setColorScheme])

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  useEffect(() => {
    registerUnauthenticatedHandler(() => {
      // clearAuth ÖNCE çağrılmalı — yoksa (auth)/_layout.tsx hâlâ isAuthenticated=true
      // görüp /(tabs)'a geri yönlendirir, orada fetch yine 401 alır: sonsuz döngü.
      useAuthStore.getState().clearAuth()
      router.replace('/(auth)/login')
    })
  }, [router])

  if (!fontsLoaded && !fontError) return null

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  )
}
