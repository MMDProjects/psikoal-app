import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'

const ICON_ON_BRAND = '#FFFFFF'
const MIN_YEARS = 0
const MAX_YEARS = 50

export type OnboardingStepExperienceProps = {
  experienceYears: number
  onChange: (value: number) => void
}

export function OnboardingStepExperience({
  experienceYears,
  onChange,
}: OnboardingStepExperienceProps) {
  const colors = useThemeColors()

  return (
    <View className="flex-row items-center justify-between rounded-xl bg-sky-600 px-5 py-4 dark:bg-sky-900">
      <Pressable
        onPress={() => onChange(Math.max(MIN_YEARS, experienceYears - 1))}
        accessibilityRole="button"
        accessibilityLabel="Deneyim yılını azalt"
        className="h-10 w-10 items-center justify-center rounded-full bg-sky-700 active:bg-sky-800 dark:bg-sky-950"
      >
        <Icon name="Minus" size={20} color={ICON_ON_BRAND} />
      </Pressable>

      <View className="items-center">
        <Text variant="display" className="text-white">
          {experienceYears}
        </Text>
        <Text variant="caption" className="text-sky-100">
          yıl deneyim
        </Text>
      </View>

      <Pressable
        onPress={() => onChange(Math.min(MAX_YEARS, experienceYears + 1))}
        accessibilityRole="button"
        accessibilityLabel="Deneyim yılını artır"
        className="h-10 w-10 items-center justify-center rounded-full bg-white active:bg-sky-50"
      >
        <Icon name="Plus" size={20} color={colors.brand} />
      </Pressable>
    </View>
  )
}
