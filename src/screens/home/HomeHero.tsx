import type { ReactNode } from 'react'

import { View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BrandMark } from '@/core/components/atoms/BrandMark'
import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'

export type HomeHeroProps = {
  firstName?: string
  subtitle: string
  children: ReactNode
  textRightInset: number
}

export function HomeHero({ firstName, subtitle, children, textRightInset }: HomeHeroProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="overflow-hidden rounded-b-2xl bg-sky-500 px-5 pb-6 dark:bg-sky-950"
      style={{ paddingTop: insets.top + 8 }}
    >
      <DecorCircles />

      <View style={{ paddingRight: textRightInset }}>
        <BrandMark size="sm" className="self-start" />
        <Text variant="subheading" className="mt-3 font-bold text-white">
          Merhaba{firstName ? `, ${firstName}` : ''}!
        </Text>
        <Text variant="caption" className="mt-0.5 text-sky-100">
          {subtitle}
        </Text>
      </View>

      <View className="mt-4">{children}</View>
    </View>
  )
}
