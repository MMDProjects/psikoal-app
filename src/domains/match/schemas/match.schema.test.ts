import { MatchDetailSchema, MatchSchema } from './match.schema'

const UUID = '11111111-1111-4111-8111-111111111111'

function buildMatchDetail(sessionType: string) {
  return {
    id: UUID,
    listingId: UUID,
    acceptedOfferId: UUID,
    clientId: UUID,
    expertId: UUID,
    status: 'ACTIVE',
    createdAt: '2026-01-01T10:00:00.000Z',
    client: {
      id: UUID,
      fullName: 'Zeynep Yılmaz',
      email: 'zeynep@example.com',
      phone: '+905551112233',
    },
    offer: {
      id: UUID,
      price: 1500,
      description: 'Haftalık online seans',
      sessionType,
      status: 'ACCEPTED',
    },
  }
}

describe('MatchDetailSchema', () => {
  // Kanıtlı sözleşme drift'i: backend session_type enum'unda 'yüz_yüze_online' var,
  // FE şeması bunu kabul etmeyince canlıda ZodError'a düşüyordu.
  it.each(['online', 'yüz_yüze', 'yüz_yüze_online'])(
    'accepts sessionType "%s" on the embedded offer',
    (sessionType) => {
      const result = MatchDetailSchema.safeParse(buildMatchDetail(sessionType))
      expect(result.success).toBe(true)
    }
  )

  it('rejects an unknown sessionType', () => {
    const result = MatchDetailSchema.safeParse(buildMatchDetail('telepati'))
    expect(result.success).toBe(false)
  })

  it('accepts the same enum on the list-level MatchSchema offer', () => {
    const { client: _client, ...rest } = buildMatchDetail('yüz_yüze_online')
    const result = MatchSchema.safeParse(rest)
    expect(result.success).toBe(true)
  })
})
