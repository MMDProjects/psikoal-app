# Sözleşmeler — Link Stub

Dal modeli, terfi kuralları, commit ve PR sözleşmesi **tek bir kanonik yerde** yaşar:

- Dal modeli ve terfi: `psikoal-backend/docs/conventions/branching.md`
- Commit ve PR: `psikoal-backend/docs/conventions/commits.md`

Bu dosya bilerek içerik taşımaz. İkizlenen doküman senkron kaybeder; kural değişikliği
yalnız `psikoal-backend/docs/conventions/` altında yapılır.

Bu repoya özgü tek ek: **UI değişikliği içeren her PR'da önce/sonra ekran görüntüsü
zorunludur.** CLAUDE.md'deki tasarım kısıtları (shadow yasağı, Sky paleti, rounded-xl)
tamamen makinece denetlenemez — görsel diff insan kapısıdır.
