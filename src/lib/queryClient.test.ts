import { Alert } from 'react-native'

import { ApiError, ERROR_MESSAGES } from './api'
import { handleMutationError } from './queryClient'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  multiGet: jest.fn(async () => []),
  multiRemove: jest.fn(async () => undefined),
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}))

describe('handleMutationError', () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)

  afterEach(() => alert.mockClear())

  it('shows the API message in Turkish', () => {
    handleMutationError(
      new ApiError('OFFER_NOT_PENDING', 'Teklif artık beklemede değil.', 409),
      undefined
    )
    expect(alert).toHaveBeenCalledWith('İşlem tamamlanamadı', 'Teklif artık beklemede değil.')
  })

  it('hides internal error text', () => {
    handleMutationError(new Error('Expected string'), undefined)
    expect(alert).toHaveBeenCalledWith('İşlem tamamlanamadı', ERROR_MESSAGES.unknown)
  })

  it('stays silent when the mutation renders the error itself', () => {
    handleMutationError(new Error('x'), true)
    expect(alert).not.toHaveBeenCalled()
  })

  it('stays silent on session expiry (the app already redirects to login)', () => {
    handleMutationError(new ApiError('UNAUTHORIZED', ERROR_MESSAGES.sessionExpired, 401), undefined)
    expect(alert).not.toHaveBeenCalled()
  })
})
