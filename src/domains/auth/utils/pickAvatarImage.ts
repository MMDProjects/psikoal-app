import * as ImagePicker from 'expo-image-picker'

/** Backend'in kabul ettiği tipler — UploadService.ImageContentTypes. */
export const AVATAR_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

/** Backend sınırı: MeController'daki `RequestSizeLimit(5 * 1024 * 1024)`. */
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024

type AvatarContentType = (typeof AVATAR_CONTENT_TYPES)[number]

export type PickedImage = {
  uri: string
  name: string
  mimeType: AvatarContentType
}

export type PickImageResult =
  | { status: 'picked'; image: PickedImage }
  | { status: 'canceled' }
  | { status: 'rejected'; message: string }

const EXTENSION_TYPES: Record<string, AvatarContentType> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

function isAvatarContentType(value: string): value is AvatarContentType {
  return AVATAR_CONTENT_TYPES.some((type) => type === value)
}

export function resolveImageContentType(
  mimeType: string | null | undefined,
  uri: string
): AvatarContentType | null {
  if (mimeType) return isAvatarContentType(mimeType) ? mimeType : null
  const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase() ?? ''
  return EXTENSION_TYPES[extension] ?? null
}

/**
 * Galeriden kare kırpılmış bir fotoğraf seçtirir ve backend'in kabul edeceğinden
 * emin olduktan sonra döner. Sunucu yine kendi (magic-byte dahil) kontrolünü
 * yapar; buradaki kontrol yalnız boşa giden yüklemeyi önler.
 */
export async function pickAvatarImage(): Promise<PickImageResult> {
  // İzin istenmez: iOS (PHPicker) ve Android (sistem fotoğraf seçici) galeriyi
  // izinsiz açar. Bu sayede Android depolama izinleri manifestten engellenebiliyor.
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  })

  const asset = result.canceled ? undefined : result.assets[0]
  if (!asset) return { status: 'canceled' }

  const mimeType = resolveImageContentType(asset.mimeType, asset.uri)
  if (!mimeType) {
    return {
      status: 'rejected',
      message: 'Yalnızca JPEG, PNG veya WebP fotoğraf yükleyebilirsiniz.',
    }
  }

  if (asset.fileSize != null && asset.fileSize > AVATAR_MAX_BYTES) {
    return { status: 'rejected', message: 'Fotoğraf boyutu en fazla 5 MB olabilir.' }
  }

  const extension = mimeType.split('/')[1] ?? 'jpg'
  return {
    status: 'picked',
    image: { uri: asset.uri, name: asset.fileName ?? `avatar.${extension}`, mimeType },
  }
}
