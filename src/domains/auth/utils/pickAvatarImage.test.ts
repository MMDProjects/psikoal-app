import * as ImagePicker from 'expo-image-picker'

import { AVATAR_MAX_BYTES, pickAvatarImage, resolveImageContentType } from './pickAvatarImage'

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}))

const picker = jest.mocked(ImagePicker)

function grant(granted: boolean) {
  // REASON: testte yalnız `granted` alanı okunuyor; tam PermissionResponse gerekmez
  picker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
    granted,
  } as ImagePicker.MediaLibraryPermissionResponse)
}

function pick(asset: Partial<ImagePicker.ImagePickerAsset> | null) {
  // REASON: testte yalnız canceled/assets alanları okunuyor
  picker.launchImageLibraryAsync.mockResolvedValue(
    (asset
      ? { canceled: false, assets: [{ uri: 'file:///a.jpg', width: 1, height: 1, ...asset }] }
      : { canceled: true, assets: null }) as ImagePicker.ImagePickerResult
  )
}

describe('resolveImageContentType', () => {
  it('accepts the backend content types', () => {
    expect(resolveImageContentType('image/png', 'x')).toBe('image/png')
    expect(resolveImageContentType('image/webp', 'x')).toBe('image/webp')
  })

  it('rejects unsupported types such as HEIC', () => {
    expect(resolveImageContentType('image/heic', 'file:///a.heic')).toBeNull()
  })

  it('falls back to the file extension when mimeType is missing', () => {
    expect(resolveImageContentType(undefined, 'file:///foto.JPG?x=1')).toBe('image/jpeg')
    expect(resolveImageContentType(null, 'file:///foto')).toBeNull()
  })
})

describe('pickAvatarImage', () => {
  it('rejects when permission is denied', async () => {
    grant(false)
    await expect(pickAvatarImage()).resolves.toMatchObject({ status: 'rejected' })
  })

  it('returns canceled when the user closes the picker', async () => {
    grant(true)
    pick(null)
    await expect(pickAvatarImage()).resolves.toEqual({ status: 'canceled' })
  })

  it('rejects images larger than the backend limit', async () => {
    grant(true)
    pick({ mimeType: 'image/jpeg', fileSize: AVATAR_MAX_BYTES + 1 })
    await expect(pickAvatarImage()).resolves.toMatchObject({ status: 'rejected' })
  })

  it('returns the picked image with a default name', async () => {
    grant(true)
    pick({ mimeType: 'image/png', fileSize: 1024, fileName: null })
    await expect(pickAvatarImage()).resolves.toEqual({
      status: 'picked',
      image: { uri: 'file:///a.jpg', name: 'avatar.png', mimeType: 'image/png' },
    })
  })
})
