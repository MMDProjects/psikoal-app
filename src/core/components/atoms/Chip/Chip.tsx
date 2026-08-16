import type { ComponentType } from 'react'

import { Pressable, View } from 'react-native'

import { X } from 'lucide-react-native'

import type { SvgProps } from 'react-native-svg'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

type IconProps = Pick<SvgProps, 'stroke'> & { size?: number }
const XIcon = X as ComponentType<IconProps>

export type ChipVariant = 'filter' | 'input' | 'tag' | 'session' | 'price' | 'onBrand'
export type ChipSize = 'sm' | 'md'

export type ChipProps = {
  label: string
  isSelected?: boolean
  onPress?: () => void
  onRemove?: () => void
  isDisabled?: boolean
  variant?: ChipVariant
  size?: ChipSize
  className?: string
}

const variantStyles: Record<ChipVariant, { base: string; selectedSm: string; selectedMd: string }> =
  {
    filter: {
      base: 'bg-neutral-200 dark:bg-neutral-800',
      selectedSm: 'bg-brand-muted/60 dark:bg-brand/20',
      selectedMd: 'bg-brand-muted/60 dark:bg-brand/20',
    },
    input: {
      base: 'bg-brand-muted/60 dark:bg-brand/20',
      selectedSm: 'bg-brand-muted/60 dark:bg-brand/20',
      selectedMd: 'bg-brand-muted/60 dark:bg-brand/20',
    },
    tag: {
      base: 'bg-neutral-200 dark:bg-neutral-800',
      selectedSm: 'bg-tag-muted/60 dark:bg-tag/20',
      selectedMd: 'bg-tag-muted/60 dark:bg-tag/20',
    },
    session: {
      base: 'bg-neutral-200 dark:bg-neutral-800',
      selectedSm: 'bg-session-muted/60 dark:bg-session/20',
      selectedMd: 'bg-session-muted/60 dark:bg-session/20',
    },
    price: {
      base: 'bg-neutral-200 dark:bg-neutral-800',
      selectedSm:
        'bg-price-muted/60 border border-price-muted dark:bg-price/20 dark:border-price/30',
      selectedMd:
        'bg-price-muted/60 border border-price-muted dark:bg-price/20 dark:border-price/30',
    },
    onBrand: {
      base: 'bg-sky-600 dark:bg-sky-900',
      selectedSm: 'bg-white dark:bg-white',
      selectedMd: 'bg-white dark:bg-white',
    },
  }

const selectedTextMap: Record<ChipVariant, string> = {
  filter: 'text-brand-text dark:text-brand-border',
  input: 'text-brand-text dark:text-brand-border',
  tag: 'text-tag-text dark:text-tag-border',
  session: 'text-session-text dark:text-session-border',
  price: 'text-price-text dark:text-price-border',
  onBrand: 'text-sky-700 dark:text-sky-700',
}

const sizeStyles: Record<
  ChipSize,
  { container: string; textVariant: 'caption' | 'label'; xSize: number }
> = {
  sm: { container: 'px-3 py-1.5 gap-1.5', textVariant: 'caption', xSize: 12 },
  md: { container: 'px-4 py-2 gap-2', textVariant: 'label', xSize: 14 },
}

export function Chip({
  label,
  isSelected = false,
  onPress,
  onRemove,
  isDisabled = false,
  variant = 'filter',
  size = 'sm',
  className,
}: ChipProps) {
  const isFilter = variant === 'filter'
  const isInput = variant === 'input'

  const { base, selectedSm, selectedMd } = variantStyles[variant]
  const { container, textVariant, xSize } = sizeStyles[size]
  const bgClass = !isSelected ? base : size === 'md' ? selectedMd : selectedSm

  const containerStyle = cn(
    'flex-row items-center self-start rounded-full',
    container,
    bgClass,
    isDisabled && 'opacity-40',
    className
  )

  const textClass = isSelected
    ? `${selectedTextMap[variant]} font-medium`
    : variant === 'onBrand'
      ? 'text-white font-medium'
      : 'text-neutral-700 dark:text-neutral-400 font-medium'
  const xStroke = '#0369A1' // sky-700 (filter X butonu için)

  const content = (
    <>
      <Text variant={textVariant} className={textClass}>
        {label}
      </Text>
      {((isFilter && isSelected && size === 'md') || isInput) && onRemove && (
        <Pressable
          onPress={isDisabled ? undefined : onRemove}
          accessibilityLabel={`Remove ${label}`}
          accessibilityRole="button"
          disabled={isDisabled}
          hitSlop={8}
        >
          <XIcon size={xSize} stroke={xStroke} />
        </Pressable>
      )}
    </>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
        disabled={isDisabled}
        className={containerStyle}
      >
        {content}
      </Pressable>
    )
  }

  return (
    <View className={containerStyle} accessibilityRole="none">
      {content}
    </View>
  )
}
