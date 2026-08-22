# testID Sözleşmesi — Mobil E2E

Maestro akışları ekrandaki öğelere `testID` ile bağlanır. `testID` React Native'de
Android'de `resource-id`, iOS'ta `accessibilityIdentifier` olarak dışa vurulur;
Maestro her iki platformda da `id:` seçicisiyle bunu okur.

E2E akışlarının kendisi **`psikoal-backend/e2e/mobile/`** altındadır (bkz.
`psikoal-backend/docs/E2E.md`). Bu dosya yalnız uygulama tarafındaki işaretleme
kuralını tanımlar.

## Neden metinle değil `testID` ile bağlanıyoruz

Maestro `assertVisible: "Keşfet"` gibi metin eşleşmesini de destekler, ama:

- Kopya metinler ürün kararıyla sık değişir; testler ürün metnine kilitlenmemeli.
- Aynı metin birden çok yerde geçebilir (`"Devam Et"` üç ayrı ekranda var).
- Rol bazlı ekranlar aynı konumda farklı metin gösteriyor
  (`(tabs)/_layout.tsx`: uzman "Fırsatlar", danışan "Keşfet").

`testID` bunların hiçbirinden etkilenmez ve niyeti açıkça belgeler.

## Adlandırma

| Kalıp                       | Nerede                   | Örnek                                |
| --------------------------- | ------------------------ | ------------------------------------ |
| `screen-<ekran>`            | Her ekranın kök `View`'ı | `screen-login`, `screen-home-client` |
| `<domain>-list`             | Liste kapsayıcısı        | `category-list`                      |
| `<domain>-item-<stabilKey>` | Liste elemanı            | `category-item-anksiyete`            |
| `<ekran>-<alan>`            | Form alanı               | `login-email`, `login-password`      |
| `<ekran>-submit`            | Ekranın birincil eylemi  | `login-submit`                       |

Kurallar:

- **Stabil anahtar kullan.** Liste elemanında `slug` gibi iş anlamı taşıyan ve
  değişmeyen bir alan seçilir. `id` (uuid) KULLANILMAZ: her ortamda farklıdır,
  akış dosyasına yazılamaz. Kategori için `slug` doğru anahtardır — admin panelde
  de kullanıcı tarafından girilir, yani test verisiyle akış dosyası aynı değeri
  paylaşabilir.
- **Sırayla değil kimlikle bağlan.** `category-item-0` gibi indeks tabanlı bir id,
  sıralama değiştiğinde sessizce başka bir satırı test etmeye başlar.
- **Küçük harf + tire.** `screen-home-client`, `screenHomeClient` değil.
- **Yalnız test için ekleme yapılmaz.** `testID` görünür davranışı değiştirmez;
  ancak bir öğeye erişmek için ekranı yeniden yapılandırmak gerekiyorsa bu bir
  erişilebilirlik sorunudur, önce o düzeltilir.

## Bileşenlere ekleme

Atomlar `testID`'i alta geçirir; ekran kodu ekstra sarmalayıcı `View` eklemez:

| Bileşen                | Nereye iletilir                         |
| ---------------------- | --------------------------------------- |
| `Input` / `InputField` | alttaki `TextInput`                     |
| `Button`               | alttaki `Pressable`                     |
| `BottomActionBar`      | `actions[].testID` → ilgili `Pressable` |

Yeni bir atom yazarken `testID?: string` prop'unu ekleyip alttaki RN primitifine
iletmek, `className` gibi standart prop setinin parçasıdır.

## Bugün işaretli olanlar

- `src/app/(auth)/login.tsx` — `screen-login`, `login-email`, `login-password`, `login-submit`
- `src/screens/home/ClientHomeScreen.tsx` — `screen-home-client`, `category-list`, `category-item-<slug>`

Kalan ekranlar akış yazıldıkça işaretlenir; **akıştan önce toplu işaretleme
yapılmaz** — kullanılmayan `testID` bakımsız kalır ve yanlış güven verir.
