import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Chip } from '@/core/components/atoms/Chip'
import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { InputField } from '@/core/components/molecules/InputField'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useExpertApprovalGate } from '@/domains/expert'
import { useSendOfferMutation, SendOfferSchema } from '@/domains/offer'

import type { SendOfferRequest } from '@/domains/offer'

export default function NewOfferScreen() {
  const router = useRouter()
  const { listingId } = useLocalSearchParams<{ listingId?: string }>()

  const { mutate: sendOffer, isPending, error } = useSendOfferMutation()
  const { canAct: canSendOffer, isPendingApproval } = useExpertApprovalGate()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SendOfferRequest>({
    resolver: zodResolver(SendOfferSchema),
    defaultValues: {
      listingId: listingId ?? '',
      title: '',
      sessionType: 'online',
      description: '',
      price: 0,
    },
  })

  const sessionType = watch('sessionType')
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const onSubmit = (data: SendOfferRequest) => {
    sendOffer(data, {
      onSuccess: () => {
        router.back()
      },
    })
  }

  const apiError = error instanceof Error ? error.message : undefined

  if (!canSendOffer) {
    return (
      <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
        <DecorCircles />
        <BackButton />
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
            <Icon name="Clock" size={36} color="#D97706" />
          </View>
          <Text variant="heading" align="center" className="text-white">
            {isPendingApproval ? 'Profiliniz Onay Bekliyor' : 'Profiliniz Onaylanmadı'}
          </Text>
          <Text variant="body" align="center" className="text-sky-100">
            {isPendingApproval
              ? 'Profiliniz admin onayından geçtikten sonra ilanlara teklif gönderebilirsiniz.'
              : 'Profil başvurunuz onaylanmadı. Destek ekibiyle iletişime geçebilirsiniz.'}
          </Text>
        </View>
        <BottomActionBar
          actions={[{ label: 'Geri Dön', onPress: () => router.back(), variant: 'inverse' }]}
        />
      </View>
    )
  }

  if (!listingId) {
    return (
      <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
        <DecorCircles />
        <View className="flex-1 items-center justify-center px-6 gap-4">
          <Icon name="AlertCircle" size={36} color="#FFFFFF" />
          <Text variant="label" align="center" className="text-white">
            İlan belirtilmedi. Lütfen bir ilanın sayfasından teklif gönderin.
          </Text>
        </View>
        <BottomActionBar
          actions={[{ label: 'Geri Dön', onPress: () => router.back(), variant: 'inverse' }]}
        />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />

      <BackButton />

      <ScreenTitle title="Teklif Gönder" topInset titleClassName="text-white" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="px-5 gap-5"
          contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                tone="onBrand"
                label="Teklif Başlığı (opsiyonel)"
                placeholder="örn. BDT ile Kaygı Yönetimi"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                tone="onBrand"
                label="Seans Ücreti (₺)"
                placeholder="örn. 750"
                keyboardType="numeric"
                value={value ? String(value) : ''}
                onChangeText={(v) => onChange(Number(v.replace(/[^0-9]/g, '')) || 0)}
                onBlur={onBlur}
                errorMessage={errors.price?.message}
                isRequired
              />
            )}
          />

          <View className="gap-2">
            <Text variant="label" className="font-semibold text-white">
              Seans Tipi <Text variant="caption" className="text-red-100">*</Text>
            </Text>
            <Controller
              control={control}
              name="sessionType"
              render={({ field: { onChange } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {([
                    { value: 'online',      label: 'Online'           },
                    { value: 'yüz_yüze',   label: 'Yüz Yüze'        },
                    { value: 'yüz_yüze_online', label: 'Yüz Yüze / Online' },
                  ] as const).map(({ value, label }) => (
                    <Chip
                      key={value}
                      label={label}
                      variant="onBrand"
                      size="md"
                      isSelected={sessionType === value}
                      onPress={() => onChange(value)}
                    />
                  ))}
                </View>
              )}
            />
            {errors.sessionType && (
              <Text variant="caption" className="text-red-100">{errors.sessionType.message}</Text>
            )}
          </View>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                tone="onBrand"
                label="Açıklama (opsiyonel)"
                placeholder="Danışana iletilecek kısa açıklama, en fazla 300 karakter..."
                multiline
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.description?.message}
              />
            )}
          />

          {apiError && (
            <View className="bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
              <Text variant="caption" className="text-red-600 dark:text-red-300">{apiError}</Text>
            </View>
          )}
        </ScrollView>

        <BottomActionBar
          actions={[{
            label: 'Teklif Gönder',
            loadingLabel: 'Gönderiliyor...',
            onPress: handleSubmit(onSubmit),
            isLoading: isPending,
            variant: 'inverse',
          }]}
        />
      </KeyboardAvoidingView>
    </View>
  )
}
