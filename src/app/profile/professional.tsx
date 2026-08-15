import { useEffect, useState } from 'react'

import { Pressable, ScrollView, View } from 'react-native'

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
import { themeColors, useThemeColors } from '@/core/theme'
import { useAuthStore } from '@/domains/auth'
import { useCategoriesQuery } from '@/domains/category'
import { useExpertProfileQuery, useExpertProfileMutation } from '@/domains/expert'

export default function ProfessionalInfoScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const insets = useSafeAreaInsets()
  const bottomBarHeight = 56 + insets.bottom

  const { data: categories } = useCategoriesQuery()
  const expertQuery = useExpertProfileQuery(user?.id ?? '')
  const { data: expert, isLoading, isError } = expertQuery
  const { isRefreshing, onRefresh } = useRefresh(expertQuery)
  const { mutate: updateProfile, isPending } = useExpertProfileMutation()
  const colors = useThemeColors()

  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState<string | undefined>()
  const [specs, setSpecs] = useState<string[]>([])
  const [specsError, setSpecsError] = useState<string | undefined>()
  const [experienceYears, setExperienceYears] = useState(0)
  const [education, setEducation] = useState('')
  const [bio, setBio] = useState('')
  const [bioError, setBioError] = useState<string | undefined>()

  useEffect(() => {
    if (!expert) return
    setTitle(expert.title)
    setSpecs(expert.specializations)
    setExperienceYears(expert.experienceYears)
    setEducation(expert.education ?? '')
    setBio(expert.bio)
  }, [expert])

  const toggleSpec = (spec: string) => {
    setSpecs((prev) => (prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]))
    setSpecsError(undefined)
  }

  const handleSave = () => {
    let hasError = false
    if (title.trim().length < 2) {
      setTitleError('Ünvan en az 2 karakter olmalı')
      hasError = true
    } else {
      setTitleError(undefined)
    }
    if (specs.length === 0) {
      setSpecsError('En az bir uzmanlık alanı seçiniz')
      hasError = true
    } else {
      setSpecsError(undefined)
    }
    if (bio.trim().length < 50) {
      setBioError('Biyografi en az 50 karakter olmalı')
      hasError = true
    } else {
      setBioError(undefined)
    }
    if (hasError) return

    updateProfile(
      {
        title: title.trim(),
        specializations: specs,
        experienceYears,
        education: education.trim() || null,
        bio: bio.trim(),
      },
      { onSuccess: () => router.back() }
    )
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      {isLoading && (
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="items-center pb-3 pt-2">
            <Skeleton variant="line" width="40%" height={14} />
          </View>
          <View className="gap-3 px-4 py-5">
            <Skeleton variant="rect" height={44} borderRadius="lg" />
            <View className="flex-row flex-wrap gap-2">
              <Skeleton variant="rect" width={100} height={32} borderRadius="full" />
              <Skeleton variant="rect" width={120} height={32} borderRadius="full" />
            </View>
          </View>
        </View>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Yüklenemedi"
          description="Mesleki bilgiler alınamadı."
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
            <ScreenTitle title="Mesleki Bilgiler" />

            <View className="gap-4 px-4 py-5">
              <InputField
                label="Ünvan"
                placeholder="Örn: Klinik Psikolog, Psikoterapist"
                value={title}
                onChangeText={(t) => {
                  setTitle(t)
                  setTitleError(undefined)
                }}
                errorMessage={titleError}
                isRequired
              />
            </View>

            <Divider spacing="none" className="mx-4" />
            <View className="gap-3 px-4 py-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                Uzmanlık Alanları
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {categories?.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    variant="filter"
                    size="md"
                    isSelected={specs.includes(category.name)}
                    onPress={() => toggleSpec(category.name)}
                  />
                ))}
              </View>
              {specsError && (
                <Text variant="caption" color="error">
                  {specsError}
                </Text>
              )}
            </View>

            <Divider spacing="none" className="mx-4" />
            <View className="gap-3 px-4 py-5">
              <Text
                variant="caption"
                color="secondary"
                className="font-semibold uppercase tracking-widest"
              >
                Deneyim Süresi
              </Text>
              <View className="flex-row items-center justify-between rounded-xl bg-neutral-100 px-5 py-4 dark:bg-dark-control">
                <Pressable
                  onPress={() => setExperienceYears((y) => Math.max(0, y - 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Deneyim yılını azalt"
                  className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-neutral-50 dark:bg-dark-elevated"
                >
                  <Icon name="Minus" size={20} color={colors.contentPrimary} />
                </Pressable>

                <View className="items-center">
                  <Text variant="display">{experienceYears}</Text>
                  <Text variant="caption" color="secondary">
                    yıl deneyim
                  </Text>
                </View>

                <Pressable
                  onPress={() => setExperienceYears((y) => Math.min(50, y + 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Deneyim yılını artır"
                  className="h-10 w-10 items-center justify-center rounded-full bg-sky-500 active:bg-sky-600"
                >
                  <Icon name="Plus" size={20} color={themeColors.light.contentInverse} />
                </Pressable>
              </View>
            </View>

            <Divider spacing="none" className="mx-4" />
            <View className="gap-4 px-4 py-5">
              <InputField
                label="Eğitim Bilgisi"
                placeholder="örn. İstanbul Üniversitesi, Klinik Psikoloji (Yüksek Lisans)"
                value={education}
                onChangeText={setEducation}
                multiline
              />
              <InputField
                label="Biyografi"
                placeholder="Kendinizi danışanlara tanıtın."
                value={bio}
                onChangeText={(t) => {
                  setBio(t)
                  setBioError(undefined)
                }}
                errorMessage={bioError}
                multiline
                hint={`${bio.length}/1000 karakter (minimum 50)`}
                isRequired
              />
            </View>
          </ScrollView>

          <BottomActionBar
            actions={[
              {
                label: 'Kaydet',
                loadingLabel: 'Kaydediliyor...',
                onPress: handleSave,
                isLoading: isPending,
              },
            ]}
          />
        </>
      )}
    </View>
  )
}
