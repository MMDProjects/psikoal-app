import { useMemo } from 'react'

import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'

import type { ResetPasswordForm } from '@/domains/auth'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import {
  parseRecoveryLink,
  ResetPasswordFormSchema,
  RESET_TOKEN_INVALID,
  useResetPasswordMutation,
} from '@/domains/auth'
import { ApiError, getErrorMessage } from '@/lib/api'

/**
 * Şifre sıfırlama (sözleşme §2). E-postadaki bağlantı uygulamayı
 * `psikoal://reset-password#access_token=...&type=recovery` ile açar; token
 * URL parçasında olduğu için expo-router parametresi olarak gelmez, uygulamayı
 * açan adres expo-linking'den okunur.
 */
export default function ResetPasswordScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  // useLinkingURL ilk değeri eşzamanlı okur ve native taraf onu her yeni bağlantıda
  // günceller; uygulama zaten açıkken gelen bağlantı da böylece kaçmaz.
  const url = Linking.useLinkingURL()
  const link = useMemo(() => parseRecoveryLink(url), [url])

  const { mutate: resetPassword, isPending, error } = useResetPasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const isTokenRejected = error instanceof ApiError && error.code === RESET_TOKEN_INVALID
  const isLinkUnusable = link.status !== 'valid' || isTokenRejected
  const apiErrorMessage = error && !isTokenRejected ? getErrorMessage(error) : undefined

  const onSubmit = ({ newPassword }: ResetPasswordForm) => {
    if (link.status !== 'valid') return
    resetPassword(
      { accessToken: link.accessToken, newPassword },
      {
        onSuccess: () => {
          Alert.alert('Şifreniz güncellendi', 'Yeni şifrenizle giriş yapabilirsiniz.')
          router.replace('/(auth)/login')
        },
      }
    )
  }

  return (
    <View
      testID="screen-reset-password"
      className="flex-1 bg-sky-500 dark:bg-sky-950"
      style={{ overflow: 'hidden' }}
    >
      <DecorCircles />

      <BackButton onPress={() => router.replace('/(auth)/login')} />

      <ScreenTitle title="Yeni Şifre" topInset titleClassName="text-white" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-5 gap-6"
          contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isLinkUnusable ? (
            <View className="items-center gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                <Icon name="Link" size={30} color="#0EA5E9" />
              </View>
              <View className="items-center gap-2">
                <Text variant="heading" className="text-center text-white">
                  Bağlantı geçersiz
                </Text>
                <Text variant="body" className="text-center text-sky-100">
                  Şifre sıfırlama bağlantısının süresi dolmuş ya da daha önce kullanılmış. Yeni bir
                  bağlantı isteyebilirsiniz.
                </Text>
              </View>
            </View>
          ) : (
            <View className="gap-5">
              <View className="gap-1">
                <Text variant="heading" className="text-white">
                  Yeni şifreni belirle
                </Text>
                <Text variant="body" className="text-sky-100">
                  En az 8 karakterden oluşan yeni bir şifre gir.
                </Text>
              </View>

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    testID="reset-password-new"
                    tone="onBrand"
                    label="Yeni Şifre"
                    placeholder="En az 8 karakter"
                    isSecure
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.newPassword?.message}
                    isRequired
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    testID="reset-password-confirm"
                    tone="onBrand"
                    label="Yeni Şifre (Tekrar)"
                    placeholder="Şifreni tekrar gir"
                    isSecure
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.confirmPassword?.message}
                    isRequired
                  />
                )}
              />

              {apiErrorMessage && (
                <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950">
                  <Text variant="caption" className="text-red-600 dark:text-red-300">
                    {apiErrorMessage}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <BottomActionBar
          actions={
            isLinkUnusable
              ? [
                  {
                    label: 'Yeni Bağlantı İste',
                    onPress: () => router.replace('/(auth)/forgot-password'),
                    variant: 'inverse',
                  },
                ]
              : [
                  {
                    testID: 'reset-password-submit',
                    label: 'Şifreyi Güncelle',
                    loadingLabel: 'Güncelleniyor...',
                    onPress: handleSubmit(onSubmit),
                    variant: 'inverse',
                    isLoading: isPending,
                  },
                ]
          }
        />
      </KeyboardAvoidingView>
    </View>
  )
}
