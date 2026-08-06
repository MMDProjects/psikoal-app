import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

import { useRegisterPushTokenMutation } from '../api/useRegisterPushTokenMutation'

// PsikoAl kuralı: bildirim izni ilk login'de değil, kullanıcı ilk bildirimiyle
// karşılaştığında istenir (bkz. CLAUDE.md geliştirici notları). `enabled` bu yüzden
// çağıran ekran tarafından kontrol edilir (örn. bildirim listesi doluyken).
export function usePushTokenRegistration(enabled: boolean) {
  const { mutate: registerToken } = useRegisterPushTokenMutation()
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!enabled || hasRunRef.current) {
      return
    }

    hasRunRef.current = true

    async function register() {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Genel Bildirimler',
            importance: Notifications.AndroidImportance.DEFAULT,
          })
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync()
          finalStatus = status
        }

        if (finalStatus !== 'granted') {
          return
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined
        const { data: token } = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        )

        registerToken({ token, platform: Platform.OS === 'ios' ? 'ios' : 'android' })
      } catch {
        // Simülatör / Expo Go (Android SDK 53+) gibi push desteklemeyen ortamlarda sessizce geç.
      }
    }

    void register()
  }, [enabled, registerToken])
}
