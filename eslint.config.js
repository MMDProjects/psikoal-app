const path = require('path')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
// eslint-plugin-import ESLint 10 ile uyumsuz (getTokenOrCommentAfter kaldırıldı);
// bakımlı fork olan import-x kullanılıyor.
const importPlugin = require('eslint-plugin-import-x')
const reactHooks = require('eslint-plugin-react-hooks')
// eslint-plugin-tailwindcss ESLint 10 ile uyumsuz (context.getSourceCode kaldırıldı);
// better-tailwindcss hem ESLint 10'u hem Tailwind 3.3+'ı destekliyor.
const betterTailwind = require('eslint-plugin-better-tailwindcss')

// ESLint 10 flat config — TEK kaynak. `.eslintrc.js` ESLint 10 altında hiç okunmuyordu,
// bu yüzden oradaki kurallar (import/order, consistent-type-imports, tailwindcss) buraya
// taşındı ve eski dosya silindi (bkz. docs/DEVOPS-PSIKOAL.md, Faz 2 / adım 12).
module.exports = [
  {
    ignores: ['coverage/**', 'node_modules/**', 'mock-db/**', '.expo/**', 'dist/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'import-x': importPlugin,
      'better-tailwindcss': betterTailwind,
    },
    settings: {
      'better-tailwindcss': {
        tailwindConfig: path.join(__dirname, 'tailwind.config.js'),
        callees: ['cn', 'clsx', 'twMerge'],
        attributes: ['className'],
      },
      'import-x/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // CLAUDE.md bölüm 11 — import düzeni
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-native', group: 'external', position: 'before' },
            { pattern: 'expo*', group: 'external', position: 'after' },
            { pattern: '@/*', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-native'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Sınıf sırası: uyarı seviyesinde — mevcut kod tabanını topluca yeniden yazmadan
      // yeni kodu hizalar. `lint --max-warnings 0` bunu CI'da yine de kapı yapar,
      // bu yüzden sıra ihlalleri --fix ile temizlenir.
      'better-tailwindcss/enforce-consistent-class-order': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unknown-classes': 'off',
    },
  },
  // Test dosyaları: expect() guard'larından ve getBy* sorgularından sonra non-null assertion
  // deyimseldir; burada zorlamak güvenlik kazancı olmadan gürültü üretir.
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]
