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
import { CheckboxRow } from '@/core/components/molecules/CheckboxRow'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { RegisterRequestSchema, useRegisterMutation, RoleCard } from '@/domains/auth'
import { getErrorMessage } from '@/lib/api'
import { openLegalDocument } from '@/lib/externalLinks'
import { useOnboardingStore } from '@/store/onboardingStore'

const TOTAL_STEPS = 2
const STEP_LABELS = ['Rol Seçimi', 'Bilgilerin']

export default function RegisterScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<UserRole | null>(null)

  const setOnboardIntent = useOnboardingStore((state) => state.setOnboardIntent)

  const { mutate: register, isPending, error } = useRegisterMutation()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'client',
      termsAccepted: false,
      healthDataConsent: false,
    },
  })

  const hasAllConsents = watch('termsAccepted') && watch('healthDataConsent')

  const onSubmit = (data: RegisterRequest) => {
    if (!role) return

    const target = role === 'expert' ? '/(auth)/onboarding/expert' : '/(auth)/onboarding/client'

    // setOnboardIntent ŞART, tek başına router.replace YETMEZ.
    // Kayıt başarılı olur olmaz isAuthenticated true'ya döner ve (auth)/_layout
    // henüz `register` segmentindeyken <Redirect href="/(tabs)" /> döndürür;
    // bu, hemen ardından gelen replace'i EZER. Belirti sessizdir: kullanıcı
    // profilsiz olarak Fırsatlar feed'ine düşer, onboarding'i hiç görmez ve
    // teklif göndermeye kalkınca anlamsız bir EXPERT_NOT_FOUND alır.
    // onboardIntent tam bu yarış için var; bugüne kadar yalnız giriş ekranındaki
    // test butonları kuruyordu, gerçek kayıt akışı kurmuyordu.
    setOnboardIntent(target)

    register(
      { ...data, role },
      {
        onSuccess: () => router.replace(target as never),
      }
    )
  }

  const apiErrorMessage = error ? getErrorMessage(error) : undefined
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

              <View className="mt-1 gap-3">
                <Controller
                  control={control}
                  name="termsAccepted"
                  render={({ field: { onChange, value } }) => (
                    <CheckboxRow
                      testID="register-terms"
                      tone="onBrand"
                      checked={value}
                      onToggle={() => onChange(!value)}
                      accessibilityLabel="Kullanım Koşulları ve Gizlilik Politikası'nı okudum, kabul ediyorum"
                    >
                      <Text
                        variant="caption"
                        className="font-semibold text-white underline"
                        onPress={() => void openLegalDocument('terms')}
                      >
                        Kullanım Koşulları
                      </Text>
                      {' ve '}
                      <Text
                        variant="caption"
                        className="font-semibold text-white underline"
                        onPress={() => void openLegalDocument('privacy')}
                      >
                        Gizlilik Politikası
                      </Text>
                      {"'nı okudum, kabul ediyorum."}
                    </CheckboxRow>
                  )}
                />
                <Controller
                  control={control}
                  name="healthDataConsent"
                  render={({ field: { onChange, value } }) => (
                    <CheckboxRow
                      testID="register-health-consent"
                      tone="onBrand"
                      checked={value}
                      onToggle={() => onChange(!value)}
                      accessibilityLabel="Sağlık verilerimin işlenmesine açık rıza veriyorum"
                    >
                      {
                        'Psikolojik test sonuçlarım ve ilanlarımdaki bilgiler dahil sağlık verilerimin, '
                      }
                      <Text
                        variant="caption"
                        className="font-semibold text-white underline"
                        onPress={() => void openLegalDocument('kvkk')}
                      >
                        KVKK Aydınlatma Metni
                      </Text>
                      {' kapsamında uzmanlarla eşleşme amacıyla işlenmesine açık rıza veriyorum.'}
                    </CheckboxRow>
                  )}
                />
                {errors.termsAccepted?.message || errors.healthDataConsent?.message ? (
                  <Text variant="caption" className="text-red-100">
                    {errors.termsAccepted?.message ?? errors.healthDataConsent?.message}
                  </Text>
                ) : null}
              </View>

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
                    isDisabled: !hasAllConsents,
                    loadingLabel: 'Kayıt yapılıyor...',
                  },
                ]
          }
        />
      </KeyboardAvoidingView>
    </View>
  )
}
