# Production'a Geçiş Kontrol Listesi

> Gerçek API'ye bağlanırken ve store'a çıkarken yapılması zorunlu temizlik adımları. Her madde tamamlandığında işaretlenmeli.

## Mock Altyapısının Sökülmesi

- [ ] `native-atomic/src/lib/api.ts` içindeki `// ⚠️ MOCK ... // END MOCK` bloğunu sil (axios-mock-adapter kurulumu).
- [ ] `native-atomic/metro.config.js` içindeki `// MOCK ... // END MOCK` bloğunu sil (mock-db watchFolder).
- [ ] `psikoAL/mock-db/` klasörünün tamamını sil (handlers + data + helpers).
- [ ] `package.json`'dan `axios-mock-adapter` dev bağımlılığını kaldır.
- [ ] `native-atomic/src/lib/env.ts` — `EXPO_PUBLIC_APP_ENV` enum'undan `'mock'` değerini kaldır.

## Ortam Değişkenleri (`.env`)

- [ ] `EXPO_PUBLIC_APP_ENV=mock` → `production`.
- [ ] `EXPO_PUBLIC_API_URL=http://192.168.1.13:3000` (yerel LAN IP!) → gerçek API URL'i (HTTPS).
- [ ] `EXPO_PUBLIC_APP_VERSION` sürümle senkron tutulmalı (Ayarlar ekranındaki sürüm satırı buradan okunur).

## Dev-Only UI

- [ ] `native-atomic/src/app/(auth)/login.tsx` — "Test Girişi" hızlı giriş paneli (`quickLogin`/`quickOnboard`, hardcoded `password123`, `uzman@psikoal.com`, `danisan@psikoal.com`, "karşılama turunu sıfırla" butonu). `EXPO_PUBLIC_APP_ENV !== 'production'` ile gate'li; production build öncesi tamamen silinmesi önerilir.

## Placeholder İçerikler

- [ ] Marka logosu: `assets/images/brand/logo-placeholder.png` → gerçek logo (`HomeHero`, `welcome.tsx`, `login.tsx` kullanıyor).
- [ ] "Bu özellik yakında aktif olacak" alert'leri: Ayarlar (Bildirim Ayarları, Destek, Bizi Değerlendir), Kişisel Bilgiler (profil fotoğrafı), Belgeler (CV/Sertifika yükleme), Gizlilik Politikası, expert onboarding foto adımı. Gerçek akışlar bağlanmalı ya da menüden kaldırılmalı.
- [ ] Hesap dondurma / silme aksiyonları (`profile/privacy.tsx`) şu an no-op — gerçek endpoint'lere bağlanmalı.
- [ ] Iyzico checkout mock formu — gerçek 3D Secure WebView akışı doğrulanmalı.

## Bildirimler

- [ ] `expo-notifications` push kaydı ve gerçek `GET /notifications` beslemesi (mock endpoint sözleşmesi: `docs/BACKEND_REQUIREMENTS.md`).
- [ ] Bildirim izni ilk teklif geldiğinde istenmeli (CLAUDE.md kural 7) — henüz implement edilmedi.

## Kod Hijyeni (yapıldı, regresyon kontrolü)

- [x] Frontend'de iş mantığı hesaplaması yok (sayaçlar/filtreler/sıralama/maskeler/etiketler backend'den).
- [x] `console.log/warn/error` çağrıları src'den temizlendi (mock handler'daki tanımsız-endpoint uyarısı mock ile birlikte silinecek).
- [x] Yorum satırları temizlendi; yalnızca `REASON:` gerekçeleri ve MOCK blok işaretleri kaldı.
- [x] Tüm veri ekranlarında pull-to-refresh (`useRefresh` + `AppRefreshControl`).

_Son güncelleme: 18 Temmuz 2026_
