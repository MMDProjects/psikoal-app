import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useWindowDimensions, View } from 'react-native'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type HeroPagerProps = {
  pages: ReactNode[]
  autoAdvanceMs?: number
}

const SLIDE_TIMING = { duration: 320, easing: Easing.out(Easing.cubic) }

export function HeroPager({ pages, autoAdvanceMs = 5000 }: HeroPagerProps) {
  const { width: W } = useWindowDimensions()
  const [page, setPage] = useState(0)

  const offset = useSharedValue(0) // translateX (0, -W, -2W, ...)
  const dragStart = useSharedValue(0)

  useEffect(() => {
    if (page >= pages.length - 1) return
    const timer = setTimeout(() => {
      const next = page + 1
      offset.value = withTiming(-next * W, SLIDE_TIMING)
      setPage(next)
    }, autoAdvanceMs)
    return () => clearTimeout(timer)
  }, [page, pages.length, autoAdvanceMs, W, offset])

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-12, 12])
    .onStart(() => {
      dragStart.value = offset.value
    })
    .onUpdate((e) => {
      const min = -(pages.length - 1) * W
      let next = dragStart.value + e.translationX
      if (next > 0) next = next / 3
      else if (next < min) next = min + (next - min) / 3
      offset.value = next
    })
    .onEnd((e) => {
      const raw = -offset.value / W
      let target = Math.round(raw)
      if (e.velocityX < -500) target = Math.ceil(raw)
      else if (e.velocityX > 500) target = Math.floor(raw)
      target = Math.max(0, Math.min(pages.length - 1, target))
      offset.value = withTiming(-target * W, SLIDE_TIMING)
      runOnJS(setPage)(target)
    })

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  return (
    <>
      <GestureDetector gesture={pan}>
        <View style={{ marginTop: 16, marginHorizontal: -20, overflow: 'hidden' }}>
          <Animated.View style={[{ flexDirection: 'row', width: W * pages.length }, rowStyle]}>
            {pages.map((content, i) => (
              <View key={i} style={{ width: W, paddingHorizontal: 20 }}>
                {content}
              </View>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      <View className="mt-3 flex-row justify-center gap-1.5">
        {pages.map((_, i) => (
          <View
            key={i}
            style={{
              width: page === i ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: page === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </View>
    </>
  )
}
