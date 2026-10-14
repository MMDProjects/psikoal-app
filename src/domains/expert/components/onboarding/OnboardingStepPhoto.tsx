import { ActivityIndicator, Image, Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

const ICON_ON_BRAND = '#FFFFFF'

export type OnboardingStepPhotoProps = {
  avatarUrl: string | null
  isUploading: boolean
  onPickPhoto: () => void
}

export function OnboardingStepPhoto({
  avatarUrl,
  isUploading,
  onPickPhoto,
}: OnboardingStepPhotoProps) {
  return (
    <View className="items-center gap-4">
      <Pressable
        onPress={onPickPhoto}
        disabled={isUploading}
        accessibilityRole="button"
        accessibilityLabel={avatarUrl ? 'Profil fotoğrafını değiştir' : 'Profil fotoğrafı seç'}
        className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-sky-300 bg-sky-600 active:opacity-80 dark:border-sky-700 dark:bg-sky-900"
      >
        {isUploading ? (
          <ActivityIndicator color={ICON_ON_BRAND} />
        ) : avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="h-full w-full"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Icon name="Camera" size={32} color={ICON_ON_BRAND} />
        )}
      </Pressable>
      <Text variant="body" className="text-sky-100" align="center">
        Profil fotoğrafı danışanların sizi tanımasına yardımcı olur.
      </Text>
      <Pressable
        onPress={onPickPhoto}
        disabled={isUploading}
        className="w-full rounded-xl bg-sky-600 px-4 py-3 active:opacity-80 dark:bg-sky-900"
      >
        <Text variant="caption" className="font-semibold text-white" align="center">
          {isUploading ? 'Yükleniyor...' : avatarUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}
        </Text>
      </Pressable>
    </View>
  )
}
