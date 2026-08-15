// Conventional Commits — backend reposu zaten bu düzeni kullanıyor, burada da zorunlu.
// Konu satırı Türkçe yazılabilir; tür (type) İngilizce ve küçük harf kalır.
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'hotfix', 'chore', 'infra', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert'],
    ],
    // Türkçe konu satırı büyük harfle başlayabilir; sadece boş/nokta ile biten yasak.
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
}
