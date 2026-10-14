import balanceResponse from './__fixtures__/credit-balance.response.json'
import transactionsResponse from './__fixtures__/credit-transactions.response.json'
import { CreditBalanceResponseSchema, CreditTransactionListResponseSchema } from './credit.schema'

// Fixture'lar backend'in CREDIT-1 dalındaki DTO'larından ve CreditContractTests'ten
// birebir kuruldu (CreditBalanceDto, CreditTransactionDto, { data, meta } zarfı).
// Lokal stack o dalı henüz çalıştırmadığı için kayıt DEĞİL; canlı doğrulama
// src/lib/contract.live.test.ts'te.

describe('CreditBalanceResponseSchema', () => {
  it('GET /credits/me yanıtını parse eder', () => {
    const result = CreditBalanceResponseSchema.safeParse(balanceResponse)

    expect(result.error?.issues ?? []).toEqual([])
    expect(result.data?.data).toEqual({ balance: 12, offerCost: 1, balanceLabel: '12 kredi' })
  })

  it('eksi bakiyeyi reddeder (DB CHECK >= 0)', () => {
    const result = CreditBalanceResponseSchema.safeParse({
      data: { ...balanceResponse.data, balance: -1 },
    })
    expect(result.success).toBe(false)
  })

  it('ücretsiz teklif (offerCost 0) geçerlidir', () => {
    const result = CreditBalanceResponseSchema.safeParse({
      data: { ...balanceResponse.data, offerCost: 0 },
    })
    expect(result.success).toBe(true)
  })
})

describe('CreditTransactionListResponseSchema', () => {
  it('GET /credits/transactions yanıtını parse eder', () => {
    const result = CreditTransactionListResponseSchema.safeParse(transactionsResponse)

    expect(result.error?.issues ?? []).toEqual([])
    expect(result.data?.data.map((t) => t.type)).toEqual([
      'OFFER_SPEND',
      'PURCHASE',
      'ADMIN_ADJUST',
    ])
    expect(result.data?.meta).toEqual({ page: 1, total: 3, perPage: 20 })
  })

  it('offerId null olan satırı kabul eder', () => {
    const purchase = transactionsResponse.data.find((t) => t.offerId === null)
    expect(purchase).toBeDefined()

    const result = CreditTransactionListResponseSchema.safeParse({
      ...transactionsResponse,
      data: [purchase],
    })
    expect(result.error?.issues ?? []).toEqual([])
  })

  it('ofsetli ve Z biçimli createdAt değerlerinin ikisini de kabul eder', () => {
    const [first] = transactionsResponse.data
    for (const createdAt of ['2026-10-14T09:12:44.512+00:00', '2026-10-14T09:12:44Z']) {
      const result = CreditTransactionListResponseSchema.safeParse({
        ...transactionsResponse,
        data: [{ ...first, createdAt }],
      })
      expect(result.error?.issues ?? []).toEqual([])
    }
  })

  it('bilinmeyen işlem türünü reddeder', () => {
    const [first] = transactionsResponse.data
    const result = CreditTransactionListResponseSchema.safeParse({
      ...transactionsResponse,
      data: [{ ...first, type: 'REFUND' }],
    })
    expect(result.success).toBe(false)
  })
})
