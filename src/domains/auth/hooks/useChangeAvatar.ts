import { useCallback } from 'react'

import { Alert } from 'react-native'

import { useUploadAvatarMutation } from '../api/useUploadAvatarMutation'
import { pickAvatarImage } from '../utils/pickAvatarImage'

type UseChangeAvatarReturn = {
  changeAvatar: () => Promise<void>
  isUploading: boolean
}

/** Fotoğraf seç → doğrula → yükle akışı. Başarıda auth store'daki kullanıcı güncellenir. */
export function useChangeAvatar(): UseChangeAvatarReturn {
  const { mutate, isPending } = useUploadAvatarMutation()

  const changeAvatar = useCallback(async () => {
    const picked = await pickAvatarImage()
    if (picked.status === 'canceled') return
    if (picked.status === 'rejected') {
      Alert.alert('Profil Fotoğrafı', picked.message)
      return
    }
    mutate(picked.image)
  }, [mutate])

  return { changeAvatar, isUploading: isPending }
}
