# PsikoAl — Frontend Geliştirme Master Planı

> **Kapsam:** React Native / Expo frontend — backend entegrasyonu dahil, admin panel hariç.
> **Hedef:** Faz 1 MVP tam çalışır hale gelene kadar her adım burada izlenir.
> **Durum kodu:** ✅ Tamamlandı · 🔄 Devam ediyor · ⬜ Bekliyor

---

## FAZA 0 — Altyapı & Proje Kimliği ✅

| #   | Görev                                                                                | Dosyalar                            | Durum |
| --- | ------------------------------------------------------------------------------------ | ----------------------------------- | ----- |
| 01  | Repo klonu (native-atomic)                                                           | `native-atomic/`                    | ✅    |
| 02  | Proje kimliği — `name`, `slug`, `scheme` → psikoal                                   | `app.json`, `package.json`          | ✅    |
| 03  | Bricolage + Inter kaldır → `@expo-google-fonts/plus-jakarta-sans` ekle               | `package.json`                      | ✅    |
| 04  | Sky renk paleti — `global.css` brand token'larını sky'a bağla (light + dark)         | `global.css`                        | ✅    |
| 05  | Plus Jakarta Sans font yükleme — `_layout.tsx` güncelle (400/500/600/700/800)        | `src/app/_layout.tsx`               | ✅    |
| 06  | 7 domain klasörü oluştur (expert/client/match/offer/payment/assessment/notification) | `src/domains/*/`                    | ✅    |
| 07  | CLAUDE.md screen haritasına göre 14 route dosyası (iskelet)                          | `src/app/**/*.tsx`                  | ✅    |
| 08  | Auth domain — Zod schema, tipler, authStore güçlendirme (user, updateUser)           | `src/domains/auth/`                 | ✅    |
| 09  | Button atom — `shadow-sm` kaldır, flat design border sistemi; indicator renkleri sky | `src/core/components/atoms/Button/` | ✅    |
| 10  | Tab bar — iris → sky-500; Inter → PlusJakartaSans_500Medium                          | `src/app/(tabs)/_layout.tsx`        | ✅    |

---

## FAZA 1 — Core UI Sistemi (Atoms & Molecules) ✅

> Tüm atom'lar PsikoAl tasarım kısıtlarına uygun: flat design, sky palette, Plus Jakarta Sans.

### Atoms

| #   | Görev                                                                                                                                                                                                              | Dosyalar                              | Durum |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ----- |
| 11  | **Text atom** — Plus Jakarta Sans bağlantısını kontrol et; `font-display` / `font-body` token'larını doğrula; tüm variant'ları (display/heading/subheading/body/label/caption/overline) test et                    | `src/core/components/atoms/Text/`     | ✅    |
| 12  | **Input atom** — state farkı tamamen border rengiyle (shadow yok); focused → `border-sky-400`; error → `border-red-400`; success → `border-green-400`; disabled opacity                                            | `src/core/components/atoms/Input/`    | ✅    |
| 13  | **Badge atom** — variant: `sky \| sage \| warning \| error \| neutral`; sky badge'i PsikoAl renk sistemine güncelle; test güncelle                                                                                 | `src/core/components/atoms/Badge/`    | ✅    |
| 14  | **Avatar atom** — size: `xs/sm/md/lg/xl`; initials fallback (isim yoksa); verified rozet prop'u ekle; border sistemi                                                                                               | `src/core/components/atoms/Avatar/`   | ✅    |
| 15  | **Icon atom** — Lucide wrapper; mevcut implementasyonu doğrula; eksik icon name'leri ekle (PsikoAl ihtiyaçları: `Users`, `FileText`, `Compass`, `Bell`, `Star`, `Clock`, `CheckCircle`, `XCircle`, `Send`, `Lock`) | `src/core/components/atoms/Icon/`     | ✅    |
| 16  | **Skeleton atom** — shimmer animasyon (Reanimated); width/height/rounded prop'ları; flat design (gölge yok)                                                                                                        | `src/core/components/atoms/Skeleton/` | ✅    |
| 17  | **Chip atom** — closeable opsiyonu; selected state: `bg-sky-50 border-sky-200`; unselected: `border-neutral-200`; sky palette entegrasyon                                                                          | `src/core/components/atoms/Chip/`     | ✅    |
| 18  | **Divider atom** — horizontal/vertical; mevcut implementasyonu doğrula                                                                                                                                             | `src/core/components/atoms/Divider/`  | ✅    |

### Molecules

| #   | Görev                                                                                                                                                         | Dosyalar                                      | Durum |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----- |
| 19  | **InputField molecule** — Input + Label + Hint/Error mesajı; React Hook Form `Controller` uyumlu; `register` veya `control` prop; error state otomatik aktive | `src/core/components/molecules/InputField/`   | ✅    |
| 20  | **SearchBar molecule** — Input + search icon + clear button; debounce prop; `onSearch` callback; sky focus ring                                               | `src/core/components/molecules/SearchBar/`    | ✅    |
| 21  | **RatingRow molecule** — 1–5 yıldız; dolu yıldız sky-500; puan metni + yorum sayısı; read-only ve interactive mod                                             | `src/core/components/molecules/RatingRow/`    | ✅    |
| 22  | **StatCard molecule** — değer + etiket; profil istatistikleri için; sky accent; border bazlı kart                                                             | `src/core/components/molecules/StatCard/`     | ✅    |
| 23  | **PriceDisplay molecule** — fiyat + birim (₺/seans); indirim rozeti (Badge); üstü çizili eski fiyat; sky renk sistemi                                         | `src/core/components/molecules/PriceDisplay/` | ✅    |
| 24  | **IconButton molecule** — Icon + optional label; circular ve square variant; sky active state                                                                 | `src/core/components/molecules/IconButton/`   | ✅    |

---

## FAZA 2 — Auth Akışı (Login → Onboarding) ✅

| #   | Görev                                                                                                                                                                         | Dosyalar                                      | Durum |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----- |
| 25  | **Auth API hooks** — `useLoginMutation`, `useRegisterMutation`, `useLogoutMutation`; Axios interceptor: 401 → refresh → retry; Zod parse response                             | `src/domains/auth/api/`                       | ✅    |
| 26  | **Login ekranı** — RHF + Zod resolver; e-posta + şifre; `useLoginMutation` bağlantısı; hata mesajları TR; loading state; `router.replace('/(tabs)/')`                         | `src/app/(auth)/login.tsx`                    | ✅    |
| 27  | **Register ekranı** — Adım 1: rol seçimi (Uzman / Danışan card'ları); Adım 2: ad-soyad + e-posta + şifre; rol seçimine göre onboarding'e yönlendir                            | `src/app/(auth)/register.tsx`                 | ✅    |
| 28  | **Uzman onboarding** — 5 adımlı form (ünvan, uzmanlık alanları, yıl deneyimi, biyografi, fotoğraf); progress bar; her adım ayrı schema; son adımda `useExpertProfileMutation` | `src/app/(auth)/onboarding/expert.tsx`        | ✅    |
| 29  | **Danışan onboarding** — davet linki JWT parse; şifre belirle; KVKK onay; profil tamamla → `router.replace('/(tabs)/')`                                                       | `src/app/(auth)/onboarding/client.tsx`        | ✅    |
| 30  | **`useClientOrigin` hook** — `client.registrationType === 'invited'` → Faz 1; `'self'` → Faz 2; UI dallanması burada soyutlanır                                               | `src/domains/client/hooks/useClientOrigin.ts` | ✅    |

---

## FAZA 3 — Expert Domain ✅

| #   | Görev                                                                                                                                                                                                | Dosyalar                                              | Durum |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----- |
| 31  | **Expert Zod schema + tipler** — `ExpertSchema` (id, name, title, specializations, experience, bio, avatarUrl, rating, reviewCount, isVerified, status: pending/approved/rejected); `z.infer` tipler | `src/domains/expert/schemas/expert.schema.ts`         | ✅    |
| 32  | **Expert constants** — `expertKeys` query key factory; uzmanlık alanları sabit listesi                                                                                                               | `src/domains/expert/constants.ts`                     | ✅    |
| 33  | **Expert API hooks** — `useExpertProfileQuery(id)`, `useExpertListQuery(filters)`, `useExpertProfileMutation` (create/update); Zod parse; staleTime 5dk                                              | `src/domains/expert/api/`                             | ✅    |
| 34  | **ExpertProfileHero organism** — Avatar + verified rozet + isim + ünvan + RatingRow + uzmanlık Chip'leri; border bazlı card (flat); domain component                                                 | `src/domains/expert/components/ExpertProfileHero.tsx` | ✅    |
| 35  | **Expert profil ekranı** (`/expert/[id]`) — `useExpertProfileQuery`; Skeleton loading; ExpertProfileHero; biyografi; StatCard'lar (seans sayısı, deneyim, puan); "Teklif Al" CTA (client only)       | `src/app/expert/[id].tsx`                             | ✅    |
| 36  | **Explore ekranı** (`/explore`) — SearchBar + filtreler (uzmanlık, fiyat, puan); `useExpertListQuery`; FlatList; ExpertCard (mini); Skeleton loading state                                           | `src/app/(tabs)/explore.tsx`                          | ✅    |

---

## FAZA 4 — Client Domain ✅

| #   | Görev                                                                                                                                                          | Dosyalar                                          | Durum |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----- |
| 37  | **Client Zod schema + tipler** — `ClientSchema` (id, fullName, email, phone, matchCode, matchStatus, registrationType: invited/self, notes, createdAt); tipler | `src/domains/client/schemas/client.schema.ts`     | ✅    |
| 38  | **Client constants** — `clientKeys` query key factory                                                                                                          | `src/domains/client/client.constants.ts`          | ✅    |
| 39  | **Client API hooks** — `useClientListQuery()` (expert'in danışanları), `useClientProfileQuery(id)`, `useAddClientMutation`; Zod parse                          | `src/domains/client/api/`                         | ✅    |
| 40  | **Danışan ekle formu** — ad-soyad, e-posta/telefon, opsiyonel not; `useAddClientMutation`; başarıda match code göster; expert home'dan tetiklenir              | `src/domains/client/components/AddClientForm.tsx` | ✅    |
| 41  | **Client detay ekranı** (`/client/[id]`) — expert only; danışan bilgileri; eşleşme durumu (MatchCodeBanner); geçmiş teklifler; geçmiş seanslar                 | `src/app/client/[id].tsx`                         | ✅    |

---

## FAZA 4.5 — Listing Domain ✅

> v2 mimari revizyonu: danışan ilan açar, uzmanlar teklif gönderir.

| #   | Görev                                                                                                                                                                                  | Dosyalar                                               | Durum |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----- |
| 96  | **Listing Zod schema + tipler** — `ListingSchema`; `CreateListingSchema`; `preferredSessionType` → `z.preprocess` ile `fark_etmez` → `yüz_yüze_online` backend uyumluluğu              | `src/domains/listing/schemas/listing.schema.ts`        | ✅    |
| 97  | **Listing constants** — `listingKeys` query key factory; `LISTING_EXPIRE_DAYS = 30`; `LISTING_MAX_ACTIVE = 3`; `SESSION_TYPE_LABELS` (`yüz_yüze_online: 'Yüz Yüze / Online'`)          | `src/domains/listing/listing.constants.ts`             | ✅    |
| 98  | **Listing API hooks** — `useListingListQuery()`, `useMyListingsQuery()`, `useListingDetailQuery(id)`, `useCreateListingMutation`, `useCloseListingMutation`                            | `src/domains/listing/api/`                             | ✅    |
| 99  | **ListingCard organism** — başlık + client avatar + uzmanlık Chip (max 3) + bütçe aralığı + teklif sayısı badge + durum badge; `viewerRole` prop                                       | `src/domains/listing/components/ListingCard.tsx`       | ✅    |
| 100 | **ListingDetail organism** — tam ilan içeriği; expert: "Teklif Gönder" CTA + mevcut teklif badge; client: "İlanı Kapat" + gelen teklif sayısı                                          | `src/domains/listing/components/ListingDetail.tsx`     | ✅    |
| 101 | **CreateListingForm organism** — RHF + Zod; 3 adım: Başlık/Açıklama → Uzmanlık (Chip multi-select) → Bütçe + Seans Tipi; `useCreateListingMutation`                                    | `src/domains/listing/components/CreateListingForm.tsx` | ✅    |
| 102 | **İlan oluşturma ekranı** (`/listing/new`) — client only; CreateListingForm; onSuccess: `router.push('/listing/${id}')`                                                                | `src/app/listing/new.tsx`                              | ✅    |
| 103 | **İlan detay ekranı** (`/listing/[id]`) — ListingDetail; fixed bottom bar (rounded-full h-14); expert: Teklif Gönder / Teklif Gönderildi; client: İlanı Kapat; gelen teklifler listesi | `src/app/listing/[id].tsx`                             | ✅    |

---

## FAZA 5 — Match Domain ✅ (v2 Yeniden Yazım)

> Eski: code tabanlı FREE→PENDING→MATCHED state machine. Yeni: teklif kabulüyle otomatik oluşan ACTIVE→COMPLETED/RELEASED.

| #   | Görev                                                                                                                                                                                                    | Dosyalar                                           | Durum |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----- |
| 42  | **Match Zod schema + tipler** — `MatchSchema` (id, listingId, acceptedOfferId, clientId, expertId, status: ACTIVE/COMPLETED/RELEASED, createdAt); `ReleaseMatchBodySchema`                               | `src/domains/match/schemas/match.schema.ts`        | ✅    |
| 43  | **Match constants** — `matchKeys`; `MATCH_STATUS_CONFIG` (ACTIVE→sky, COMPLETED→sage, RELEASED→neutral) — eski code sabitler kaldırıldı                                                                  | `src/domains/match/match.constants.ts`             | ✅    |
| 44  | **Match API hooks** — `useMatchesQuery()`, `useMatchDetailQuery(id)`, `useMyMatchQuery()`, `useReleaseMatchMutation`; kaldırılan: useMatchListQuery, useSendMatchRequestMutation, useAcceptMatchMutation | `src/domains/match/api/`                           | ✅    |
| 45  | ~~`useMatchCountdown` hook~~ — **KALDIRILDI** (artık 48h PENDING timeout yok)                                                                                                                            | —                                                  | ✅    |
| 46  | **MatchBanner organism** — ACTIVE/COMPLETED/RELEASED durumu Badge ile; border bazlı flat card; match code display kaldırıldı                                                                             | `src/domains/match/components/MatchCodeBanner.tsx` | ✅    |
| 47  | ~~**Eşleşme talebi onayı ekranı**~~ (`/match/request/[code]`) — **KALDIRILDI** (code akışı yok)                                                                                                          | silindi: `src/app/match/request/[code].tsx`        | ✅    |
| 47a | **Eşleşmelerim tab ekranı** (`/matches`) — expert only; Aktif/Geçmiş pill switcher (neutral-200/800); `useMatchesQuery`; eşleşme satırı → `/match/[id]`                                                  | `src/app/(tabs)/matches.tsx`                       | ✅    |
| 47b | **Eşleşme detay ekranı** (`/match/[id]`) — expert only; danışan tam adı + iletişim bilgileri; ilan özeti; kabul edilen teklif; `useMatchDetailQuery`                                                     | `src/app/match/[id].tsx`                           | ✅    |

---

## FAZA 6 — Offer Domain ✅ (v2 Yeniden Yazım)

> Eski: clientId + tiers (kademe sistemi) + DRAFT/SENT/EXPIRED. Yeni: listingId + tek fiyat + PENDING/ACCEPTED/REJECTED/WITHDRAWN.

| #   | Görev                                                                                                                                                                                                                 | Dosyalar                                     | Durum |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----- |
| 48  | **Offer Zod schema + tipler** — `OfferSchema`; `SendOfferSchema`; `sessionType` enum: `online \| yüz_yüze \| yüz_yüze_online`                                                                                         | `src/domains/offer/schemas/offer.schema.ts`  | ✅    |
| 49  | **Offer constants** — `offerKeys`; `OFFER_STATUS_CONFIG` (PENDING→warning, ACCEPTED→sage, REJECTED→error, WITHDRAWN→neutral)                                                                                          | `src/domains/offer/offer.constants.ts`       | ✅    |
| 50  | **Offer API hooks** — `useSendOfferMutation`, `useAcceptOfferMutation`, `useRejectOfferMutation`, `useWithdrawOfferMutation`, `useListingOffersQuery(listingId)`, `useExpertOffersQuery()`, `useOfferDetailQuery(id)` | `src/domains/offer/api/`                     | ✅    |
| 51  | ~~`useOfferCountdown` hook~~ — **KALDIRILDI** (kademe/countdown sistemi yok)                                                                                                                                          | —                                            | ✅    |
| 52  | **OfferCard organism** — tek fiyat + açıklama + uzman avatar + durum badge; aksiyon butonları (PENDING'de)                                                                                                            | `src/domains/offer/components/OfferCard.tsx` | ✅    |
| 53  | **Teklif gönderme ekranı** (`/offer/new?listingId=X`) — expert only; 3 seans tipi chip (Online / Yüz Yüze / Yüz Yüze / Online); fixed bottom submit bar (rounded-full h-14)                                           | `src/app/offer/new.tsx`                      | ✅    |
| 54  | **Teklif detay ekranı** (`/offer/[id]`) — fixed bottom bar; client: "Teklifi Kabul Et" + "Reddet" (50/50); expert: "Teklifi Geri Çek"; Alert onay uyarısı                                                             | `src/app/offer/[id].tsx`                     | ✅    |
| 55  | **Teklifler ekranı** (`/offers`) — expert: gönderilen teklifler, ACCEPTED → `/match/[matchId]`; client: ilanlarım (OPEN/geçmiş Aktif/Geçmiş sekmeleri)                                                                | `src/app/(tabs)/offers.tsx`                  | ✅    |

---

## FAZA 7 — Assessment Domain (Ücretsiz Test) ✅

| #   | Görev                                                                                                                                                                   | Dosyalar                                                     | Durum |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----- |
| 56  | **Assessment Zod schema + tipler** — `QuestionSchema`, `AnswerSchema`, `TestSchema`, `TestResultSchema` (score, level, summary, suggestions); `AssessmentSessionSchema` | `src/domains/assessment/schemas/assessment.schema.ts`        | ✅    |
| 57  | **Assessment API hooks** — `useAssessmentQuery()`, `useSubmitAssessmentMutation`; auth gerektirmez → `queryClient` enabled koşulsuz                                     | `src/domains/assessment/api/`                                | ✅    |
| 58  | **`useAssessmentEngine` hook** — soru index state; ilerleme; cevap toplama; multiple_choice / single_choice desteği; goPrev/goNext/reset                                | `src/domains/assessment/hooks/useAssessmentEngine.ts`        | ✅    |
| 59  | **Assessment ekranı** (`/assessment`) — auth gerektirmez; intro + progress bar; soru kartı; seçenek listesi; `useAssessmentEngine` entegre                              | `src/app/assessment/index.tsx`                               | ✅    |
| 60  | **AssessmentResultCard organism** — skor göstergesi; level badge (sage/warning/error); özet + öneriler; "Uzman Bul" CTA; "Testi Tekrar Yap"                             | `src/domains/assessment/components/AssessmentResultCard.tsx` | ✅    |
| 61  | **Sonuç ekranı** (`/assessment/result`) — AssessmentResultCard kullanır; query cache'ten sonuç okur; navigasyon aksiyonları                                             | `src/app/assessment/result.tsx`                              | ✅    |

---

## FAZA 8 — Payment Domain ✅

| #   | Görev                                                                                                                                                               | Dosyalar                                           | Durum |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----- |
| 62  | **Payment Zod schema + tipler** — `PackageSchema`, `WalletSchema` (balance, currency, transactions), `WalletTransactionSchema`, `CheckoutSessionSchema`; tüm tipler | `src/domains/payment/schemas/payment.schema.ts`    | ✅    |
| 63  | **Payment API hooks** — `usePackagesQuery()`, `useInitiateCheckoutMutation`, `useWalletQuery()`; **optimistic update yasak** para işlemlerinde                      | `src/domains/payment/api/`                         | ✅    |
| 64  | **PackagePicker organism** — paket kartları; selected state: `bg-sky-50 border-sky-300`; indirim yüzdesi Badge; seans başı fiyat; accessibilityRole radio           | `src/domains/payment/components/PackagePicker.tsx` | ✅    |
| 65  | **Paketler ekranı** (`/payment/packages`) — PackagePicker entegre; sticky bottom CTA; Skeleton loading; `usePackagesQuery`                                          | `src/app/payment/packages.tsx`                     | ✅    |
| 66  | **Checkout + Iyzico WebView** — `useInitiateCheckoutMutation` → `iyzicoToken`; deep link callback `psikoal://payment/callback`; başarı/başarısız yönlendirme        | `src/app/payment/checkout.tsx`                     | ✅    |
| 67  | **Cüzdan / Kontör gösterimi** — compact ve full mod; `useWalletQuery`; Skeleton loading state                                                                       | `src/domains/payment/components/WalletBalance.tsx` | ✅    |

---

## FAZA 9 — Ana Ekranlar & Tab Navigasyon ✅

| #   | Görev                                                                                                                                                      | Dosyalar                           | Durum |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----- |
| 68  | **Expert Home** (`/` — Fırsatlar) — OPEN ilanların FlatList'i; seans tipi / fiyat filtresi Chip; `useListingListQuery`; ListingCard; Skeleton + EmptyState | `src/app/(tabs)/index.tsx`         | ✅    |
| 69  | **Client Home** (`/` — İlanlarım) — `useMyListingsQuery` → kendi ilanları; aktif eşleşme MatchBanner; "İlan Oluştur" CTA; EmptyState                       | `src/app/(tabs)/index.tsx`         | ✅    |
| 70  | **Profile ekranı** — Avatar + rol rozeti; menu sistemi; expert: uzman profiline link; logout; `useLogoutMutation`                                          | `src/app/(tabs)/profile.tsx`       | ✅    |
| 71  | **Tab bar rol guard** — rol bazlı tab konfigürasyonu; matches sekmesi expert'e gösterilir, client için `href: null`                                        | `src/app/(tabs)/_layout.tsx`       | ✅    |
| 71a | **Bildirimler ekranı** (`/notifications`) — client only tab; bildirim listesi; placeholder (Faza 10 ile tamamlanır)                                        | `src/app/(tabs)/notifications.tsx` | ✅    |

---

## FAZA 10 — Notification Domain

| #   | Görev                                                                                                                                                                                                                                  | Dosyalar                                                      | Durum |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----- |
| 72  | **Notification Zod schema + tipler** — `NotificationSchema` (id, type, title, body, data, isRead, createdAt); `NotificationType` enum: NEW_OFFER / OFFER_UPDATED / MATCH_REQUEST / MATCH_ACCEPTED / PAYMENT_SUCCESS / SESSION_REMINDER | `src/domains/notification/schemas/notification.schema.ts`     | ⬜    |
| 73  | **`useNotificationPermission` hook** — `expo-notifications` `PermissionStatus`; ilk teklif geldiğinde çağrılır (login'de değil); izin sonucunu Zustand'a kaydet                                                                        | `src/domains/notification/hooks/useNotificationPermission.ts` | ⬜    |
| 74  | **Notification API hooks** — `useNotificationListQuery()`, `useMarkReadMutation`; FCM token'ı backend'e kaydet (`useRegisterPushTokenMutation`)                                                                                        | `src/domains/notification/api/`                               | ⬜    |
| 75  | **NotificationItem organism** — icon (tip bazlı) + başlık + body + zaman; okunmamış → `bg-sky-50`; okunmuş → `bg-surface-base`; press → ilgili sayfaya yönlendir                                                                       | `src/domains/notification/components/NotificationItem.tsx`    | ⬜    |
| 76  | **In-app bildirim trigger** — offers ekranındaki ilk teklif alındığında `useNotificationPermission` çağır; TanStack Query `onSuccess` callback                                                                                         | `src/app/(tabs)/offers.tsx`                                   | ⬜    |

---

## FAZA 11 — Polish, Error Handling & Edge Cases

| #   | Görev                                                                                                                                                                              | Dosyalar                                                        | Durum |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----- |
| 77  | **Axios interceptor** — 401 → token refresh → retry; 403 → rol guard toast + logout; 422 → Zod ile field error mapping; 429 → backoff + toast                                      | `src/lib/api.ts`                                                | ⬜    |
| 78  | **Global error boundary** — React `ErrorBoundary` wrapper; API hata mesajlarını TR olarak toast'a aktar; `ApiError` tipi ile bağlantı                                              | `src/core/components/templates/AppProviders.tsx`                | ⬜    |
| 79  | **Empty states** — her liste ekranı için: boş veri durumu illüstrasyon + açıklama + CTA                                                                                            | `src/core/components/molecules/EmptyState.tsx`                  | ⬜    |
| 80  | **Skeleton entegrasyonu** — `isLoading` → Skeleton listesi; ExpertProfile, ClientDetail, OfferDetail, AssessmentResult                                                             | ilgili ekranlar                                                 | ⬜    |
| 81  | **Deep link handling** — notification'dan açıldığında doğru ekrana yönlendir                                                                                                       | `src/app/_layout.tsx`                                           | ⬜    |
| 82  | **Form validation edge cases** — cross-field Zod; paket min/max seans (3–20); tarih/saat geçmiş kontrolü                                                                           | ilgili form'lar                                                 | ⬜    |
| 83  | **Offline / network error** — `@tanstack/react-query` `networkMode`; offline toast; retry on reconnect                                                                             | `src/lib/queryClient.ts`                                        | ⬜    |
| 84  | ~~**`useClientOrigin` entegrasyonu**~~ — **KALDIRILDI** (danışanlar artık doğrudan platforma kayıt olur)                                                                           | —                                                               | ✅    |
| 85a | **Şifremi unuttum ekranı** — e-posta girişi; `usePasswordResetMutation`; başarı mesajı                                                                                             | `src/app/(auth)/forgot-password.tsx`                            | ⬜    |
| 85b | **Expert "profil beklemede" guard** — `expert.status === 'pending'` durumunda özel ekran; tab navigasyonuna geçişi engeller                                                        | `src/app/(tabs)/_layout.tsx`                                    | ⬜    |
| 85c | **Expert profil düzenleme ekranı** — RHF + Zod; ünvan, biyografi, uzmanlık, fotoğraf; `useExpertProfileMutation` (update)                                                          | `src/app/expert/edit.tsx`                                       | ⬜    |
| 85d | **Chip atom — semantik token sistemi** — `brand/tag/session/price` token grupları; pastel `bg-*-muted/60 dark:bg-*/20` seçili haller; `price.*` token grubu Tailwind'e eklendi     | `src/core/components/atoms/Chip/Chip.tsx`, `tailwind.config.js` | ✅    |
| 85e | **Avatar atom — NativeWind inline style fix** — `style={{ backgroundColor: undefined }}` className'i ezmesini önlemek için koşullu style prop                                      | `src/core/components/atoms/Avatar/Avatar.tsx`                   | ✅    |
| 85f | **Bottom action bar standardizasyonu** — tüm CTA butonları scroll-dışı fixed bar; `rounded-full h-14`; 2 buton → 50/50 flex-row; ghost: `bg-neutral-100 border border-neutral-300` | `listing/[id].tsx`, `offer/[id].tsx`, `offer/new.tsx`           | ✅    |

---

## FAZA 12 — Test Coverage

| #   | Görev                                                                                                        | Dosyalar                                      | Durum |
| --- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ----- |
| 85  | Atom testleri — Text, Input, Button, Badge, Avatar, Chip, Skeleton (%100 prop coverage)                      | `src/core/components/atoms/**/*.test.tsx`     | ⬜    |
| 86  | Molecule testleri — InputField (RHF entegrasyonu), PriceDisplay, RatingRow (%100)                            | `src/core/components/molecules/**/*.test.tsx` | ⬜    |
| 87  | Hook testleri — `useAssessmentEngine`, `useListingStatus` (%80 min)                                          | `src/domains/*/hooks/*.test.ts`               | ⬜    |
| 88  | Util testleri — `formatPrice`, `formatDate`, `validation`, `array`, `string` (%100)                          | `src/core/utils/*.test.ts`                    | ⬜    |
| 89  | Organism smoke testleri — ExpertProfileHero, ListingCard, OfferCard, MatchBanner, ReviewList render testleri | `src/domains/*/components/*.test.tsx`         | ⬜    |
| 90  | Auth flow entegrasyon testi — Login → redirect; Register → onboarding; logout → login redirect               | `src/app/(auth)/**/*.test.tsx`                | ⬜    |

---

## FAZA 13 — Review Domain

> Doğrulanmış seans sonrası yorum sistemi. Expert profil sayfasında görünür; yalnızca tamamlanmış seans sahibi danışan yorum yapabilir.

| #   | Görev                                                                                                                                                                                                 | Dosyalar                                       | Durum |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----- |
| 91  | **Review Zod schema + tipler** — `ReviewSchema` (id, expertId, clientId, rating: 1–5, comment, sessionId, createdAt); `CreateReviewSchema`; `z.infer` tipler                                          | `src/domains/review/schemas/review.schema.ts`  | ⬜    |
| 92  | **Review API hooks** — `useExpertReviewsQuery(expertId)`: paginated yorum listesi; `useCreateReviewMutation`: yorum oluştur; Zod parse; **bir danışan aynı uzmana yalnızca 1 yorum yapabilir** kuralı | `src/domains/review/api/`                      | ⬜    |
| 93  | **ReviewForm component** — RHF + Zod; 1–5 yıldız seçimi (RatingRow interactive mod); yorum textarea; `useCreateReviewMutation`; modal veya bottom sheet içinde; seans sonrası tetiklenir              | `src/domains/review/components/ReviewForm.tsx` | ⬜    |
| 94  | **ReviewList organism** — expert profil sayfasında; Avatar + isim (anonim opsiyonu) + RatingRow + yorum metni + tarih; FlatList + Skeleton; boş durum                                                 | `src/domains/review/components/ReviewList.tsx` | ⬜    |
| 95  | **Seans sonrası bildirim trigger** — seans tamamlandığında (backend event veya manual) client'a yorum CTA göster; `useNotificationPermission` ile koordineli; ReviewForm'u aç                         | `src/domains/review/hooks/useReviewTrigger.ts` | ⬜    |

---

## Özellik → Adım Bağımlılık Haritası

```
F1 (Uzman Profil)        → Adım 25, 31-35
F2 (Danışan Kayıt)       → Adım 37-41
F3 (İlan Sistemi)        → Adım 96-103  ← F1+F2 tamamlanmalı
F4 (Teklif Sistemi)      → Adım 48-55   ← F3 tamamlanmalı
F5 (Eşleşme)             → Adım 42-47   ← F4 tamamlanmalı (teklif kabulüyle tetiklenir)
F6 (Paket/Ödeme)         → Adım 62-67   ← F5 tamamlanmalı
F7 (Ücretsiz Test)       → Adım 56-61   ← Bağımsız geliştirilebilir
F8 (Yorum Sistemi)       → Adım 91-95   ← F6 tamamlanmalı (doğrulanmış seans)
F9 (Bildirim)            → Adım 72-76   ← F3-F8 paralel geliştirilebilir
Ana Ekranlar             → Adım 68-71   ← F3-F5 tamamlanmalı
Polish                   → Adım 77-85c  ← Tüm özellikler sonrası
Testler                  → Adım 85-90   ← Her faza sonrası
```

---

## İlerleme Özeti

| Faza                         | Toplam Adım | Tamamlanan | %       |
| ---------------------------- | ----------- | ---------- | ------- |
| 0 — Altyapı                  | 10          | 10         | 100%    |
| 1 — Core UI                  | 14          | 14         | 100%    |
| 2 — Auth                     | 6           | 6          | 100%    |
| 3 — Expert                   | 6           | 6          | 100%    |
| 4 — Client                   | 5           | 5          | 100%    |
| 4.5 — Listing (v2)           | 8           | 8          | 100%    |
| 5 — Match (v2 yeniden yazım) | 8           | 8          | 100%    |
| 6 — Offer (v2 yeniden yazım) | 8           | 8          | 100%    |
| 7 — Assessment               | 6           | 6          | 100%    |
| 8 — Payment                  | 6           | 6          | 100%    |
| 9 — Ana Ekranlar             | 5           | 5          | 100%    |
| 10 — Notification            | 5           | 0          | 0%      |
| 11 — Polish                  | 14          | 4          | 29%     |
| 12 — Testler                 | 6           | 0          | 0%      |
| 13 — Review                  | 5           | 0          | 0%      |
| **TOPLAM**                   | **112**     | **86**     | **77%** |

---

_Hazırlayan: Tekin Labs × Claude — Haziran 2025_
_v2 Revizyon: Haziran 2026 — İlan bazlı pazar yeri mimarisine geçiş_
_Güncelleme: Temmuz 2026 — Listing/Offer/Match domainleri tamamlandı; UI standardizasyon (Chip, Avatar, bottom bar)_
