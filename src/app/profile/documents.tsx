import { Alert, Pressable, ScrollView, View } from 'react-native'

import { Controller, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Chip } from '@/core/components/atoms/Chip'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { InputField } from '@/core/components/molecules/InputField'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useRefresh } from '@/core/hooks'
import { useThemeColors } from '@/core/theme'
import { useAuthStore } from '@/domains/auth'
import { useExpertProfileQuery, useExpertProfileMutation } from '@/domains/expert'

type DocumentsForm = { personalWebsite: string }

export default function DocumentsScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const expertQuery = useExpertProfileQuery(user?.id ?? '')
  const { data: expert, isLoading, isError } = expertQuery
  const { isRefreshing, onRefresh } = useRefresh(expertQuery)
  const { mutate: updateProfile, isPending } = useExpertProfileMutation()
  const colors = useThemeColors()

  const { control, handleSubmit } = useForm<DocumentsForm>({
    values: { personalWebsite: expert?.personalWebsite ?? '' },
  })

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'Bu özellik yakında aktif olacak.')
  }

  const onSubmit = (data: DocumentsForm) => {
    updateProfile(
      { personalWebsite: data.personalWebsite.trim() || null },
      { onSuccess: () => router.back() }
    )
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="items-center pb-3 pt-2">
            <Skeleton variant="line" width="45%" height={14} />
          </View>
          <View className="gap-3 px-4 py-5">
            <Skeleton variant="rect" height={56} borderRadius="xl" />
            <Skeleton variant="rect" height={56} borderRadius="xl" />
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Yüklenemedi"
          description="Belgeler alınamadı."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {!isLoading && !isError && expert && (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 8,
              paddingBottom: bottomBarHeight + 16,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          >
            <ScreenTitle title="Belgeler ve Bağlantılar" />

            <View className="gap-3 px-4 py-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                Özgeçmiş (CV)
              </Text>
              <Pressable
                onPress={() => showComingSoon('CV Yükle')}
                className="flex-row items-center gap-3 py-2 active:opacity-90"
              >
                <Icon name="FileUp" size={18} color={colors.brand} />
                <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">
                  {expert.cvUrl ? 'CV Güncelle' : 'CV Yükle'}
                </Text>
                {expert.cvUrl && <Icon name="CheckCircle2" size={16} color={colors.success} />}
                <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
              </Pressable>
            </View>

            <Divider spacing="none" className="mx-4" />
            <View className="gap-3 px-4 py-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                Sertifikalar
              </Text>
              {expert.certificates && expert.certificates.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5">
                  {expert.certificates.map((cert) => (
                    <Chip key={cert} label={cert} variant="tag" isSelected />
                  ))}
                </View>
              )}
              <Pressable
                onPress={() => showComingSoon('Sertifika Ekle')}
                className="flex-row items-center gap-3 py-2 active:opacity-90"
              >
                <Icon name="Award" size={18} color={colors.brand} />
                <Text variant="body" className="flex-1 dark:text-[#F5F5F7]">
                  Sertifika Ekle
                </Text>
                <Icon name="ChevronRight" size={16} color={colors.contentDisabled} />
              </Pressable>
            </View>

            <Divider spacing="none" className="mx-4" />
            <View className="gap-3 px-4 py-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                Bağlantılar
              </Text>
              <Controller
                control={control}
                name="personalWebsite"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Kişisel Site"
                    placeholder="https://ornek.com"
                    keyboardType="url"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </ScrollView>

          <BottomActionBar
            actions={[
              {
                label: 'Kaydet',
                loadingLabel: 'Kaydediliyor...',
                onPress: handleSubmit(onSubmit),
                isLoading: isPending,
              },
            ]}
          />
        </>
      )}
    </View>
  )
}
