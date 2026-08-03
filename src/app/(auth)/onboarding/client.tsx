import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import { useAuthStore, useUpdateProfileMutation } from '@/domains/auth'

export default function ClientOnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const user = useAuthStore((s) => s.user)
  const { mutate: updateProfile, isPending, error } = useUpdateProfileMutation()

  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [kvkkError, setKvkkError] = useState<string | undefined>()

  const onSubmit = () => {
    if (!kvkkAccepted) {
      setKvkkError('Devam etmek için KVKK metnini onaylamalısınız')
      return
    }
    setKvkkError(undefined)

    updateProfile(
      { phone: phone || null, city: city || null },
      { onSuccess: () => router.replace('/(tabs)') }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />

      <ScreenTitle title="Profilini Tamamla" topInset titleClassName="text-white" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="px-5 gap-5 pt-2"
          contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center gap-3">
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
              <Icon name="CheckCircle" size={32} color="#0EA5E9" />
            </View>
            <Text variant="heading" align="center" className="text-white">
              {user?.firstName ? `Hoş Geldin, ${user.firstName}!` : 'Hoş Geldiniz!'}
            </Text>
            <Text variant="body" align="center" className="text-sky-100">
              Birkaç bilgi ile profilinizi tamamlayın. Bu bilgiler yalnızca eşleştiğiniz uzmanla,
              sizin izin verdiğiniz ölçüde paylaşılır.
            </Text>
          </View>

          <View className="gap-4 mt-2">
            <InputField
              tone="onBrand"
              label="Telefon"
              placeholder="05XX XXX XX XX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              hint="İsteğe bağlı"
            />

            <InputField
              tone="onBrand"
              label="Şehir"
              placeholder="Yaşadığınız şehir"
              autoCapitalize="words"
              value={city}
              onChangeText={setCity}
              hint="İsteğe bağlı"
            />

            <Pressable
              onPress={() => { setKvkkAccepted((v) => !v); setKvkkError(undefined) }}
              className={cn(
                'flex-row items-start gap-3 p-4 rounded-xl',
                kvkkAccepted ? 'bg-white dark:bg-white' : 'bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
              )}
            >
              <View
                className={cn(
                  'w-5 h-5 rounded border-2 items-center justify-center mt-0.5',
                  kvkkAccepted ? 'bg-sky-500 border-sky-500' : 'border-sky-300 dark:border-sky-700'
                )}
              >
                {kvkkAccepted && <Icon name="Check" size={12} color="#FFFFFF" />}
              </View>
              <Text
                variant="caption"
                className={cn('flex-1', kvkkAccepted ? 'text-neutral-600 dark:text-neutral-600' : 'text-sky-100')}
              >
                <Text
                  variant="caption"
                  className={kvkkAccepted ? 'text-sky-600 dark:text-sky-600 font-semibold' : 'text-white font-semibold'}
                >
                  KVKK Aydınlatma Metni
                </Text>
                {"'ni okudum ve kişisel verilerimin işlenmesini kabul ediyorum."}
              </Text>
            </Pressable>

            {kvkkError && (
              <Text variant="caption" className="text-red-100">{kvkkError}</Text>
            )}

            {apiErrorMessage && (
              <View className="bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
                <Text variant="caption" className="text-red-600 dark:text-red-300">
                  {apiErrorMessage}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <BottomActionBar
          actions={[
            {
              label: 'Şimdilik Atla',
              onPress: () => router.replace('/(tabs)'),
              variant: 'inverseGhost',
            },
            {
              label: 'Devam Et',
              onPress: onSubmit,
              variant: 'inverse',
              isLoading: isPending,
              loadingLabel: 'Kaydediliyor...',
            },
          ]}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
