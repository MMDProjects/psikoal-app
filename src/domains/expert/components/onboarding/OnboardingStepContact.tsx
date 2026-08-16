import { View } from 'react-native'

import { InputField } from '@/core/components/molecules/InputField'

export type OnboardingStepContactProps = {
  phone: string
  onPhoneChange: (value: string) => void
  city: string
  onCityChange: (value: string) => void
}

export function OnboardingStepContact({
  phone,
  onPhoneChange,
  city,
  onCityChange,
}: OnboardingStepContactProps) {
  return (
    <View className="gap-4">
      <InputField
        tone="onBrand"
        label="Telefon (opsiyonel)"
        placeholder="05XX XXX XX XX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={onPhoneChange}
      />
      <InputField
        tone="onBrand"
        label="Konum (opsiyonel)"
        placeholder="örn. İstanbul"
        value={city}
        onChangeText={onCityChange}
      />
    </View>
  )
}
