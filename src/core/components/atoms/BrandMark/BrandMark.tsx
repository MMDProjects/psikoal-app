import { View } from 'react-native'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

// Uygulamanın TEK marka işareti. Gerçek logo geldiğinde yalnız bu dosya
// değişir (ör. metin yerine <Image>); giriş, karşılama ve ana sayfa hero'su
// bu bileşeni kullanır.
export const BRAND_NAME = 'PsikoAl'

export type BrandMarkSize = 'sm' | 'md'

export type BrandMarkProps = {
  size?: BrandMarkSize
  className?: string
}

const containerStyles: Record<BrandMarkSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
}

const textStyles: Record<BrandMarkSize, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
}

export function BrandMark({ size = 'md', className }: BrandMarkProps) {
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={BRAND_NAME}
      className={cn('self-center rounded-xl bg-white', containerStyles[size], className)}
    >
      <Text
        className={cn('font-display font-extrabold tracking-tight text-sky-500', textStyles[size])}
      >
        {BRAND_NAME}
      </Text>
    </View>
  )
}
