## Özet

<!-- Ne değişti, tek paragraf. -->

## User Story / İş Kodu

<!-- Örn. OFFER-12 — Uzman gönderdiği teklifi geri çekebilmeli. -->

## Değişiklik Tipi

- [ ] feat — yeni özellik
- [ ] fix — hata düzeltmesi
- [ ] refactor / style — davranış değişmiyor
- [ ] infra / ci
- [ ] docs

## Ekran Görüntüsü (UI değişikliğinde ZORUNLU)

| Önce | Sonra |
| ---- | ----- |
|      |       |

> UI'a dokunan bir PR'da bu tablo boşsa PR merge edilmez. CLAUDE.md tasarım kısıtları
> (shadow yasağı, Sky paleti, `rounded-xl`, iOS Health kart anatomisi) makinece tam
> denetlenemez; görsel diff insan kapısıdır.

## Test Edildi mi?

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run format:check`
- [ ] `npm run test:ci`
- [ ] Cihaz/emülatörde manuel doğrulandı

## Kontrol Listesi

- [ ] Component'te iş mantığı yok (hook/service katmanına taşındı)
- [ ] Atomic hiyerarşi bozulmadı (atom → molecule → organism → template)
- [ ] Domain'ler arası import yalnız `index.ts` barrel'ı üzerinden
- [ ] API yanıtı Zod ile parse ediliyor (`as` casting yok)
- [ ] `shadow-*`, `iris-*`, `StyleSheet.create`, inline `style={}` kullanılmadı
- [ ] Yeni atom/util için test yazıldı
- [ ] Backend sözleşmesi değiştiyse `psikoal-backend` tarafında karşılığı açıldı

## Ek Notlar

<!-- Bilinen sınırlar, sonraya bırakılanlar, riskler. -->
