<!-- Bu dosya psikoAL kök klasöründen taşındı (DEVOPS-PSIKOAL.md, Faz 1 / adım 8).
     Kanonik kaynak artık burasıdır; kök kopyası kaldırılmıştır. -->

@AGENTS.md

# CLAUDE.md

> Bu dosya iki bölümden oluşur.
> **PART 1 — Universal Core:** Bu `core/` mimarisini kullanan her React Native / Expo projesinde geçerlidir. Yeni projeye taşınırken bu bölüm olduğu gibi korunur.
> **PART 2 — PsikoAl:** Yalnızca bu projeye özgü kurallar, domain tanımları ve iş mantığı. Yeni projede bu bölüm sıfırdan yazılır.

---

## PART 1 — UNIVERSAL CORE

### 1. Temel Prensipler

1. **Component = Görünüm.** İş mantığı componentin içinde olmaz; hook veya service katmanına taşınır.
2. **Atomic hiyerarşi bozulmaz.** Atom → Molecule → Organism → Template. Katman atlanamaz, geriye doğru import yapılamaz.
3. **Domain izolasyonu kesindir.** Bir domain başka bir domainden sadece `index.ts` barrel'ı üzerinden import alabilir.
4. **Server state = TanStack Query. UI state = Zustand. Component state = useState.** Bu üç kategori karıştırılmaz.
5. **Zod schema'ları tip sisteminin tek kaynağıdır.** API response ve form tipleri Zod'dan `z.infer<>` ile türetilir.
6. **NativeWind className'leri dışında stil yazılmaz.** `StyleSheet.create` ve inline `style={}` kullanılmaz; zorunlu kalınırsa yorum ile gerekçelendirilir.

---

### 2. Klasör ve Dosya Yapısı

#### App İç Yapısı

```
src/
  app/                  ← Expo Router: route dosyaları burada
    (auth)/             ← Auth group (header/tab yok)
      login.tsx
      register.tsx
    (tabs)/             ← Ana tab grubu
      index.tsx         ← Home
      explore.tsx
      profile.tsx
    _layout.tsx
  core/                 ← Evrensel atomic design sistemi
    components/
      atoms/
      molecules/
      organisms/
      templates/
    hooks/              ← Evrensel utility hook'lar
    utils/              ← Pure functions
    types/              ← Evrensel tipler
    theme/              ← Design tokens, NativeWind config
  screens/              ← Rol bazlı ekran kompozisyonları (route dosyaları ince switch olarak kalır)
    home/               ← ExpertHomeScreen + ClientHomeScreen + HomeHero
    offers/             ← ExpertOffersScreen + ClientListingsScreen
  domains/              ← İş mantığı katmanları
    [domain-adı]/
      api/              ← TanStack Query hooks (useXxxQuery, useXxxMutation)
      components/       ← Domain'e özel molecules/organisms
      hooks/            ← İş mantığı hook'ları
      schemas/          ← Zod schemas
      types/            ← z.infer<> ile türetilmiş tipler
      utils/            ← Domain yardımcıları
      store/            ← Zustand slice (gerekirse)
      index.ts          ← PUBLIC API — sadece burası dışarıya açılır
  lib/
    api.ts              ← Axios/Fetch instance
    queryClient.ts      ← TanStack Query config
    storage.ts          ← MMKV instance
  store/
    index.ts            ← Zustand root store
  navigation/           ← Typed navigation helpers
```

#### Dosya Adlandırma Kuralları

```
Component dosyası    →  PascalCase.tsx           Button.tsx, ExpertCard.tsx
Hook dosyası         →  useXxx.ts               useExpertList.ts, useOfferPrice.ts
Util dosyası         →  verb-noun.ts            formatPrice.ts, parseDate.ts
Schema dosyası       →  [domain].schema.ts      offer.schema.ts
Tip dosyası          →  [domain].types.ts       expert.types.ts
Sabit dosyası        →  [domain].constants.ts   offer.constants.ts
Test dosyası         →  [dosya].test.tsx         Button.test.tsx
Index barrel         →  index.ts                (sadece public API için)
```

#### Component Klasör Yapısı (her atom/molecule/organism için)

```
core/components/atoms/Button/
  Button.tsx
  Button.test.tsx
  index.ts            ← export { Button } from './Button';
```

---

### 3. Atomic Design Kuralları

| Katman       | Tanım                                                                  | İçe aktarabilir          | İçe aktaramaz                |
| ------------ | ---------------------------------------------------------------------- | ------------------------ | ---------------------------- |
| **Atom**     | Bölünemez en küçük birim. Sadece kendi stilini ve prop'larını bilir.   | —                        | Molecule, Organism, Template |
| **Molecule** | 2-5 atom'un belirli bir amaca hizmet edecek şekilde bir araya gelmesi. | Atom                     | Organism, Template           |
| **Organism** | Bağımsız, ekranda yer alan karmaşık UI bloğu. Kendi hook'u olabilir.   | Atom, Molecule           | Template                     |
| **Template** | Ekran iskelet düzeni. İçerik placeholder'larla doldurulur.             | Atom, Molecule, Organism | —                            |

**Karar kuralı:** "Bu component'i başka bir projede kullanır mıyım?"

- Evet → `core/components/`'a yaz.
- Hayır → İlgili `domains/[x]/components/`'a yaz.

---

### 4. TypeScript Standartları

```typescript
// ✅ Doğru: Props tipi ayrı tanımlanır, React.FC kullanılmaz
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
};

export function Button({ label, onPress, variant = 'primary', isLoading = false }: ButtonProps) {
  ...
}

// ❌ Yanlış: React.FC, inline tip, any
const Button: React.FC<{ label: string; onPress: any }> = ({ label, onPress }) => ...
```

```typescript
// ✅ Doğru: Zod'dan tip türet
import { z } from 'zod'

export const ExpertSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  rating: z.number().min(0).max(5),
  isVerified: z.boolean(),
})

export type Expert = z.infer<typeof ExpertSchema>

// ❌ Yanlış: Manuel type tanımı (schema'dan bağımsız)
type Expert = {
  id: string
  name: string
  rating: number
  isVerified: boolean
}
```

**Kesin yasaklar:**

- `any` kullanımı → `unknown` kullan, gerekirse type guard yaz
- `as` casting → Zorunluysa `// REASON: ...` yorumuyla gerekçelendir
- Non-null assertion `!` → Optional chaining `?.` veya guard kullan
- Loose object tipler → Tüm alanlar explicit tanımlanır

---

### 5. Component Yazım Kalıbı

```typescript
// core/components/atoms/Button/Button.tsx

import { Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/core/components/atoms/Text'; // ← Absolute import

// 1. Props tipi en üstte
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string; // ← NativeWind için
};

// 2. Variant/style map — component dışında, render'da hesaplanmaz
const variantStyles = {
  primary:   'bg-sky-500 active:bg-sky-600',
  secondary: 'bg-sky-50 border border-sky-200 active:bg-sky-100',
  ghost:     'border border-neutral-200 active:bg-neutral-100',
} as const;

const sizeStyles = {
  sm: 'h-9 px-3.5',
  md: 'h-11 px-5',
  lg: 'h-13 px-6',
} as const;

// 3. Named export (barrel index.ts'ten re-export edilir)
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  className,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled || isLoading}
      className={`
        flex-row items-center justify-center rounded-xl
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? 'opacity-40' : ''}
        ${className ?? ''}
      `}
    >
      {isLoading
        ? <ActivityIndicator size="small" color={variant === 'primary' ? '#fff' : '#5C4FD6'} />
        : <Text variant="label" className={variant === 'primary' ? 'text-white' : 'text-sky-700'}>{label}</Text>
      }
    </Pressable>
  );
}

// 4. Props tipini dışa aktar (consumer'lar extend edebilsin)
export type { ButtonProps };
```

---

### 6. Hook Yazım Kalıbı

```typescript
// domains/offer/hooks/useOfferCountdown.ts

import { useState, useEffect, useCallback } from 'react'
import { OFFER_TIER_DURATION_MS } from '../offer.constants'

// 1. Dönüş tipi explicit tanımlanır
type UseOfferCountdownReturn = {
  remainingSeconds: number
  currentTier: number
  isExpired: boolean
  resetTimer: () => void
}

// 2. Hook parametreleri tek obje içinde (genişlemesi kolay)
type UseOfferCountdownParams = {
  offerId: string
  tierCount: number
  startedAt: Date
}

export function useOfferCountdown({
  offerId,
  tierCount,
  startedAt,
}: UseOfferCountdownParams): UseOfferCountdownReturn {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calculateRemaining(startedAt, OFFER_TIER_DURATION_MS)
  )

  // Yan etki hook'larında cleanup zorunludur
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval) // ← cleanup
  }, [])

  const resetTimer = useCallback(() => {
    setRemainingSeconds(OFFER_TIER_DURATION_MS / 1000)
  }, [])

  const currentTier = Math.floor(
    (OFFER_TIER_DURATION_MS / 1000 - remainingSeconds) / (OFFER_TIER_DURATION_MS / 1000 / tierCount)
  )

  return {
    remainingSeconds,
    currentTier: Math.min(currentTier, tierCount - 1),
    isExpired: remainingSeconds === 0,
    resetTimer,
  }
}
```

**TanStack Query hook kalıbı:**

```typescript
// domains/expert/api/useExpertProfileQuery.ts

import { useQuery } from '@tanstack/react-query'
import { ExpertSchema } from '../schemas/expert.schema'
import { expertKeys } from '../expert.constants'
import { getExpertProfile } from '@/lib/api'

export function useExpertProfileQuery(expertId: string) {
  return useQuery({
    queryKey: expertKeys.profile(expertId), // ← query key factory kullan
    queryFn: async () => {
      const data = await getExpertProfile(expertId)
      return ExpertSchema.parse(data) // ← Zod ile parse et, tip güvenli
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
    enabled: Boolean(expertId), // ← Guard: id yoksa çalışma
  })
}

// Query key factory — her domain kendi key factory'sini tanımlar
export const expertKeys = {
  all: ['experts'] as const,
  lists: () => [...expertKeys.all, 'list'] as const,
  profile: (id: string) => [...expertKeys.all, 'profile', id] as const,
} as const
```

---

### 7. State Management Kuralları

**Ne zaman ne kullanılır:**

```
API'den gelen veri          →  TanStack Query (useQuery / useMutation)
Global UI state             →  Zustand (auth bilgisi, tema, notification count)
Component'e özel UI state   →  useState (modal açık mı, input değeri)
Kalıcı local veri           →  MMKV (token, kullanıcı tercihleri)
Form state                  →  React Hook Form + Zod resolver
```

**Zustand slice kalıbı:**

```typescript
// domains/auth/store/authStore.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@/lib/storage' // MMKV storage

type AuthState = {
  userId: string | null
  role: 'expert' | 'client' | null
  isAuthenticated: boolean
}

type AuthActions = {
  setAuth: (userId: string, role: AuthState['role']) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      userId: null,
      role: null,
      isAuthenticated: false,
      setAuth: (userId, role) => set({ userId, role, isAuthenticated: true }),
      clearAuth: () => set({ userId: null, role: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage), // MMKV adapter
    }
  )
)
```

---

### 8. Styling Kuralları (NativeWind)

```typescript
// ✅ Doğru: className, design token'lardan — shadow KULLANILMAZ, border ile derinlik
<View className="bg-surface-base px-5 pt-4 rounded-xl border border-neutral-100">
  <Text className="text-2xl font-bold text-neutral-900 font-display">Başlık</Text>
</View>

// ✅ Doğru: Platform-specific prefix
<View className="ios:pt-safe android:pt-4">

// ✅ Doğru: Conditional (cn() utility ile)
import { cn } from '@/core/utils/cn';
<View className={cn('rounded-xl p-4', isActive && 'bg-sky-50 border border-sky-200')}>

// ❌ Yanlış: StyleSheet
const styles = StyleSheet.create({ container: { padding: 16 } });

// ❌ Yanlış: inline style
<View style={{ padding: 16, backgroundColor: '#F2F1FD' }}>

// ❌ Yanlış: arbitrary value (design token varsa)
<View className="bg-[#0EA5E9]">   // → bg-sky-500 kullan

// ❌ PSİKOAL KURALI — shadow sınıfı ASLA kullanılmaz (flat design)
<View className="shadow-sm">      // YASAK
<View className="shadow-md">      // YASAK
<View className="shadow-lg">      // YASAK
// ✅ Derinlik için border + arka plan rengi farkı kullan:
<View className="border border-neutral-100 bg-white">      // raised card
<View className="border border-sky-100 bg-sky-50">         // brand tinted surface
<View className="border-b border-neutral-100">             // subtle separator
```

**`cn()` utility (clsx + tailwind-merge):**

```typescript
// core/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### 9. Navigation Kuralları (Expo Router)

```
app/
  _layout.tsx               ← Root layout (providers burada)
  (auth)/
    _layout.tsx             ← Auth stack layout
    login.tsx               ← /login
    register.tsx            ← /register
    onboarding.tsx          ← /onboarding
  (tabs)/
    _layout.tsx             ← Tab bar layout
    index.tsx               ← / (Home)
    explore.tsx             ← /explore
    profile.tsx             ← /profile
  modal/
    [id].tsx                ← /modal/[id] (modal presentation)
  expert/
    [id].tsx                ← /expert/[id] (profile screen)
  offer/
    [id]/
      index.tsx             ← /offer/[id]
      confirm.tsx           ← /offer/[id]/confirm
```

**Typed navigation:**

```typescript
// ✅ Doğru: Expo Router hook'ları
import { useRouter, useLocalSearchParams } from 'expo-router'

function ExpertScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  router.push(`/offer/${id}`)
}

// ❌ Yanlış: React Navigation doğrudan (Expo Router varsa)
navigation.navigate('ExpertScreen', { id })
```

---

### 10. Test Kuralları

**Coverage hedefleri:**

- `core/components/atoms/` → %100 (bütün prop kombinasyonları)
- `core/hooks/` → %100
- `domains/*/hooks/` → %80 minimum
- `domains/*/utils/` → %100
- Organism/Screen → kritik flow'lar (smoke test yeterli)

**Test kalıbı:**

```typescript
// core/components/atoms/Button/Button.test.tsx

import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('label renders correctly', () => {
    const { getByText } = render(<Button label="Devam Et" onPress={jest.fn()} />);
    expect(getByText('Devam Et')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Devam Et" onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Devam Et" onPress={onPress} isDisabled />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

---

### 11. Import Düzeni

Her dosyada import'lar şu sırada olur (ESLint `import/order` ile zorlanır):

```typescript
// 1. React ve React Native core
import React, { useState, useCallback } from 'react'
import { View, Pressable } from 'react-native'

// 2. Expo paketleri
import * as Haptics from 'expo-haptics'

// 3. Üçüncü taraf kütüphaneler (alfabetik)
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 4. Core (absolute @ path)
import { Text, Icon } from '@/core/components/atoms'
import { useDebounce } from '@/core/hooks'
import { cn } from '@/core/utils/cn'

// 5. Diğer domain'lerden (sadece index.ts'den)
import { useAuthStore } from '@/domains/auth'

// 6. Aynı domain içinden (relative)
import { OfferSchema } from '../schemas/offer.schema'
import { useOfferCountdown } from '../hooks/useOfferCountdown'

// 7. Tipler (en sonda)
import type { Offer } from '../types/offer.types'
```

---

### 12. Sık Yapılan Hatalar (Anti-patterns)

```typescript
// ❌ Domain içinde başka domaine direkt import
import { Expert } from '../../expert/types/expert.types' // YASAK
// ✅ Barrel üzerinden
import type { Expert } from '@/domains/expert'

// ❌ useState ile server state
const [experts, setExperts] = useState([])
useEffect(() => {
  fetchExperts().then(setExperts)
}, []) // YASAK
// ✅ TanStack Query
const { data: experts } = useExpertListQuery()

// ❌ Component içinde iş mantığı
function ExpertCard({ expertId }) {
  const [price, setPrice] = useState(0)
  useEffect(() => {
    // fiyat hesaplama mantığı... YASAK
  }, [])
}
// ✅ Hook'a taşı
function ExpertCard({ expertId }) {
  const { price } = useExpertPrice(expertId) // temiz
}

// ❌ Atom'dan organism import
// core/components/atoms/Button/Button.tsx içinde:
import { ExpertCard } from '../organisms/ExpertCard' // YASAK

// ❌ Zod olmadan API parse
const expert = response.data as Expert // güvensiz, YASAK
// ✅
const expert = ExpertSchema.parse(response.data) // runtime güvenli

// ❌ Magic string domain key
queryClient.invalidateQueries(['experts']) // kırılgan, YASAK
// ✅ Query key factory
queryClient.invalidateQueries({ queryKey: expertKeys.all })
```

---

## PART 2 — PsikoAl

### 1. Proje Özeti

PsikoAl, psikologları (Uzman) ve terapi almak isteyen kullanıcıları (Danışan) bir araya getiren iki taraflı Türk pazar yeridir. Armut modelinin psikoloji sektörüne uyarlanmasıdır.

**Platform çalışma prensibi:**

- Faz 1: Psikolog danışanı platforma manuel ekler → sistem davet gönderir → eşleşme kurulur
- Faz 2: Danışan platforma doğrudan kayıt olur → psikolog havuzuna erişir

---

### 2. Tasarım Kısıtları (Değiştirilemez)

Bu kurallar tüm PsikoAl geliştirmelerinde kesinlikle uygulanır. Yeni component yazarken, PR review'da ve kod üretirken kontrol et.

**Renk — Sky Palette (Primary)**

Core'daki generic `brand-*` token'ları PsikoAl'da Sky paletine bağlıdır:

```
sky-50:  #F0F9FF    sky-400: #38BDF8
sky-100: #E0F2FE    sky-500: #0EA5E9  ← ana marka rengi
sky-200: #BAE6FD    sky-600: #0284C7
sky-300: #7DD3FC    sky-700: #0369A1
                    sky-800: #075985
```

Iris/violet token'ları (`iris-*`) bu projede yoktur. `bg-iris-*`, `text-iris-*`, `border-iris-*` sınıfları kullanılmaz.

**Tipografi — Plus Jakarta Sans**

Core'un `font-display` ve `font-body` değişkenlerinin ikisi de Plus Jakarta Sans'a bağlıdır:

```css
--font-display: 'PlusJakartaSans_800ExtraBold', sans-serif; /* heading/display */
--font-body: 'PlusJakartaSans_400Regular', sans-serif;
```

`Bricolage Grotesque` bu projede kullanılmaz. Tüm tipografi Plus Jakarta Sans üzerinden yönetilir. Expo Google Fonts paketinden `@expo-google-fonts/plus-jakarta-sans` kurulur.

**Gölge — Kesinlikle Yasak**

PsikoAl flat design prensibiyle çalışır. `shadow-*` sınıflarının hiçbiri kullanılmaz.

```typescript
// ❌ YASAK — shadow sınıfları
className="shadow-xs"
className="shadow-sm"
className="shadow-md"
className="shadow-lg"
className="shadow-xl"
style={{ shadowColor: '...', shadowOpacity: ... }}   // native shadow da yasak

// ❌ YASAK — sol accent border (kaldırıldı)
className="border-l-4 border-l-sky-500"

// ✅ iOS Health pattern — gri zemin + beyaz kart + pastel header strip
<View className="bg-white rounded-xl overflow-hidden">
  {/* Pastel header: status'a göre */}
  <View className="bg-sky-100 px-4 py-3">     {/* OPEN */}
  <View className="bg-emerald-100 px-4 py-3"> {/* MATCHED / ACTIVE / ACCEPTED */}
  <View className="bg-amber-100 px-4 py-3">   {/* PENDING */}
  <View className="bg-neutral-100 px-4 py-3"> {/* CLOSED / EXPIRED / geçmiş */}
```

**Elevation ve Derinlik — iOS Health Sistemi:**

`surface-base: #F2F2F7` (Apple iOS gray) — tüm ekran zeminleri bu token'ı kullanır.
Kart gövdesi `bg-white rounded-xl overflow-hidden` — zemin ile renk farkı yeterli derinlik sağlar.
Border eklemeye gerek yoktur.

```
// Kart anatomisi:
bg-[#F2F2F7] zemin
  └── bg-white rounded-xl overflow-hidden
        ├── [Pastel Header Strip] px-4 py-3  ← status rengi
        └── [Kart Gövdesi]        px-4 pt-3 pb-4
```

- Input: `bg-neutral-50 border border-neutral-200` (sunken)
- Overlay backdrop: `bg-black/40` (modal — izin verilir)

**Border Radius:**

- Kart / büyük container: `rounded-xl` (bu projede 24px)
- Buton (md/lg): `rounded-lg` (bu projede 16px)
- Badge / chip: `rounded-full`
- Input: `rounded-xl`

---

### 3. Domain Mimarisi

| Domain         | Sorumluluk                                   | Kritik Kurallar                            |
| -------------- | -------------------------------------------- | ------------------------------------------ |
| `auth`         | Kayıt, giriş, token yönetimi, rol belirleme  | JWT refresh, role-based guard              |
| `expert`       | Psikolog profili, lisans doğrulama, uzmanlık | Profil yayınlanmadan önce admin onayı şart |
| `client`       | Danışan profili, test geçmişi                | Platform'a doğrudan kayıt olur             |
| `listing`      | Danışan ilanları                             | OPEN→MATCHED→CLOSED/EXPIRED state machine  |
| `match`        | Eşleşme yönetimi                             | Yalnızca teklif kabulüyle oluşur           |
| `offer`        | Teklifler (ilan bazlı)                       | PENDING→ACCEPTED/REJECTED/WITHDRAWN        |
| `payment`      | Kontör, paket satışı, ödeme geçmişi          | Iyzico entegrasyonu                        |
| `assessment`   | Psikolojik test modülü                       | Ücretsiz, auth gerektirmez                 |
| `notification` | Push, in-app, SMS bildirimleri               | Event-driven, rate limited                 |

---

### 4. İş Kuralları (Değiştirilemez)

**İlan Kuralları:**

```
Durum makinesi: OPEN → MATCHED → (CLOSED | EXPIRED)

OPEN:    Danışan ilan açtı, tüm uzmanlar görebilir ve teklif gönderebilir.
MATCHED: Danışan bir teklifi kabul etti. Diğer PENDING teklifler otomatik REJECTED olur.
CLOSED:  Danışan ilanı manuel kapattı.
EXPIRED: 30 gün geçtikten sonra otomatik kapanır.

- Danışan aynı anda maksimum 3 OPEN ilan açabilir.
- MATCHED veya EXPIRED ilan yeniden açılamaz.
```

**Teklif Durum Makinesi:**

```
PENDING → ACCEPTED   (danışan kabul → match otomatik oluşur)
        → REJECTED   (danışan reddetti)
        → WITHDRAWN  (uzman geri çekti)

- Teklifler ilana gönderilir, danışana değil.
- Bir uzman aynı ilana sadece 1 teklif gönderebilir.
- Tek fiyat — kademe/dinamik fiyat sistemi yoktur.
- Uzman PENDING teklifini geri çekebilir (WITHDRAWN).
```

**Eşleşme Kuralları:**

```
Durum makinesi: ACTIVE → COMPLETED | RELEASED

- Eşleşme YALNIZCA teklif kabulüyle oluşur (otomatik).
- Eşleşme: danışan + uzman + ilan + kabul edilen teklif referansı içerir.
- RELEASED için her iki tarafın onayı gerekir (UX kuralı).
- Eşleşme backend kaynaklı — optimistic update yapılmaz.
```

**Paket Kuralları:**

```
Min seans: 3, Max seans: 20 (tek pakette)
Paket fiyatı <= (tekil seans fiyatı × seans sayısı) olmak zorunda (indirim şart)
Paket satın alındıktan itibaren 6 ay geçerli
Paket süresi dolunca kullanılmayan seanslar otomatik iptal edilir (refund trigger)
```

---

### 5. Screen & Navigation Haritası

**Tab Bar — Rol Bazlı (Armut Modeli)**

```
Uzman: Fırsatlar | Tekliflerim | Eşleşmelerim | Ayarlar
Danışan: Keşfet  | İlanlarım   | Bildirimler | Ayarlar
```

```
app/
  (auth)/
    login.tsx           → /login
    register.tsx        → /register (expert | client seçimi)
    onboarding/
      expert.tsx        → /onboarding/expert (profil tamamlama)
  (tabs)/
    index.tsx           → / — Expert: Fırsatlar (ilan feed + filtreler)
                              Client: Keşfet (popüler konular + uzmanlık alanı grid)
    offers.tsx          → /offers — Expert: Tekliflerim (gönderilen teklifler)
                                    Client: İlanlarım (Aktif/Geçmiş tab)
    matches.tsx         → /matches — Expert: Eşleşmelerim (Aktif/Geçmiş tab)
                                     Client: gizli (href: null)
    profile.tsx         → /profile — Ayarlar (rol bazlı menü)
  notifications.tsx     → /notifications — Bildirimler (tab dışı, header zil ikonundan erişilir)
  expert/
    [id].tsx            → /expert/[id] — uzman profil sayfası (public, okuma modu)
  client/
    [id].tsx            → /client/[id] — danışan profil (expert: okuma modu)
  listing/
    new.tsx             → /listing/new?spec=X — ilan oluştur (client, spec opsiyonel)
    [id].tsx            → /listing/[id] — ilan detay + gelen teklifler + Uzmanı İncele
  match/
    [id].tsx            → /match/[id] — eşleşme detay (expert only): danışan iletişim + ilan + teklif özeti
  offer/
    new.tsx             → /offer/new?listingId=X — teklif gönder (expert)
    [id].tsx            → /offer/[id] — teklif detay
  assessment/
    index.tsx           → /assessment — test başlangıç
    list.tsx            → /assessment/list — tüm testler + geçmiş sonuçlar
    result.tsx          → /assessment/result
  blog/
    index.tsx           → /blog — blog akışı
    [slug].tsx          → /blog/[slug] — blog detayı
  category/
    [slug].tsx          → /category/[slug] — kategori detayı (testler + blog + ilan CTA)
  payment/
    packages.tsx        → /payment/packages
    checkout.tsx        → /payment/checkout
```

**Not — kök `store/`:** `onboardingStore` ve `themeStore` domain'e ait olmayan global UI state'leridir; kök `src/store/` altında tutulur. Domain'e özgü store'lar (örn. `authStore`) kendi domain klasöründe kalır.

**Not — backend sözleşmesi:** Frontend hiçbir iş mantığı hesaplamaz; sayaçlar, filtre/sıralama, maskeleme, göreli tarih ve türetilmiş alanlar backend'den gelir. Sözleşme: `docs/BACKEND_REQUIREMENTS.md`. Production temizlik adımları: `docs/PRODUCTION_CHECKLIST.md`.

---

### 6. API Sözleşmesi (Genel Yapı)

```typescript
// Tüm API yanıtları bu envelope yapısında gelir
type ApiResponse<T> = {
  data: T
  meta?: {
    page: number
    total: number
    perPage: number
  }
}

type ApiError = {
  code: string // 'MATCH_ALREADY_PENDING', 'OFFER_EXPIRED' gibi domain error code
  message: string // kullanıcıya gösterilebilir mesaj (TR)
  field?: string // validation error için hangi alan
}

// Axios interceptor'da global error handling:
// 401 → token refresh veya logout
// 403 → role-based guard (expert vs client)
// 422 → Zod ile form error mapping
// 429 → rate limit — backoff + toast
```

---

### 7. PsikoAl Komponent Kataloğu

**Atoms (core/components/atoms/):**

- `Text` — variant prop ile tipografik skalayı karşılar
- `Button` — variant: primary | secondary | ghost | danger | accent
- `Input` — state: default | focused | error | success
- `Badge` — variant: sky | sage | warning | error | neutral
- `Avatar` — boyut, initials fallback
- `Icon` — Lucide icon wrapper
- `Skeleton` — shimmer loading state
- `Divider`
- `Chip` — tag/filter için (closeable opsiyonu)

**Molecules (core/components/molecules/):**

- `InputField` — Input + Label + Hint/Error mesajı
- `SearchBar` — Input + search icon + clear button
- `RatingRow` — yıldızlar + puan + yorum sayısı
- `StatCard` — değer + etiket (profil istatistikleri)
- `PriceDisplay` — fiyat + birim + indirim rozeti

**Organisms (domains/\*/components/ veya core/organisms/):**

- `ExpertProfileHero` — avatar + isim + ünvan + rating + doğrulama rozeti
- `ListingCard` — ilan başlığı, uzmanlık chip'leri, bütçe, teklif sayısı, durum badge
- `ListingDetail` — tam ilan içeriği, teklif gönder / ilanı kapat CTA
- `OfferCard` — fiyat, açıklama, uzman avatar, durum badge, aksiyon butonları
- `MatchBanner` — aktif eşleşme durumu (ACTIVE/COMPLETED/RELEASED)
- `AssessmentResultCard` — test sonucu + uzman önerisi CTA
- `PackagePicker` — paket seçim kartları

---

### 8. Geliştirici Notları (Önemli Edge Case'ler)

1. **Rol tabanlı tab bar:** `_layout.tsx`'de `role === 'expert'` kontrolü ile `matches` sekmesi expert'e gösterilir, client için `href: null` ile gizlenir.

2. **Teklif → Match otomasyonu:** Danışan bir teklifi kabul ettiğinde backend match'i otomatik oluşturur. `useAcceptOfferMutation` onSuccess'te `matchKeys.all` ve `listingKeys.detail(listingId)` invalidate eder. Optimistic update yapılmaz.

3. **Danışan adı gizliliği:** Listing kartlarında (uzman görünümünde) danışan adı tam gösterilmez. `formatClientName("Zeynep Yılmaz")` → `"Zeynep Y."` formatı. `domains/listing/utils/formatClientName.ts` helper'ı kullan.

4. **Danışan uzman araması YOKTUR:** Danışan "Keşfet" ekranında sadece kategori/konu seçer → bu seçim ilan oluşturma formunu açar. Uzman listesine doğrudan erişim yoktur. Danışan uzmanı pasif olarak görür: İlanlarım → İlan Detayı → Gelen Teklif → "Uzmanı İncele" → `/expert/[id]`.

5. **Assessment testi auth gerektirmez:** Bu route'lar `(auth)` grubunun dışında kalır. Test tamamlandıktan sonra email lead capture opsiyonel — zorlamaz.

6. **Ödeme akışı:** Iyzico 3D Secure, WebView içinde açılır. `expo-web-browser` değil `WebView` kullan (deep link callback için).

7. **Bildirim izni:** İlk login'de değil, ilk teklif geldiğinde sor. `expo-notifications` ile `PermissionStatus` kontrol et.

8. **Expert → client/[id] ekranı:** Uzman danışan profilini görüntüleyebilir (okuma modu). Bu ekranda "Teklif Gönder" butonu yoktur — uzman teklife ilan feed'inden (Fırsatlar) ulaşır.

9. **Teklif kabul onay uyarısı:** `OfferCard`'da danışan "Kabul Et" butonuna bastığında `Alert.alert` ile "İletişim bilgileriniz uzman ile paylaşılacaktır" uyarısı gösterilir. Onay durumunda `useAcceptOfferMutation` çalışır.

10. **Eşleşme detay sayfası (`/match/[id]`):** Expert-only. Eşleşme sonrası danışan adı **tam gösterilir** (gizleme yok), email ve telefon açık. `useMatchDetailQuery` → `GET /matches/:id` (embedded listing + offer döner).

11. **Eşleşmelerim → match detay:** Expert Eşleşmelerim sekmesinde eşleşmeye tıklamak `/match/[id]`'ye yönlendirir. "Eşleşmeyi Sonlandır" butonu bu tab ekranında yoktur.

12. **Tekliflerim — ACCEPTED teklif navigasyonu:** ACCEPTED teklif → `/match/[offer.matchId]`; PENDING/REJECTED/WITHDRAWN → `/offer/[id]`.

---

### 9. Senaryo: Yeni Özellik Eklerken Kontrol Listesi

Yeni bir özellik eklenirken sırayla şu soruları cevapla:

1. Bu hangi domain'e ait? (`match`, `offer`, `expert`...) → ilgili domain klasörüne git
2. Yeni bir Zod schema gerekiyor mu? → `domains/[x]/schemas/` klasörüne ekle
3. API çağrısı var mı? → TanStack Query hook yaz (`domains/[x]/api/`)
4. İş mantığı var mı? → Custom hook yaz (`domains/[x]/hooks/`)
5. UI var mı? → Component hangi atomic katmana ait? Core mu, domain-local mü?
6. Test yazdın mı? → Atom ise %100, hook ise %80
7. `index.ts` barrel güncelleneli mi? → Dışarıya açılacaksa evet

---

_Son güncelleme: Haziran 2026 — Tekin Labs (v3: Armut tab yapısı + rol bazlı UX)_
