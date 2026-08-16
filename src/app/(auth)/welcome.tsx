import { useState } from 'react'

import { Image, Pressable, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import type { IconName } from '@/core/components/atoms/Icon'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import { useOnboardingStore } from '@/store/onboardingStore'

const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

type WelcomeSlide = {
  icon: IconName
  title: string
  body: string
}

const FIRST_SLIDE: WelcomeSlide = {
  icon: 'HeartHandshake',
  title: 'Doğru psikoloğu bulmanın en kolay yolu',
  body: 'İhtiyacını anlatan bir ilan oluştur; alanında uzman psikologlar sana teklifleriyle gelsin. Sen sadece en uygun olanı seç.',
}

const SLIDES: WelcomeSlide[] = [
  FIRST_SLIDE,
  {
    icon: 'ClipboardList',
    title: 'Önce kendini keşfet',
    body: 'Ücretsiz psikolojik testlerle nasıl hissettiğini anla. Kayıt gerekmez, sonuçlarını dilersen ilanına ekleyebilirsin.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Güvenle eşleş',
    body: 'Tüm uzmanların lisansları doğrulanır. İletişim bilgilerin yalnızca senin onayladığın eşleşmelerde paylaşılır.',
  },
]

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const setSeenWelcome = useOnboardingStore((s) => s.setSeenWelcome)

  const [slide, setSlide] = useState(0)
  const isLast = slide === SLIDES.length - 1
  const current = SLIDES[slide] ?? FIRST_SLIDE

  const finish = (target: '/(auth)/register' | '/(auth)/login') => {
    setSeenWelcome()
    router.replace(target)
  }

  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles phase={slide} />

      <Pressable
        onPress={() => finish('/(auth)/login')}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Karşılamayı atla"
        style={{ position: 'absolute', top: insets.top + 8, right: 16, zIndex: 10 }}
        className="h-10 items-center justify-center rounded-full bg-sky-600 px-4 active:bg-sky-700 dark:bg-sky-900 dark:active:bg-sky-800"
      >
        <Text variant="caption" className="font-semibold text-white">
          Atla
        </Text>
      </Pressable>

      <View className="items-center" style={{ paddingTop: insets.top + 12 }}>
        <View className="rounded-xl bg-white px-3 py-1.5">
          <Image
            source={LOGO_PLACEHOLDER}
            style={{ width: 146, height: 34 }}
            resizeMode="contain"
            accessibilityLabel="PsikoAl"
          />
        </View>
      </View>

      <View className="flex-1 justify-center gap-6 px-8" style={{ paddingBottom: bottomBarHeight }}>
        <View className="items-center gap-6">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
            <Icon name={current.icon} size={44} color="#0EA5E9" />
          </View>
          <View className="items-center gap-3">
            <Text
              variant="heading"
              className="text-center leading-tight text-white"
              numberOfLines={2}
              style={{ minHeight: 76 }}
            >
              {current.title}
            </Text>
            <Text
              variant="body"
              className="text-center leading-relaxed text-sky-100"
              numberOfLines={4}
              style={{ minHeight: 96 }}
            >
              {current.body}
            </Text>
          </View>
        </View>

        <View className="mt-2 flex-row justify-center gap-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={cn(
                'h-2 rounded-full',
                i === slide ? 'w-6 bg-white' : 'w-2 bg-sky-600 dark:bg-sky-900'
              )}
            />
          ))}
        </View>
      </View>

      <BottomActionBar
        actions={
          isLast
            ? [
                {
                  label: 'Giriş Yap',
                  onPress: () => finish('/(auth)/login'),
                  variant: 'inverseGhost',
                },
                {
                  label: 'Hemen Başla',
                  onPress: () => finish('/(auth)/register'),
                  variant: 'inverse',
                },
              ]
            : [{ label: 'Devam', onPress: () => setSlide((s) => s + 1), variant: 'inverse' }]
        }
      />
    </View>
  )
}
