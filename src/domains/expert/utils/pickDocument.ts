import * as DocumentPicker from 'expo-document-picker'

import { DOCUMENT_CONTENT_TYPES, DOCUMENT_MAX_BYTES } from '../api/useUploadExpertDocumentMutation'

export type PickedDocument = {
  uri: string
  name: string
  mimeType: string
}

export type PickDocumentResult =
  | { status: 'picked'; document: PickedDocument }
  | { status: 'canceled' }
  | { status: 'rejected'; message: string }

const MEGABYTE = 1024 * 1024

/**
 * Belge seçtirir ve backend'in kabul edeceğinden EMİN olduktan sonra döner.
 *
 * Doğrulama burada, sunucuya gitmeden yapılıyor: aksi hâlde kullanıcı 10 MB'lık
 * bir dosyayı yükleyip sonunda hata alır. Sunucu yine kendi kontrolünü yapıyor
 * (üstelik magic-byte imzasına da bakıyor) — buradaki kontrol onun yerine
 * geçmez, sadece boşa giden yüklemeyi önler.
 */
export async function pickExpertDocument(): Promise<PickDocumentResult> {
  // copyToCacheDirectory: true ŞART — FormData'ya verilecek uri'nin okunabilir
  // olması gerekiyor. false bırakılırsa Android'de içerik sağlayıcı uri'si
  // gelir ve yükleme "dosya bulunamadı" ile düşer.
  const result = await DocumentPicker.getDocumentAsync({
    type: [...DOCUMENT_CONTENT_TYPES],
    copyToCacheDirectory: true,
    multiple: false,
  })

  if (result.canceled) {
    return { status: 'canceled' }
  }

  const asset = result.assets[0]
  if (!asset) {
    return { status: 'canceled' }
  }

  // mimeType opsiyonel: bazı Android dosya sağlayıcıları vermiyor. Tip
  // bilinmiyorsa yüklemeyi denemek yerine kullanıcıya net bir şey söylemek
  // daha iyi — sunucu zaten reddedecek ve hata "beklenmeyen" görünecekti.
  if (!asset.mimeType || !DOCUMENT_CONTENT_TYPES.includes(asset.mimeType as never)) {
    return {
      status: 'rejected',
      message: 'Yalnızca PDF, JPEG veya PNG dosyası yükleyebilirsiniz.',
    }
  }

  if (asset.size != null && asset.size > DOCUMENT_MAX_BYTES) {
    return {
      status: 'rejected',
      message: `Dosya boyutu en fazla ${DOCUMENT_MAX_BYTES / MEGABYTE} MB olabilir.`,
    }
  }

  return {
    status: 'picked',
    document: { uri: asset.uri, name: asset.name, mimeType: asset.mimeType },
  }
}
