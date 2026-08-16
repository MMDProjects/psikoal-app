import { Pressable, View } from 'react-native'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type SegmentedControlOption<T extends string> = {
  key: T
  label: string
}

export type SegmentedControlProps<T extends string> = {
  options: Array<SegmentedControlOption<T>>
  value: T
  onChange: (key: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      className={cn('flex-row gap-1 rounded-xl bg-neutral-200 p-1 dark:bg-neutral-800', className)}
    >
      {options.map(({ key, label }) => {
        const isActive = value === key
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={cn(
              'flex-1 items-center justify-center rounded-lg py-1',
              isActive && 'bg-white dark:bg-dark-control'
            )}
          >
            <Text
              variant="label"
              className={cn(
                'font-medium',
                isActive
                  ? 'text-neutral-900 dark:text-[#F5F5F7]'
                  : 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
