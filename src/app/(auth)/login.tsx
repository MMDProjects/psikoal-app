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

const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

export default function LoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { mutate: login, isPending, error } = useLoginMutation()

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

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View
      testID="screen-login"
      className="flex-1 bg-sky-500 dark:bg-sky-950"
      style={{ overflow: 'hidden' }}
    >
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
                  testID="login-email"
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
                  testID="login-password"
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
        </ScrollView>

        <BottomActionBar
          actions={[
            {
              testID: 'login-submit',
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
