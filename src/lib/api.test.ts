import MockAdapter from 'axios-mock-adapter'

import { ApiError, axiosInstance, get } from './api'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  multiRemove: jest.fn(async () => undefined),
}))

describe('api error mapping', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance)
  })

  afterEach(() => {
    mock.restore()
  })

  // ASP.NET Core model validation 400 ValidationProblemDetails döner: errors bir SÖZLÜK.
  // Bu dal olmadan tüm form hataları 'UNKNOWN_ERROR'a düşüyordu.
  it('maps a 400 ValidationProblemDetails body to validationErrors', async () => {
    mock.onGet('/listings').reply(400, {
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
      title: 'One or more validation errors occurred.',
      status: 400,
      errors: {
        Title: ['Başlık zorunludur.', 'Başlık en az 5 karakter olmalıdır.'],
        BudgetMin: ['Bütçe negatif olamaz.'],
      },
    })

    await expect(get('/listings')).rejects.toMatchObject({
      status: 400,
      code: 'VALIDATION_ERROR',
      validationErrors: [
        { field: 'Title', message: 'Başlık zorunludur.' },
        { field: 'Title', message: 'Başlık en az 5 karakter olmalıdır.' },
        { field: 'BudgetMin', message: 'Bütçe negatif olamaz.' },
      ],
    })
  })

  it('maps a 422 ApiErrorDto body and preserves the domain code', async () => {
    mock.onGet('/listings').reply(422, {
      code: 'LISTING_MAX_ACTIVE_EXCEEDED',
      message: 'En fazla 3 açık ilanınız olabilir.',
      errors: [{ field: 'status', message: 'En fazla 3 açık ilanınız olabilir.' }],
    })

    await expect(get('/listings')).rejects.toMatchObject({
      status: 422,
      code: 'LISTING_MAX_ACTIVE_EXCEEDED',
    })
  })

  it('falls back to UNKNOWN_ERROR for an unmapped status', async () => {
    mock.onGet('/listings').reply(500, {})

    const error = await get('/listings').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).code).toBe('UNKNOWN_ERROR')
  })
})
