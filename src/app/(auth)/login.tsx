import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import type { LoginRequest } from '@/domains/auth'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { LoginRequestSchema, useLoginMutation } from '@/domains/auth'
import { useOnboardingStore } from '@/store/onboardingStore'

const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

export default function LoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { mutate: login, isPending, error } = useLoginMutation()
  const resetWelcome = useOnboardingStore((s) => s.resetWelcome)
  const setOnboardIntent = useOnboardingStore((s) => s.setOnboardIntent)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginRequest) => {
    login(data, {
      onSuccess: () => router.replace('/(tabs)'),
    })
  }

  const quickLogin = (email: string) => {
    login(
      { email, password: 'password123' },
      {
        onSuccess: () => router.replace('/(tabs)'),
      }
    )
  }

  const quickOnboard = (email: string, target: string) => {
    setOnboardIntent(target)
    login({ email, password: 'password123' })
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6"
          contentContainerStyle={{
            paddingTop: insets.top + 24,
            paddingBottom: bottomBarHeight + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10 items-center gap-3">
            <View className="rounded-xl bg-white px-4 py-2">
              <Image
                source={LOGO_PLACEHOLDER}
                style={{ width: 172, height: 40 }}
                resizeMode="contain"
                accessibilityLabel="PsikoAl"
              />
            </View>
            <Text variant="body" className="text-sky-100" align="center">
              Psikoloğunuza ulaşmanın en kolay yolu
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  tone="onBrand"
                  label="E-posta"
                  placeholder="ornek@mail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.email?.message}
                  isRequired
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  tone="onBrand"
                  label="Şifre"
                  placeholder="••••••••"
                  isSecure
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.password?.message}
                  isRequired
                />
              )}
            />

            <Pressable onPress={() => router.push('/(auth)/forgot-password')} className="self-end">
              <Text variant="caption" className="text-sky-100">
                Şifremi Unuttum?
              </Text>
            </Pressable>

            {apiErrorMessage && (
              <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950">
                <Text variant="caption" className="text-red-600 dark:text-red-300">
                  {apiErrorMessage}
                </Text>
              </View>
            )}
          </View>

          <View className="mt-8 flex-row items-center justify-center gap-1">
            <Text variant="body" className="text-sky-100">
              Hesabın yok mu?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text variant="body" className="font-semibold text-white">
                Kayıt Ol
              </Text>
            </Pressable>
          </View>

          {process.env.EXPO_PUBLIC_APP_ENV !== 'production' && (
            <View className="mt-8 gap-2">
              <View className="flex-row items-center gap-3">
                <View className="h-px flex-1 bg-sky-400 dark:bg-sky-800" />
                <Text variant="caption" className="text-sky-100">
                  Test Girişi
                </Text>
                <View className="h-px flex-1 bg-sky-400 dark:bg-sky-800" />
              </View>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => quickLogin('uzman@psikoal.com')}
                  disabled={isPending}
                  className="flex-1 items-center rounded-xl bg-sky-600 py-3 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
                >
                  <Text variant="caption" className="font-semibold text-white">
                    Uzman Girişi
                  </Text>
                  <Text variant="caption" className="text-sky-100">
                    Dr. Ayşe Kaya
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => quickLogin('danisan@psikoal.com')}
                  disabled={isPending}
                  className="flex-1 items-center rounded-xl bg-sky-600 py-3 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
                >
                  <Text variant="caption" className="font-semibold text-white">
                    Danışan Girişi
                  </Text>
                  <Text variant="caption" className="text-sky-100">
                    Zeynep Yılmaz
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => quickOnboard('uzman@psikoal.com', '/(auth)/onboarding/expert')}
                  disabled={isPending}
                  className="flex-1 items-center rounded-xl bg-sky-600 py-3 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
                >
                  <Text variant="caption" className="font-semibold text-white">
                    Onboard Uzman
                  </Text>
                  <Text variant="caption" className="text-sky-100">
                    Profil tamamlama akışı
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => quickOnboard('danisan@psikoal.com', '/(auth)/onboarding/client')}
                  disabled={isPending}
                  className="flex-1 items-center rounded-xl bg-sky-600 py-3 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
                >
                  <Text variant="caption" className="font-semibold text-white">
                    Onboard Danışan
                  </Text>
                  <Text variant="caption" className="text-sky-100">
                    Profil tamamlama akışı
                  </Text>
                </Pressable>
              </View>

              <Pressable onPress={resetWelcome} className="items-center py-2 active:opacity-70">
                <Text variant="caption" className="text-sky-100 underline">
                  Karşılama turunu sıfırla (ilk açılışı test et)
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        <BottomActionBar
          actions={[
            {
              label: 'Giriş Yap',
              onPress: handleSubmit(onSubmit),
              variant: 'inverse',
              isLoading: isPending,
              loadingLabel: 'Giriş yapılıyor...',
            },
          ]}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
