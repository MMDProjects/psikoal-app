import { View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

const ICON_ON_BRAND = '#FFFFFF'

export function OnboardingStepPhoto() {
  return (
    <View className="items-center gap-4">
      <View className="h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-sky-300 bg-sky-600 dark:border-sky-700 dark:bg-sky-900">
        <Icon name="Camera" size={32} color={ICON_ON_BRAND} />
      </View>
      <Text variant="body" className="text-sky-100" align="center">
        Profil fotoğrafı danışanların sizi tanımasına yardımcı olur.
      </Text>
      <View className="w-full rounded-xl bg-sky-600 px-4 py-3 dark:bg-sky-900">
        <Text variant="caption" className="text-white" align="center">
          Fotoğraf yükleme özelliği yakında aktif olacak.
        </Text>
      </View>
    </View>
  )
}
