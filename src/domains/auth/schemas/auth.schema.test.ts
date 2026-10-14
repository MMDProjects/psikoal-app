import { RegisterRequestSchema } from './auth.schema'

const valid = {
  email: 'zeynep@psikoal.test',
  password: 'GucluSifre1',
  firstName: 'Zeynep',
  lastName: 'Yılmaz',
  role: 'client' as const,
  termsAccepted: true,
  healthDataConsent: true,
}

describe('RegisterRequestSchema — KVKK onayları', () => {
  it('accepts a body with both consents', () => {
    expect(RegisterRequestSchema.parse(valid)).toEqual(valid)
  })

  it('rejects when terms are not accepted', () => {
    const result = RegisterRequestSchema.safeParse({ ...valid, termsAccepted: false })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['termsAccepted'])
  })

  it('rejects when explicit health-data consent is missing', () => {
    const result = RegisterRequestSchema.safeParse({ ...valid, healthDataConsent: false })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'Sağlık verilerinizin işlenmesine açık rıza zorunludur'
    )
  })

  it('rejects a body without the consent fields at all', () => {
    const { termsAccepted: _t, healthDataConsent: _h, ...withoutConsent } = valid
    expect(RegisterRequestSchema.safeParse(withoutConsent).success).toBe(false)
  })
})
