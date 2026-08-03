import type { z } from 'zod'
import type { ExpertSchema, ExpertOnboardingSchema } from '../schemas/expert.schema'

export type Expert = z.infer<typeof ExpertSchema>
export type ExpertOnboarding = z.infer<typeof ExpertOnboardingSchema>
