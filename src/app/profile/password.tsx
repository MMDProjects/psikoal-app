import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import type { ChangePasswordRequest } from '@/domains/auth'

import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useChangePasswordMutation, ChangePasswordSchema } from '@/domains/auth'

export default function PasswordScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const { mutate: changePassword, isPending, error } = useChangePasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const apiError = error instanceof Error ? error.message : undefined

  const onSubmit = (data: ChangePasswordRequest) => {
    changePassword(data, {
      onSuccess: () => {
        Alert.alert('Başarılı', 'Şifreniz güncellendi.', [
          { text: 'Tamam', onPress: () => router.back() },
        ])
      },
    })
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingBottom: bottomBarHeight + 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenTitle title="Şifre Yönetimi" />

          <View className="gap-4 px-4 py-5">
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Mevcut Şifre"
                  placeholder="Mevcut şifreniz"
                  isSecure
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.currentPassword?.message}
                  isRequired
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
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
                  label="Yeni Şifre (Tekrar)"
                  placeholder="Yeni şifrenizi tekrar giriniz"
                  isSecure
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.confirmPassword?.message}
                  isRequired
                />
              )}
            />

            {apiError && (
              <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950">
                <Text variant="caption" color="error">
                  {apiError}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <BottomActionBar
          actions={[
            {
              label: 'Şifreyi Güncelle',
              loadingLabel: 'Güncelleniyor...',
              onPress: handleSubmit(onSubmit),
              isLoading: isPending,
            },
          ]}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
