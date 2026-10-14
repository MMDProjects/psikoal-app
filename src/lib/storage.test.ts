import type * as StorageNamespace from './storage'

const mockSecure = new Map<string, string>()
const mockLegacy = new Map<string, string>()

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockSecure.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockSecure.set(key, value)
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockSecure.delete(key)
  }),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key: string) => mockLegacy.get(key) ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    mockLegacy.set(key, value)
  }),
  removeItem: jest.fn(async (key: string) => {
    mockLegacy.delete(key)
  }),
  multiGet: jest.fn(async (keys: string[]) => keys.map((k) => [k, mockLegacy.get(k) ?? null])),
  multiRemove: jest.fn(async (keys: string[]) => {
    keys.forEach((k) => mockLegacy.delete(k))
  }),
}))

type StorageModule = typeof StorageNamespace

function loadFresh(): StorageModule {
  let mod: StorageModule | undefined
  jest.isolateModules(() => {
    mod = jest.requireActual<StorageModule>('./storage')
  })
  if (!mod) throw new Error('storage module did not load')
  return mod
}

describe('tokenStorage', () => {
  beforeEach(() => {
    mockSecure.clear()
    mockLegacy.clear()
  })

  it('moves legacy AsyncStorage tokens into secure storage and deletes them', async () => {
    mockLegacy.set('auth.accessToken', 'eski-access')
    mockLegacy.set('auth.refreshToken', 'eski-refresh')
    const { tokenStorage } = loadFresh()

    await expect(tokenStorage.getAccessToken()).resolves.toBe('eski-access')
    await expect(tokenStorage.getRefreshToken()).resolves.toBe('eski-refresh')
    expect(mockLegacy.has('auth.accessToken')).toBe(false)
    expect(mockLegacy.has('auth.refreshToken')).toBe(false)
  })

  it('keeps an existing secure token instead of the stale legacy one', async () => {
    mockLegacy.set('auth.accessToken', 'eski-access')
    mockSecure.set('psikoal.accessToken', 'yeni-access')
    const { tokenStorage } = loadFresh()

    await expect(tokenStorage.getAccessToken()).resolves.toBe('yeni-access')
    expect(mockLegacy.size).toBe(0)
  })

  it('never writes tokens to AsyncStorage', async () => {
    const { tokenStorage } = loadFresh()
    await tokenStorage.setAccessToken('a')
    await tokenStorage.setRefreshToken('r')

    expect(mockLegacy.size).toBe(0)
    await expect(tokenStorage.getAccessToken()).resolves.toBe('a')
  })

  it('clears both secure and legacy tokens', async () => {
    const { tokenStorage } = loadFresh()
    await tokenStorage.setAccessToken('a')
    await tokenStorage.setRefreshToken('r')
    mockLegacy.set('auth.accessToken', 'eski')

    await tokenStorage.clearTokens()

    expect(mockSecure.size).toBe(0)
    expect(mockLegacy.size).toBe(0)
  })

  it('does not block token reads when migration fails', async () => {
    const AsyncStorage = jest.requireMock('@react-native-async-storage/async-storage')
    AsyncStorage.multiGet.mockRejectedValueOnce(new Error('disk'))
    mockSecure.set('psikoal.accessToken', 'a')
    const { tokenStorage } = loadFresh()

    await expect(tokenStorage.getAccessToken()).resolves.toBe('a')
  })
})
