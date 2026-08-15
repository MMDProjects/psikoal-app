import { useState } from 'react'
import type { ComponentType } from 'react'

import { Pressable, View } from 'react-native'

import { Star } from 'lucide-react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import type { SvgProps } from 'react-native-svg'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

type IconProps = Pick<SvgProps, 'stroke' | 'fill'> & { size?: number }
const StarIcon = Star as ComponentType<IconProps>

export type RatingRowProps = {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md' | 'lg'
  showEmpty?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

type StarType = 'full' | 'half' | 'empty'

const STAR_COUNT = 5
const FILLED_COLOR = '#0EA5E9' // sky-500 — PsikoAL brand color
const EMPTY_COLOR = '#D4D4D4'
const STROKE_COLOR = '#0EA5E9' // sky-500

const sizeConfig = {
  sm: { star: 14, gap: 'gap-0.5', text: 'caption' as const },
  md: { star: 18, gap: 'gap-1', text: 'label' as const },
  lg: { star: 22, gap: 'gap-1.5', text: 'body' as const },
}

const SPRING = { mass: 0.3, stiffness: 500, damping: 15 }

function getStarTypes(rating: number): StarType[] {
  const clamped = Math.max(0, Math.min(STAR_COUNT, rating))
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const diff = clamped - i
    if (diff >= 1) return 'full'
    if (diff >= 0.5) return 'half'
    return 'empty'
  })
}

type StarItemProps = {
  type: StarType
  size: number
  interactive: boolean
  onPress?: () => void
  accessibilityLabel?: string
}

function StarItem({ type, size, interactive, onPress, accessibilityLabel }: StarItemProps) {
  const scale = useSharedValue(1)
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePress = () => {
    scale.value = withSpring(1.3, SPRING, () => {
      scale.value = withSpring(1, SPRING)
    })
    onPress?.()
  }

  const star = (
    <View style={{ width: size, height: size }}>
      {type === 'half' ? (
        <>
          <StarIcon size={size} stroke={STROKE_COLOR} fill={EMPTY_COLOR} />
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: size / 2,
              height: size,
              overflow: 'hidden',
            }}
          >
            <StarIcon size={size} stroke={STROKE_COLOR} fill={FILLED_COLOR} />
          </View>
        </>
      ) : (
        <StarIcon
          size={size}
          stroke={STROKE_COLOR}
          fill={type === 'full' ? FILLED_COLOR : EMPTY_COLOR}
        />
      )}
    </View>
  )

  if (!interactive) return star

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {star}
      </Pressable>
    </Animated.View>
  )
}

export function RatingRow({
  rating,
  reviewCount,
  size = 'md',
  showEmpty = true,
  interactive = false,
  onRatingChange,
  className,
}: RatingRowProps) {
  const [localRating, setLocalRating] = useState(rating)
  const displayRating = interactive ? localRating : rating
  const { star: starSize, gap, text: textVariant } = sizeConfig[size]
  const starTypes = getStarTypes(displayRating)

  return (
    <View className={cn('flex-row items-center', className)}>
      <View className={cn('flex-row items-center', gap)}>
        {starTypes.map((type, i) => {
          if (!showEmpty && type === 'empty') return null
          return (
            <StarItem
              key={i}
              type={type}
              size={starSize}
              interactive={interactive}
              accessibilityLabel={interactive ? `Rate ${i + 1} out of 5` : undefined}
              onPress={
                interactive
                  ? () => {
                      const newRating = i + 1
                      setLocalRating(newRating)
                      onRatingChange?.(newRating)
                    }
                  : undefined
              }
            />
          )
        })}
      </View>

      {reviewCount !== undefined && (
        <Text variant={textVariant} color="secondary" className="ml-1.5">
          ({reviewCount.toLocaleString('tr-TR')})
        </Text>
      )}
    </View>
  )
}

export type { RatingRowProps as default }
