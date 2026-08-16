import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'

const ICON_ON_BRAND = '#FFFFFF'
const CHEVRON_ON_BRAND = '#E0F2FE'

export type OnboardingStepDocumentsProps = {
  personalWebsite: string
  onPersonalWebsiteChange: (value: string) => void
  onUploadCv: () => void
  onAddCertificate: () => void
}

export function OnboardingStepDocuments({
  personalWebsite,
  onPersonalWebsiteChange,
  onUploadCv,
  onAddCertificate,
}: OnboardingStepDocumentsProps) {
  return (
    <View className="gap-3">
      <Pressable
        onPress={onUploadCv}
        className="flex-row items-center gap-3 rounded-xl bg-sky-600 px-4 py-4 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
      >
        <Icon name="FileUp" size={20} color={ICON_ON_BRAND} />
        <Text variant="label" className="flex-1 text-white">
          CV Yükle
        </Text>
        <Icon name="ChevronRight" size={16} color={CHEVRON_ON_BRAND} />
      </Pressable>
      <Pressable
        onPress={onAddCertificate}
        className="flex-row items-center gap-3 rounded-xl bg-sky-600 px-4 py-4 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
      >
        <Icon name="Award" size={20} color={ICON_ON_BRAND} />
        <Text variant="label" className="flex-1 text-white">
          Sertifika Ekle
        </Text>
        <Icon name="ChevronRight" size={16} color={CHEVRON_ON_BRAND} />
      </Pressable>
      <InputField
        tone="onBrand"
        label="Kişisel Site (opsiyonel)"
        placeholder="https://ornek.com"
        keyboardType="url"
        autoCapitalize="none"
        value={personalWebsite}
        onChangeText={onPersonalWebsiteChange}
      />
    </View>
  )
}
