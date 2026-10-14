/**
 * Supabase şifre kurtarma bağlantısını çözer.
 *
 * GoTrue kullanıcıyı `psikoal://reset-password#access_token=...&refresh_token=...
 * &type=recovery` adresine döndürür (sözleşme §2). Token'lar URL'nin PARÇA
 * (fragment, `#`) kısmındadır: expo-router bunu arama parametresi olarak
 * görmez, bu yüzden adres burada elle ayrıştırılır. Süresi dolmuş bağlantıda
 * GoTrue `#error=...&error_description=...` döner.
 */
export type RecoveryLink =
  | { status: 'valid'; accessToken: string }
  | { status: 'invalid' }
  | { status: 'missing' }

function parseParams(query: string): Record<string, string> {
  const params: Record<string, string> = {}
  for (const pair of query.split('&')) {
    if (!pair) continue
    const [rawKey, ...rest] = pair.split('=')
    if (!rawKey) continue
    try {
      params[decodeURIComponent(rawKey)] = decodeURIComponent(rest.join('=').replace(/\+/g, ' '))
    } catch {
      // Bozuk yüzde kodlaması: bu parametre yok sayılır.
    }
  }
  return params
}

export function parseRecoveryLink(url: string | null | undefined): RecoveryLink {
  if (!url) return { status: 'missing' }

  const hashIndex = url.indexOf('#')
  const queryIndex = url.indexOf('?')
  const fragment = hashIndex >= 0 ? url.slice(hashIndex + 1) : ''
  const query =
    queryIndex >= 0 ? url.slice(queryIndex + 1, hashIndex >= 0 ? hashIndex : undefined) : ''

  const params = { ...parseParams(query), ...parseParams(fragment) }

  if (params['error'] || params['error_code']) return { status: 'invalid' }

  const accessToken = params['access_token']
  if (!accessToken) return { status: 'missing' }
  if (params['type'] && params['type'] !== 'recovery') return { status: 'invalid' }

  return { status: 'valid', accessToken }
}
