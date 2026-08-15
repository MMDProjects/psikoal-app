import type { ExpertSchema, ExpertOnboardingSchema } from '../schemas/expert.schema'
import type { z } from 'zod'

export type Expert = z.infer<typeof ExpertSchema>
export type ExpertOnboarding = z.infer<typeof ExpertOnboardingSchema>
