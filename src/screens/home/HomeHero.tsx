import type { ReactNode } from 'react'

import { Image, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'
import { HeroPager } from '@/core/components/organisms/HeroPager'

const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

export type HomeHeroProps = {
  firstName?: string
  subtitle: string
  pages: ReactNode[]
  textRightInset: number
}

export function HomeHero({ firstName, subtitle, pages, textRightInset }: HomeHeroProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="overflow-hidden rounded-b-2xl bg-sky-500 px-5 pb-6 dark:bg-sky-950"
      style={{ paddingTop: insets.top + 8 }}
    >
      <DecorCircles />

      <View style={{ paddingRight: textRightInset }}>
        <View className="self-start rounded-xl bg-white px-3 py-1.5">
          <Image
            source={LOGO_PLACEHOLDER}
            className="h-[34px] w-[146px]"
            resizeMode="contain"
            accessibilityLabel="PsikoAl"
          />
        </View>
        <Text variant="subheading" className="mt-3 font-bold text-white">
          Merhaba{firstName ? `, ${firstName}` : ''}!
        </Text>
        <Text variant="caption" className="mt-0.5 text-sky-100">
          {subtitle}
        </Text>
      </View>

      <HeroPager pages={pages} />
    </View>
  )
}
