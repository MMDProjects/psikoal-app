import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().min(1, 'EXPO_PUBLIC_API_URL is required'),
  EXPO_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production', 'mock'])
    .default('development'),
  EXPO_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
})

function parseEnv() {
  const result = envSchema.safeParse({
    EXPO_PUBLIC_API_URL: process.env['EXPO_PUBLIC_API_URL'],
    EXPO_PUBLIC_APP_ENV: process.env['EXPO_PUBLIC_APP_ENV'],
    EXPO_PUBLIC_APP_VERSION: process.env['EXPO_PUBLIC_APP_VERSION'],
  })

  if (!result.success) {
    const missing = result.error.issues.map((i) => i.message).join('\n')
    throw new Error(`[env] Missing or invalid environment variables:\n${missing}`)
  }

  return result.data
}

export const env = parseEnv()

export type Env = typeof env
