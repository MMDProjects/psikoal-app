import { z } from 'zod'

export const MatchStatusSchema = z.enum(['FREE', 'PENDING', 'MATCHED', 'RELEASED'])

export const ClientSchema = z.object({
  id:          z.string().uuid(),
  fullName:    z.string(),
  initials:    z.string().optional(),
  email:       z.string().email(),
  phone:       z.string().nullable(),
  matchStatus: MatchStatusSchema,
  notes:       z.string().nullable(),
  createdAt:   z.string().datetime(),
})

export type Client = z.infer<typeof ClientSchema>
export type MatchStatus = z.infer<typeof MatchStatusSchema>
