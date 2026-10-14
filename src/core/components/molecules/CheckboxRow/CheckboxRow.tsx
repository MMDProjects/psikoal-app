import type { ReactNode } from 'react'

import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type CheckboxRowTone = 'default' | 'onBrand'

export type CheckboxRowProps = {
  checked: boolean
  onToggle: () => void
  /** Etiket; içinde bağlantı (iç içe <Text onPress>) olabilir. */
  children: ReactNode
  /** Ekran okuyucu için düz metin etiket. */
  accessibilityLabel: string
  tone?: CheckboxRowTone
  testID?: string
}

const boxStyles: Record<CheckboxRowTone, { on: string; off: string }> = {
  default: {
    on: 'border-sky-500 bg-sky-500',
    off: 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-transparent',
  },
  onBrand: {
    on: 'border-white bg-white',
    off: 'border-sky-200 bg-transparent dark:border-sky-700',
  },
}

const checkColor: Record<CheckboxRowTone, string> = {
  default: '#FFFFFF',
  onBrand: '#0EA5E9',
}

const labelStyles: Record<CheckboxRowTone, string> = {
  default: '',
  onBrand: 'text-sky-50',
}

export function CheckboxRow({
  checked,
  onToggle,
  children,
  accessibilityLabel,
  tone = 'default',
  testID,
}: CheckboxRowProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-start gap-3 py-1 active:opacity-80"
    >
      <View
        className={cn(
          'mt-0.5 h-5 w-5 items-center justify-center rounded border-2',
          checked ? boxStyles[tone].on : boxStyles[tone].off
        )}
      >
        {checked ? <Icon name="Check" size={12} color={checkColor[tone]} strokeWidth={3} /> : null}
      </View>
      <Text variant="caption" className={cn('flex-1 leading-5', labelStyles[tone])}>
        {children}
      </Text>
    </Pressable>
  )
}
