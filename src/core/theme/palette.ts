import { useColorScheme } from 'nativewind'

const light = {
  brand: '#0EA5E9',
  brandHover: '#0284C7',
  brandSubtle: '#F0F9FF',
  brandMuted: '#BAE6FD',
  brandBorder: '#7DD3FC',
  brandText: '#0369A1',

  accent: '#0284C7',
  accentHover: '#0369A1',
  accentSubtle: '#E0F2FE',
  accentMuted: '#BAE6FD',
  accentBorder: '#38BDF8',
  accentText: '#075985',

  surfaceBase: '#F2F2F7',
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#E8E8ED',

  contentPrimary: '#171717',
  contentSecondary: '#404040',
  contentTertiary: '#737373',
  contentDisabled: '#A3A3A3',
  contentInverse: '#FFFFFF',
  contentLink: '#0EA5E9',

  border: '#E5E5E5',
  borderMuted: '#F5F5F5',
  borderStrong: '#A3A3A3',

  successLight: '#DCFCE7',
  success: '#16A34A',
  successDark: '#14532D',

  warningLight: '#FEF9C3',
  warning: '#CA8A04',
  warningDark: '#713F12',

  errorLight: '#FEE2E2',
  error: '#DC2626',
  errorDark: '#7F1D1D',

  infoLight: '#DBEAFE',
  info: '#2563EB',
  infoDark: '#1E3A8A',

  tagSubtle: '#ECFDF5',
  tagMuted: '#A7F3D0',
  tagBorder: '#6EE7B7',
  tagText: '#047857',

  sessionSubtle: '#FFFBEB',
  sessionMuted: '#FDE68A',
  sessionBorder: '#FCD34D',
  sessionText: '#B45309',
}

const dark: typeof light = {
  brand: '#38BDF8',
  brandHover: '#7DD3FC',
  brandSubtle: '#075985',
  brandMuted: '#0369A1',
  brandBorder: '#0284C7',
  brandText: '#E0F2FE',

  accent: '#7DD3FC',
  accentHover: '#BAE6FD',
  accentSubtle: '#0C4A6E',
  accentMuted: '#075985',
  accentBorder: '#0EA5E9',
  accentText: '#F0F9FF',

  surfaceBase: '#171717',
  surfaceRaised: '#262626',
  surfaceSunken: '#0A0A0A',

  contentPrimary: '#FAFAFA',
  contentSecondary: '#D4D4D4',
  contentTertiary: '#A3A3A3',
  contentDisabled: '#525252',
  contentInverse: '#171717',
  contentLink: '#38BDF8',

  border: '#404040',
  borderMuted: '#262626',
  borderStrong: '#737373',

  successLight: '#14532D',
  success: '#22C55E',
  successDark: '#DCFCE7',

  warningLight: '#713F12',
  warning: '#EAB308',
  warningDark: '#FEF9C3',

  errorLight: '#7F1D1D',
  error: '#EF4444',
  errorDark: '#FEE2E2',

  infoLight: '#1E3A8A',
  info: '#3B82F6',
  infoDark: '#DBEAFE',

  tagSubtle: '#022C22',
  tagMuted: '#065F46',
  tagBorder: '#059669',
  tagText: '#A7F3D0',

  sessionSubtle: '#2E1065',
  sessionMuted: '#4C1D95',
  sessionBorder: '#7C3AED',
  sessionText: '#DDD6FE',
}

export const themeColors = { light, dark } as const

export type ThemeColors = typeof light

export function useThemeColors(): ThemeColors {
  const { colorScheme } = useColorScheme()
  return colorScheme === 'dark' ? themeColors.dark : themeColors.light
}
