import { z } from 'zod'

export const UserRoleSchema = z.enum(['expert', 'client'])

export const LoginRequestSchema = z.object({
  email: z.string().email('Geçerli bir e-posta giriniz'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
})

export const RegisterRequestSchema = z.object({
  email: z.string().email('Geçerli bir e-posta giriniz'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  role: UserRoleSchema,
})

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
})

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  isVerified: z.boolean(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  shareEmail: z.boolean().optional(),
  sharePhone: z.boolean().optional(),
  shareLocation: z.boolean().optional(),
})

export const LoginResponseSchema = z.object({
  user: AuthUserSchema,
  tokens: AuthTokensSchema,
})

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalı').optional(),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı').optional(),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  shareEmail: z.boolean().optional(),
  sharePhone: z.boolean().optional(),
  shareLocation: z.boolean().optional(),
})

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifrenizi giriniz'),
    newPassword: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
    confirmPassword: z.string().min(1, 'Şifreyi tekrar giriniz'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta giriniz'),
})
