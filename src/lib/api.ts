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
})

instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((p) => {
    if (token != null && !error) p.resolve(token)
    else p.reject(error ?? new Error('Token refresh failed'))
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (!error.response) {
      return Promise.reject(new NetworkError())
    }

    const { status, data } = error.response

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.set('Authorization', `Bearer ${token}`)
              resolve(instance(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = await tokenStorage.getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token')

        const { data: refreshData } = await instance.post<{
          accessToken: string
          refreshToken: string
        }>('/auth/refresh', { refreshToken })

        await tokenStorage.setAccessToken(refreshData.accessToken)
        await tokenStorage.setRefreshToken(refreshData.refreshToken)
        instance.defaults.headers.common['Authorization'] = `Bearer ${refreshData.accessToken}`

        processQueue(null, refreshData.accessToken)
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        await tokenStorage.clearTokens()
        _onUnauthenticated?.()
        return Promise.reject(
          new ApiError('UNAUTHORIZED', 'Session expired. Please log in again.', 401)
        )
      } finally {
        isRefreshing = false
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

// ⚠️ MOCK — gerçek API'ye geçerken bu bloğu ve repo kökündeki mock-db/ klasörünü sil (bkz. docs/PRODUCTION_CHECKLIST.md)
if (process.env.EXPO_PUBLIC_APP_ENV === 'mock') {
  const MockAdapter = require('axios-mock-adapter')
  const { setupMocks } = require('../../mock-db/handlers')
  setupMocks(new MockAdapter(instance, { delayResponse: 600 }))
}
// END MOCK

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
