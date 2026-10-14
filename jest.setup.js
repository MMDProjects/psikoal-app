// setupFiles ile çalışır: test modülleri import EDİLMEDEN ÖNCE koşar.
// TZ ve env burada set edilmezse src/lib/env.ts import anında throw eder ve
// tarih formatlayıcıları CI makinesinin saat dilimine göre farklı sonuç üretir.
process.env.TZ = 'Europe/Istanbul'

process.env.EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api'
process.env.EXPO_PUBLIC_APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'development'
process.env.EXPO_PUBLIC_SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'destek@example.com'
process.env.EXPO_PUBLIC_PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://example.com/gizlilik'
process.env.EXPO_PUBLIC_TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL ?? 'https://example.com/kosullar'
process.env.EXPO_PUBLIC_KVKK_URL = process.env.EXPO_PUBLIC_KVKK_URL ?? 'https://example.com/kvkk'
