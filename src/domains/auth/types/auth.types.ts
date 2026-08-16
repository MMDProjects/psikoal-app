import type {
  AuthTokensSchema,
  AuthUserSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  UpdateProfileSchema,
  UserRoleSchema,
} from '../schemas/auth.schema'
import type { z } from 'zod'

export type UserRole = z.infer<typeof UserRoleSchema>
export type AuthUser = z.infer<typeof AuthUserSchema>
export type AuthTokens = z.infer<typeof AuthTokensSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordSchema>
