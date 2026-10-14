import * as Application from 'expo-application'
import Constants from 'expo-constants'

// Kullanıcıya gösterilen sürüm, kurulu paketin GERÇEK sürümüdür (mağaza
// derlemesinde native sürüm). Elle tutulan bir ortam değişkeni sürümle
// senkron kalmayabiliyordu. Expo Go / web'de native sürüm yoksa app.json'daki
// `version` kullanılır.
export const APP_VERSION: string =
  Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '—'
