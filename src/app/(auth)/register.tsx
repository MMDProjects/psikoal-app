import { useState } from 'react'

import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import type { RegisterRequest } from '@/domains/auth'
import type { UserRole } from '@/domains/auth'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { RegisterRequestSchema, useRegisterMutation, RoleCard } from '@/domains/auth'

const TOTAL_STEPS = 2
const STEP_LABELS = ['Rol Seçimi', 'Bilgilerin']

export default function RegisterScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<UserRole | null>(null)

  const { mutate: register, isPending, error } = useRegisterMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '', role: 'client' },
  })

  const onSubmit = (data: RegisterRequest) => {
    if (!role) return
    register(
      { ...data, role },
      {
        onSuccess: () => {
          router.replace(
            role === 'expert' ? '/(auth)/onboarding/expert' : '/(auth)/onboarding/client'
          )
        },
      }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles phase={step} />

      <BackButton onPress={() => (step === 2 ? setStep(1) : router.back())} />

      <ScreenTitle title="Hesap Oluştur" topInset titleClassName="text-white" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-5 pb-4 pt-2">
          <StepProgress current={step} total={TOTAL_STEPS} label={STEP_LABELS[step - 1]} />
        </View>

        <ScrollView
          contentContainerClassName="px-5 gap-5"
          contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <View className="gap-5">
              <View className="gap-1">
                <Text variant="heading" className="text-white">
                  Aramıza Katıl
                </Text>
                <Text variant="body" className="text-sky-100">
                  Platforma nasıl katılmak istiyorsunuz?
                </Text>
              </View>

              <View className="flex-row gap-3">
                <RoleCard
                  role="expert"
                  selected={role === 'expert'}
                  onPress={() => setRole('expert')}
                />
                <RoleCard
                  role="client"
                  selected={role === 'client'}
                  onPress={() => setRole('client')}
                />
              </View>
            </View>
          ) : (
            <View className="gap-4">
              <View className="gap-1">
                <Text variant="heading" className="text-white">
                  Bilgilerini Gir
                </Text>
                <Text variant="body" className="text-sky-100">
                  Hesabını oluşturmak için son bir adım kaldı.
                </Text>
              </View>

              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    tone="onBrand"
                    label="Ad"
                    placeholder="Adınız"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.firstName?.message}
                    isRequired
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    tone="onBrand"
                    label="Soyad"
                    placeholder="Soyadınız"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.lastName?.message}
                    isRequired
                  />
                )}
              />

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
                    placeholder="En az 8 karakter"
                    isSecure
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.password?.message}
                    hint="En az 8 karakter olmalıdır"
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

          <View className="mt-3 flex-row items-center justify-center gap-1">
            <Text variant="body" className="text-sky-100">
              Zaten hesabın var mı?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text variant="body" className="font-semibold text-white">
                Giriş Yap
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <BottomActionBar
          actions={
            step === 1
              ? [
                  {
                    label: 'Devam Et',
                    onPress: () => setStep(2),
                    variant: 'inverse',
                    isDisabled: !role,
                  },
                ]
              : [
                  {
                    label: 'Kayıt Ol',
                    onPress: handleSubmit(onSubmit),
                    variant: 'inverse',
                    isLoading: isPending,
                    loadingLabel: 'Kayıt yapılıyor...',
                  },
                ]
          }
        />
      </KeyboardAvoidingView>
    </View>
  )
}
