import { useState } from 'react'

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useAuthStore, useUpdateProfileMutation } from '@/domains/auth'

export default function ClientOnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const user = useAuthStore((s) => s.user)
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation()

  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  const onSubmit = () => {
    updateProfile(
      { phone: phone || null, city: city || null },
      { onSuccess: () => router.replace('/(tabs)') }
    )
  }

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
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
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

          <View className="mt-2 gap-4">
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
          </View>
        </ScrollView>

        <BottomActionBar
          actions={[
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
