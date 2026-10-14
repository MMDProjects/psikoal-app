/// <reference types="nativewind/types" />

// global.css yan etkili import edilir. Tanım normalde expo-env.d.ts (gitignore) üzerinden
// gelir; CI'daki temiz checkout'ta o dosya olmadığı için TS 6 burada açıkça istiyor.
declare module '*.css'
