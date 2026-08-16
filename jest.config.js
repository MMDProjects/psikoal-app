module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)',
  ],
  moduleNameMapper: {
    '^react-native-reanimated$': '<rootDir>/src/__mocks__/react-native-reanimated.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Eşikler ÖLÇÜLEN değerlerin hemen altına konur: bugünkü seviyeyi kilitler,
  // erozyona izin vermez. Yeni test yazıldıkça bu sayılar yukarı çekilir.
  // Ölçüm tarihi: 2026-08-16 — bkz. docs/DEVOPS-PSIKOAL.md, Faz 2 / adım 15.
  coverageThreshold: {
    // DİKKAT: yol bazlı grup tanımlanan dosyalar `global`den DÜŞÜLÜR.
    // Bu yüzden global, aşağıdaki gruplara girmeyen kalan dosyaları (domains, screens,
    // store, lib) ölçer — bugünkü gerçek değeri %5 civarı. Toplam coverage %24.8.
    global: {
      statements: 5,
      lines: 5,
      functions: 2,
      branches: 4,
    },
    // %100 hedefli alanlar (CLAUDE.md bölüm 10)
    './src/core/utils/': {
      statements: 100,
      lines: 100,
      functions: 100,
      branches: 100,
    },
    './src/core/hooks/': {
      statements: 100,
      lines: 100,
      functions: 100,
    },
    './src/core/components/atoms/': {
      statements: 97,
      lines: 99,
      functions: 94,
      branches: 89,
    },
    './src/core/components/molecules/': {
      statements: 64,
      lines: 61,
      functions: 43,
      branches: 43,
    },
  },
  coverageReporters: ['text-summary', 'json-summary', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**',
  ],
}
