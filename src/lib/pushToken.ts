import { post } from './api'
import { storageGet, storageRemove, storageSet } from './storage'

// Cihazın bu kullanıcı için kaydettiği Expo push token'ı. Gizli değildir
// (yalnız bu cihaza bildirim göndermeye yarar); çıkışta backend'den silmek
// için saklanır. Silinmezse çıkış yapan kullanıcının bildirimleri bu cihaza
// gitmeye devam eder.
const PUSH_TOKEN_KEY = 'notification.pushToken'

export function rememberPushToken(token: string): Promise<void> {
  return storageSet(PUSH_TOKEN_KEY, token)
}

/**
 * Kayıtlı push token'ı backend'den siler. Oturum token'ı temizlenmeden ÖNCE
 * çağrılmalı (uç kimlik doğrulaması ister). Hata yutulur: çıkış hiçbir koşulda
 * bu çağrı yüzünden engellenmez.
 */
export async function unregisterPushToken(): Promise<void> {
  try {
    const token = await storageGet<string>(PUSH_TOKEN_KEY)
    if (typeof token === 'string' && token.length > 0) {
      await post('/push-tokens/unregister', { token })
    }
  } catch {
    // Bilinçli olarak yutulur — bkz. yukarı.
  } finally {
    await storageRemove(PUSH_TOKEN_KEY).catch(() => undefined)
  }
}
