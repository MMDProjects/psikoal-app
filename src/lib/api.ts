import axios from 'axios'

import { env } from './env'
import { tokenStorage } from './storage'

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'

export type ValidationError = { field: string; message: string }

// Backend iki farklı hata gövdesi üretiyor:
//  - ApiErrorDto (422, DomainException)      → { code, message, errors: [...] }
//  - ValidationProblemDetails (400, model)   → { title, status, errors: { Alan: [...] } }
type ApiErrorBody = {
  code?: string
  message?: string
  title?: string
  errors?: unknown[] | Record<string, string[] | string>
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly validationErrors?: ValidationError[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor() {
    super('No network connection. Please check your internet and try again.')
    this.name = 'NetworkError'
  }
}

let _onUnauthenticated: (() => void) | null = null

export function registerUnauthenticatedHandler(handler: () => void): void {
  _onUnauthenticated = handler
}

const instance: AxiosInstance = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  // Dizi parametreleri ASP.NET Core'un bağladığı biçimde gitmek ZORUNDA:
  //   status=ACTIVE&status=RELEASED        ← `[FromQuery] string[] status` bunu bağlar
  // axios'un varsayılanı ise köşeli parantez üretiyor:
  //   status[]=ACTIVE&status[]=RELEASED    ← bağlanmaz, parametre null gelir
  //
  // Belirti sessizdir ve hataya benzemez: sunucu 200 döner, filtre YOK SAYILIR ve
  // kullanıcı filtrelenmemiş listenin tamamını görür. "Aktif" sekmesinde RELEASED
  // eşleşmenin görünmesi böyle bulundu. Aynı kırılma dört yerde birden vardı:
  // /matches, /listings/my, /offers/my (durum filtreleri) ve /listings
  // (specialization filtresi).
  paramsSerializer: { indexes: null },
})

instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// Eşzamanlı 401'ler TEK bir yenileme isteğini paylaşır.
//
// Burada elle tutulan bir kuyruk (isRefreshing + failedQueue) vardı ve "bayrağı
// oku, sonra kuyruğa ekle" adımları atomik olmadığı için istek YETİM kalabiliyordu:
// A isteği yenilemeyi bitirip kuyruğu boşalttıktan sonra B isteği hâlâ eski bayrağa
// bakıp kuyruğa eklenirse onu artık kimse boşaltmaz — promise HİÇ çözülmez.
// Belirti sessizdir: ekran sonsuza kadar skeleton'da kalır, hata da görünmez,
// çünkü React Query uçuşta sanılan isteğe bağlı kalır ve refetch() bile yeni istek
// açmaz. Bu gerçekten yaşandı: girişten hemen sonra bildirim ekranı ve zil rozeti
// kalıcı olarak boş kaldı, uygulamayı yeniden başlatmak düzeltti.
//
// Paylaşılan promise'te yetim kalma ihtimali yapısal olarak yok: refreshPromise
// null değilse MUTLAKA çözülecek bir promise'tir.
let refreshPromise: Promise<string> | null = null

const REFRESH_PATH = '/auth/refresh'

async function refreshTokens(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')

  const { data } = await instance.post<{ accessToken: string; refreshToken: string }>(
    REFRESH_PATH,
    { refreshToken }
  )

  await tokenStorage.setAccessToken(data.accessToken)
  await tokenStorage.setRefreshToken(data.refreshToken)
  instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`

  return data.accessToken
}

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (!error.response) {
      return Promise.reject(new NetworkError())
    }

    const { status, data } = error.response

    // Yenileme isteğinin KENDİSİ 401 alırsa yeniden yenilemeye kalkmak sonsuz
    // döngü olur; oturum gerçekten bitmiştir ve hata olduğu gibi yukarı çıkmalıdır.
    const isRefreshCall = originalRequest.url === REFRESH_PATH

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true

      try {
        refreshPromise ??= refreshTokens().finally(() => {
          refreshPromise = null
        })

        const token = await refreshPromise
        originalRequest.headers.set('Authorization', `Bearer ${token}`)
        return await instance(originalRequest)
      } catch {
        await tokenStorage.clearTokens()
        _onUnauthenticated?.()
        return Promise.reject(
          new ApiError('UNAUTHORIZED', 'Session expired. Please log in again.', 401)
        )
      }
    }

    // ASP.NET Core model validation → 400 ValidationProblemDetails
    // Gövde: { type, title, status, errors: { "Alan": ["mesaj", ...] } } — dizi DEĞİL sözlük.
    if (status === 400 && data?.errors && !Array.isArray(data.errors)) {
      const problemErrors = data.errors as Record<string, string[] | string>
      const validationErrors: ValidationError[] = Object.entries(problemErrors).flatMap(
        ([field, messages]) =>
          (Array.isArray(messages) ? messages : [messages]).map((message) => ({
            field,
            message,
          }))
      )
      return Promise.reject(
        new ApiError(
          data?.code ?? 'VALIDATION_ERROR',
          data?.title ?? 'Girdiğiniz bilgileri kontrol edin.',
          400,
          validationErrors
        )
      )
    }

    if (status === 422) {
      const rawErrors = (data?.errors ?? []) as Array<{ field?: string; message?: string }>
      const validationErrors: ValidationError[] = rawErrors.map((e) => ({
        field: e.field ?? 'unknown',
        message: e.message ?? 'Invalid value',
      }))
      return Promise.reject(
        new ApiError(
          data?.code ?? 'VALIDATION_ERROR',
          data?.message ?? 'Validation failed.',
          422,
          validationErrors
        )
      )
    }

    return Promise.reject(
      new ApiError(
        data?.code ?? 'UNKNOWN_ERROR',
        data?.message ?? 'An unexpected error occurred.',
        status
      )
    )
  }
)

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.get<T>(url, config)
  return res.data
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await instance.post<T>(url, data, config)
  return res.data
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.put<T>(url, data, config)
  return res.data
}

export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await instance.patch<T>(url, data, config)
  return res.data
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await instance.delete<T>(url, config)
  return res.data
}

export { instance as axiosInstance }
