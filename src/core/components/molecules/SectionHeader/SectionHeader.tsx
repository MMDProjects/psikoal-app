import { Pressable, View } from 'react-native'

import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type SectionHeaderProps = {
  title: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function SectionHeader({ title, actionLabel, onAction, className }: SectionHeaderProps) {
  return (
    <View className={cn('flex-row items-center justify-between px-4 pb-2 pt-4', className)}>
      <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
        {title}
      </Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} className="active:opacity-60">
          <Text variant="caption" className="font-semibold text-sky-500">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
