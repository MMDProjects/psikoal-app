import { useState } from 'react'

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { ForgotPasswordRequest } from '@/domains/auth'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { ForgotPasswordSchema, useForgotPasswordMutation } from '@/domains/auth'

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom
  const [sent, setSent] = useState(false)

  const { mutate: forgotPassword, isPending, error } = useForgotPasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const apiErrorMessage = error instanceof Error ? error.message : undefined

  const onSubmit = (data: ForgotPasswordRequest) => {
    forgotPassword(data, { onSuccess: () => setSent(true) })
  }

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />

      <BackButton />

      <ScreenTitle title="Şifremi Unuttum" topInset titleClassName="text-white" />

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
          {sent ? (
            <View className="items-center gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                <Icon name="MailCheck" size={32} color="#0EA5E9" />
              </View>
              <View className="items-center gap-2">
                <Text variant="heading" className="text-center text-white">
                  E-postanı Kontrol Et
                </Text>
                <Text variant="body" className="text-center text-sky-100">
                  Şifre sıfırlama bağlantısını e-posta adresine gönderdik.
                </Text>
              </View>
            </View>
          ) : (
            <View className="gap-5">
              <View className="gap-1">
                <Text variant="heading" className="text-white">
                  Şifreni mi Unuttun?
                </Text>
                <Text variant="body" className="text-sky-100">
                  E-posta adresini gir, sana bir sıfırlama bağlantısı gönderelim.
                </Text>
              </View>

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

        {!sent && (
          <BottomActionBar
            actions={[
              {
                label: 'Sıfırlama Bağlantısı Gönder',
                loadingLabel: 'Gönderiliyor...',
                onPress: handleSubmit(onSubmit),
                variant: 'inverse',
                isLoading: isPending,
              },
            ]}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  )
}
