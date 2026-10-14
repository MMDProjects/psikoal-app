import { useMutation } from '@tanstack/react-query'

import { AvatarUploadResponseSchema } from '../schemas/auth.schema'
import { useAuthStore } from '../store/authStore'

import type { PickedImage } from '../utils/pickAvatarImage'

import { post } from '@/lib/api'

/**
 * Profil fotoğrafını `POST /auth/me/avatar`'a yükler (MeController.UploadAvatar).
 * Alan adı `file` olmak zorunda — controller parametresi bu adla bağlanıyor.
 * Content-Type elle yazılmaz değil, `multipart/form-data` verilir; boundary'yi
 * platform ekler (bkz. useUploadExpertDocumentMutation).
 */
export function useUploadAvatarMutation() {
  const updateUser = useAuthStore((s) => s.updateUser)

  return useMutation({
    mutationFn: async (image: PickedImage) => {
      const form = new FormData()
      // REASON: React Native FormData { uri, name, type } nesnesi kabul eder; DOM Blob tipi yoktur
      form.append('file', {
        uri: image.uri,
        name: image.name,
        type: image.mimeType,
      } as unknown as Blob)

      const raw = await post('/auth/me/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return AvatarUploadResponseSchema.parse(raw)
    },
    onSuccess: ({ avatarUrl }) => {
      updateUser({ avatarUrl })
    },
  })
}
