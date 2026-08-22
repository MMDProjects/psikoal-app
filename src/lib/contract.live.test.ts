import { z } from 'zod'

import { AssessmentListItemSchema, MyAssessmentResultSchema } from '@/domains/assessment'
import { AuthUserSchema } from '@/domains/auth'
import { CategoryDetailSchema, CategorySchema } from '@/domains/category'
import { ExpertSchema, ReviewSchema } from '@/domains/expert'
import { ListingSchema } from '@/domains/listing'
import { MatchDetailSchema, MatchSchema } from '@/domains/match'
import { NotificationListResponseSchema } from '@/domains/notification'
import { OfferSchema } from '@/domains/offer'

// Şemalar domain barrel'ından alınıyor (domain izolasyonu kuralı), barrel ise
// api/ hook'larını da açıyor ve onlar AsyncStorage'a iniyor. Bu test ağa çıkıyor
// ama CİHAZA çıkmıyor; native modül burada yalnız import zincirini tıkıyor.
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  multiRemove: jest.fn(async () => undefined),
}))

/**
 * CANLI sözleşme denetçisi: uygulamanın GERÇEK Zod şemalarını, çalışan API'nin
 * GERÇEK yanıtlarına karşı koşturur.
 *
 * Neden ayrı ve varsayılan olarak atlanıyor: birim testleri ağa bağlı olmamalı.
 * Koşturmak için stack ayakta olmalı ve adres verilmeli:
 *
 *   source scripts/e2e-stack.sh && node scripts/seed-demo.mjs   # psikoal-backend
 *   PSIKOAL_LIVE_API=http://localhost:5089 npx jest src/lib/contract.live.test.ts
 *
 * Neden gerekli: bu sınıf hatanın belirtisi YOK. Backend nullable alanı `null`
 * yazar, şemada `.nullable()` eksikse safeParse düşer, hook throw eder ve
 * kullanıcı BOŞ LİSTE görür — HTTP hâlâ 200'dür. Hiçbir durum-kodu testi bunu
 * göremez. Bugüne kadar iki kez tam olarak böyle kırıldı:
 *   OfferSchema.matchId  → ilana gelen tüm teklifler "Henüz teklif gelmedi"
 *   MatchSchema.email    → gizlilik düzeltmesi e-postayı null yapınca
 */
const API = process.env.PSIKOAL_LIVE_API
const describeLive = API ? describe : describe.skip

const CLIENT = { email: 'demo-client@psikoal.test', password: 'DemoClient123!' }
const EXPERT = { email: 'demo-expert-1@psikoal.test', password: 'DemoExpert123!' }

const listOf = <T extends z.ZodTypeAny>(item: T) => z.object({ data: z.array(item) })

async function login(account: { email: string; password: string }): Promise<string> {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  })
  if (!response.ok) throw new Error(`login ${account.email}: ${response.status}`)
  const body = (await response.json()) as { tokens: { accessToken: string } }
  return body.tokens.accessToken
}

async function fetchJson(path: string, token: string): Promise<unknown> {
  const response = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error(`GET ${path}: ${response.status}`)
  return response.json()
}

/**
 * Şemayı yanıta uygular ve düşerse HANGİ alanın bozulduğunu söyler.
 * Çıplak `expect(success).toBe(true)` yalnız "false !== true" der; kırmızı test
 * teşhis etmiyorsa yarısı kadar işe yarar.
 */
function expectMatchesContract(path: string, schema: z.ZodTypeAny, payload: unknown): void {
  const result = schema.safeParse(payload)
  const issues = (result.error?.issues ?? []).map(
    (issue) => `${path} → ${issue.path.join('.')}: ${issue.message}`
  )
  expect(issues).toEqual([])
}

describeLive('canlı sözleşme — danışan', () => {
  let token = ''

  beforeAll(async () => {
    token = await login(CLIENT)
  })

  it.each([
    ['/categories', listOf(CategorySchema)],
    ['/categories/anksiyete', CategoryDetailSchema],
    ['/listings/my', listOf(ListingSchema)],
    ['/offers/my', listOf(OfferSchema)],
    ['/matches', listOf(MatchSchema)],
    ['/notifications', NotificationListResponseSchema],
    ['/assessment', listOf(AssessmentListItemSchema)],
    ['/assessment/results/my', listOf(MyAssessmentResultSchema)],
    ['/auth/me', AuthUserSchema],
  ])('%s uygulamanın şemasına uyar', async (path, schema) => {
    expectMatchesContract(path, schema, await fetchJson(path, token))
  })

  // Kimliği çalışma anında bulunan uçlar: sabit id yazmak testi seed'e bağlar
  // ve seed değişince "sözleşme bozuldu" gibi görünen bir kurulum hatası üretir.
  it('ilan detayı, gelen teklifleri ve eşleşme detayı şemaya uyar', async () => {
    const listings = (await fetchJson('/listings/my', token)) as { data: { id: string }[] }
    const listingId = listings.data[0]?.id
    expect(listingId).toBeDefined()

    expectMatchesContract(
      '/listings/{id}',
      ListingSchema,
      await fetchJson(`/listings/${listingId}`, token)
    )
    expectMatchesContract(
      '/listings/{id}/offers',
      listOf(OfferSchema),
      await fetchJson(`/listings/${listingId}/offers`, token)
    )

    const matches = (await fetchJson('/matches', token)) as { data: { id: string }[] }
    const matchId = matches.data[0]?.id
    expect(matchId).toBeDefined()
    expectMatchesContract(
      '/matches/{id}',
      MatchDetailSchema,
      await fetchJson(`/matches/${matchId}`, token)
    )
  })

  it('uzman profili ve yorumları şemaya uyar', async () => {
    const matches = (await fetchJson('/matches', token)) as {
      data: { expert?: { id: string } }[]
    }
    const expertId = matches.data[0]?.expert?.id
    expect(expertId).toBeDefined()

    expectMatchesContract(
      '/experts/{id}',
      ExpertSchema,
      await fetchJson(`/experts/${expertId}`, token)
    )
    // Bu uç zarf KULLANMIYOR: ExpertsController.GetReviews doğrudan
    // IReadOnlyList<ReviewDto> döndürüyor, yani çıplak dizi. Diğer liste uçları
    // { data, meta } sarmalıyor — sözleşme burada bilinçli olarak asimetrik.
    expectMatchesContract(
      '/experts/{id}/reviews',
      z.array(ReviewSchema),
      await fetchJson(`/experts/${expertId}/reviews`, token)
    )
  })
})

describeLive('canlı sözleşme — uzman', () => {
  let token = ''

  beforeAll(async () => {
    token = await login(EXPERT)
  })

  // Uzman tarafı ayrı ölçülüyor: aynı uçlar farklı gövde üretiyor (danışan adı
  // maskeleniyor, iletişim alanları gizlilik tercihine göre null'lanıyor). Yalnız
  // danışan tarafını doğrulamak uzmana özgü sapmayı kaçırırdı.
  it.each([
    ['/listings', listOf(ListingSchema)],
    ['/offers/my', listOf(OfferSchema)],
    ['/matches', listOf(MatchSchema)],
    ['/notifications', NotificationListResponseSchema],
    ['/auth/me', AuthUserSchema],
  ])('%s uygulamanın şemasına uyar', async (path, schema) => {
    expectMatchesContract(path, schema, await fetchJson(path, token))
  })

  it('eşleşme detayında iletişim alanları şemaya uyar', async () => {
    const matches = (await fetchJson('/matches', token)) as { data: { id: string }[] }
    const matchId = matches.data[0]?.id
    expect(matchId).toBeDefined()

    const detail = await fetchJson(`/matches/${matchId}`, token)
    expectMatchesContract('/matches/{id}', MatchDetailSchema, detail)
  })
})
