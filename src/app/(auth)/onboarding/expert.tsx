import { useState } from 'react'

import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import type { ExpertOnboarding } from '@/domains/expert'
import type { PickedDocument } from '@/domains/expert'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { useAuthStore, useChangeAvatar, useUpdateProfileMutation } from '@/domains/auth'
import {
  useCreateExpertProfileMutation,
  OnboardingStepTitle,
  OnboardingStepSpecs,
  OnboardingStepExperience,
  OnboardingStepContact,
  OnboardingStepBio,
  OnboardingStepDocuments,
  OnboardingStepPhoto,
  useUploadExpertDocumentMutation,
  pickExpertDocument,
} from '@/domains/expert'

const TOTAL_STEPS = 7
const STEP_LABELS = [
  'Ünvan',
  'Uzmanlık',
  'Deneyim',
  'İletişim',
  'Biyografi',
  'Belgeler',
  'Fotoğraf',
]

const STEP_TITLES = [
  'Ünvanınız nedir?',
  'Uzmanlık Alanları',
  'Deneyim Süreniz',
  'İletişim Bilgileriniz',
  'Biyografi & Eğitim',
  'Belgeler & Bağlantılar',
  'Profil Fotoğrafı',
]

const STEP_SUBTITLES: Array<string | undefined> = [
  'Danışanlar sizi bu ünvanla görecek',
  'Birden fazla alan seçebilirsiniz',
  undefined,
  'Eşleşme sonrası danışanla paylaşılabilir',
  'Danışanlara kendinizi tanıtın',
  'Profilinizin güvenilirliğini artırır',
  undefined,
]

export default function ExpertOnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState(1)
  const {
    mutate: createProfile,
    isPending: isCreatingProfile,
    error,
  } = useCreateExpertProfileMutation()
  const { mutate: updateAuthProfile, isPending: isUpdatingAuthProfile } = useUpdateProfileMutation()

  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState<string | undefined>()
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [specsError, setSpecsError] = useState<string | undefined>()
  const [experienceYears, setExperienceYears] = useState(0)
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [bioError, setBioError] = useState<string | undefined>()
  const [education, setEducation] = useState('')
  const [personalWebsite, setPersonalWebsite] = useState('')

  const avatarUrl = useAuthStore((s) => s.user?.avatarUrl ?? null)
  const { changeAvatar, isUploading: isUploadingAvatar } = useChangeAvatar()

  const isPending = isCreatingProfile || isUpdatingAuthProfile

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1)
    else router.back()
  }

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
    setSpecsError(undefined)
  }

  // Belgeler ONBOARDING SIRASINDA YÜKLENEMEZ: yükleme uçları
  // (POST /experts/profile/cv) `experts` satırını arıyor ve o satır ancak profil
  // oluşturulduktan sonra var oluyor. Onboarding'de yüklemeye kalkmak
  // EXPERT_NOT_FOUND verirdi. Bu yüzden dosya burada yalnız SEÇİLİR, profil
  // oluştuktan hemen sonra yüklenir.
  const [pendingCv, setPendingCv] = useState<PickedDocument | null>(null)
  const [pendingCertificate, setPendingCertificate] = useState<PickedDocument | null>(null)

  const { mutateAsync: uploadCv } = useUploadExpertDocumentMutation('cv')
  const { mutateAsync: uploadCertificate } = useUploadExpertDocumentMutation('certificate')

  const chooseDocument = async (label: string, keep: (document: PickedDocument) => void) => {
    const picked = await pickExpertDocument()

    // İptal sessiz geçilir; reddedilen dosya mutlaka söylenir, yoksa dokunma
    // hiçbir şey yapmamış gibi görünür.
    if (picked.status === 'canceled') return
    if (picked.status === 'rejected') {
      Alert.alert(label, picked.message)
      return
    }

    keep(picked.document)
  }

  /**
   * Profil oluştuktan sonra seçilen belgeleri yükler.
   *
   * Yükleme hatası profil oluşturmayı GERİ ALMAZ: profil zaten kaydedildi ve
   * kullanıcıyı onboarding'de tutmak daha kötü olurdu. Bunun yerine ne olduğu
   * açıkça söylenir ve nereden tekrar denenebileceği gösterilir.
   */
  const uploadPendingDocuments = async () => {
    const failed: string[] = []

    if (pendingCv) {
      try {
        await uploadCv(pendingCv)
      } catch {
        failed.push('CV')
      }
    }

    if (pendingCertificate) {
      try {
        await uploadCertificate(pendingCertificate)
      } catch {
        failed.push('sertifika')
      }
    }

    if (failed.length > 0) {
      Alert.alert(
        'Profiliniz oluşturuldu',
        `${failed.join(' ve ')} yüklenemedi. Ayarlar → Belgeler bölümünden tekrar deneyebilirsiniz.`
      )
    }
  }

  const validateAndNext = () => {
    if (step === 1) {
      if (title.trim().length < 2) {
        setTitleError('Ünvan en az 2 karakter olmalı')
        return
      }
      setTitleError(undefined)
    }
    if (step === 2) {
      if (selectedSpecs.length === 0) {
        setSpecsError('En az bir uzmanlık alanı seçiniz')
        return
      }
      setSpecsError(undefined)
    }
    if (step === 5) {
      if (bio.trim().length < 50) {
        setBioError('Biyografi en az 50 karakter olmalı')
        return
      }
      setBioError(undefined)
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    } else {
      submitProfile()
    }
  }

  const submitProfile = () => {
    updateAuthProfile(
      { phone: phone.trim() || null, city: city.trim() || null },
      {
        onSuccess: () => {
          const data: ExpertOnboarding = {
            title: title.trim(),
            specializations: selectedSpecs,
            experienceYears,
            bio: bio.trim(),
            education: education.trim() || null,
            personalWebsite: personalWebsite.trim() || null,
          }
          createProfile(data, {
            onSuccess: async () => {
              await uploadPendingDocuments()
              router.replace('/(tabs)')
            },
          })
        },
      }
    )
  }

  const apiErrorMessage = error instanceof Error ? error.message : undefined
  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 overflow-hidden bg-sky-500 dark:bg-sky-950">
      <DecorCircles phase={step} />
      <BackButton onPress={goBack} />
      <ScreenTitle title="Profilini Tamamla" topInset titleClassName="text-white" />

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
          <View className="gap-1">
            <Text variant="heading" className="text-white">
              {STEP_TITLES[step - 1]}
            </Text>
            {STEP_SUBTITLES[step - 1] && (
              <Text variant="body" className="text-sky-100">
                {STEP_SUBTITLES[step - 1]}
              </Text>
            )}
          </View>

          {step === 1 && (
            <OnboardingStepTitle
              title={title}
              onTitleChange={(t) => {
                setTitle(t)
                setTitleError(undefined)
              }}
              errorMessage={titleError}
            />
          )}

          {step === 2 && (
            <OnboardingStepSpecs
              selectedSpecs={selectedSpecs}
              onToggleSpec={toggleSpec}
              errorMessage={specsError}
            />
          )}

          {step === 3 && (
            <OnboardingStepExperience
              experienceYears={experienceYears}
              onChange={setExperienceYears}
            />
          )}

          {step === 4 && (
            <OnboardingStepContact
              phone={phone}
              onPhoneChange={setPhone}
              city={city}
              onCityChange={setCity}
            />
          )}

          {step === 5 && (
            <OnboardingStepBio
              bio={bio}
              onBioChange={(t) => {
                setBio(t)
                setBioError(undefined)
              }}
              bioError={bioError}
              education={education}
              onEducationChange={setEducation}
            />
          )}

          {step === 6 && (
            <OnboardingStepDocuments
              personalWebsite={personalWebsite}
              onPersonalWebsiteChange={setPersonalWebsite}
              cvName={pendingCv?.name ?? null}
              certificateName={pendingCertificate?.name ?? null}
              onUploadCv={() => void chooseDocument('CV Yükle', setPendingCv)}
              onAddCertificate={() => void chooseDocument('Sertifika Ekle', setPendingCertificate)}
            />
          )}

          {step === 7 && (
            <OnboardingStepPhoto
              avatarUrl={avatarUrl}
              isUploading={isUploadingAvatar}
              onPickPhoto={() => void changeAvatar()}
            />
          )}

          {apiErrorMessage && (
            <View className="rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950">
              <Text variant="caption" className="text-red-600 dark:text-red-300">
                {apiErrorMessage}
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomActionBar
          actions={
            step === TOTAL_STEPS
              ? [
                  {
                    label: 'Profili Tamamla',
                    onPress: validateAndNext,
                    variant: 'inverse',
                    isLoading: isPending,
                    loadingLabel: 'Kaydediliyor...',
                  },
                ]
              : [{ label: 'Devam Et', onPress: validateAndNext, variant: 'inverse' }]
          }
        />
      </KeyboardAvoidingView>
    </View>
  )
}
