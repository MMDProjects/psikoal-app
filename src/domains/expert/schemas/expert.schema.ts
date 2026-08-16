import { z } from 'zod'

export const ExpertOnboardingSchema = z.object({
  title: z.string().min(2, 'Ünvan en az 2 karakter olmalı'),
  specializations: z.array(z.string()).min(1, 'En az bir uzmanlık alanı seçiniz'),
  experienceYears: z.number().min(0).max(50),
  bio: z.string().min(50, 'Biyografi en az 50 karakter olmalı').max(1000),
  avatarUrl: z.string().url().nullable().optional(),
  education: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
  certificates: z.array(z.string()).optional(),
  personalWebsite: z
    .string()
    .url('Geçerli bir URL giriniz')
    .nullable()
    .optional()
    .or(z.literal('')),
})

export const ExpertSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  specializations: z.array(z.string()),
  experienceYears: z.number(),
  bio: z.string(),
  avatarUrl: z.string().url().nullable(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  isVerified: z.boolean(),
  status: z.enum(['pending', 'approved', 'rejected']),
  initials: z.string().optional(),
  acceptsOffers: z.boolean(),
  education: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
  certificates: z.array(z.string()).optional(),
  personalWebsite: z.string().url().nullable().optional(),
})

export type ExpertOnboarding = z.infer<typeof ExpertOnboardingSchema>
export type Expert = z.infer<typeof ExpertSchema>
