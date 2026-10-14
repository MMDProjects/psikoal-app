import { parseEnv } from './env'

const base = {
  EXPO_PUBLIC_API_URL: 'https://api.psikoal.test',
  EXPO_PUBLIC_SUPPORT_EMAIL: 'destek@psikoal.test',
  EXPO_PUBLIC_PRIVACY_URL: 'https://psikoal.test/gizlilik',
  EXPO_PUBLIC_TERMS_URL: 'https://psikoal.test/kosullar',
  EXPO_PUBLIC_KVKK_URL: 'https://psikoal.test/kvkk',
}

describe('parseEnv', () => {
  it("defaults APP_ENV to 'production' (fail-safe)", () => {
    expect(parseEnv(base).EXPO_PUBLIC_APP_ENV).toBe('production')
  })

  it("rejects the removed 'mock' environment", () => {
    expect(() => parseEnv({ ...base, EXPO_PUBLIC_APP_ENV: 'mock' })).toThrow()
  })

  it('requires the support e-mail and legal URLs', () => {
    expect(() => parseEnv({ ...base, EXPO_PUBLIC_KVKK_URL: undefined })).toThrow(/KVKK/)
    expect(() => parseEnv({ ...base, EXPO_PUBLIC_SUPPORT_EMAIL: 'yok' })).toThrow(/SUPPORT/)
  })

  it('requires https legal URLs in production', () => {
    expect(() =>
      parseEnv({ ...base, EXPO_PUBLIC_PRIVACY_URL: 'http://psikoal.test/gizlilik' })
    ).toThrow(/https/)
  })

  it('allows http legal URLs outside production', () => {
    const env = parseEnv({
      ...base,
      EXPO_PUBLIC_APP_ENV: 'development',
      EXPO_PUBLIC_PRIVACY_URL: 'http://localhost/gizlilik',
    })
    expect(env.EXPO_PUBLIC_PRIVACY_URL).toBe('http://localhost/gizlilik')
  })

  it('treats an empty store URL as not set', () => {
    expect(parseEnv({ ...base, EXPO_PUBLIC_STORE_URL: '' }).EXPO_PUBLIC_STORE_URL).toBeUndefined()
  })
})
