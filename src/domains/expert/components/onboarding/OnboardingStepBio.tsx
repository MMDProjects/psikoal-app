import { View } from 'react-native'

import { InputField } from '@/core/components/molecules/InputField'

export type OnboardingStepBioProps = {
  bio: string
  onBioChange: (value: string) => void
  bioError?: string
  education: string
  onEducationChange: (value: string) => void
}

export function OnboardingStepBio({
  bio,
  onBioChange,
  bioError,
  education,
  onEducationChange,
}: OnboardingStepBioProps) {
  return (
    <View className="gap-4">
      <InputField
        tone="onBrand"
        label="Biyografi"
        placeholder="Kendinizi danışanlara tanıtın. Eğitiminiz, yaklaşımınız ve çalışma tarzınız hakkında bilgi verin."
        value={bio}
        onChangeText={onBioChange}
        errorMessage={bioError}
        multiline
        hint={`${bio.length}/1000 karakter (minimum 50)`}
        isRequired
      />
      <InputField
        tone="onBrand"
        label="Eğitim Bilgisi (opsiyonel)"
        placeholder="örn. İstanbul Üniversitesi, Klinik Psikoloji (Yüksek Lisans)"
        value={education}
        onChangeText={onEducationChange}
        multiline
      />
    </View>
  )
}
