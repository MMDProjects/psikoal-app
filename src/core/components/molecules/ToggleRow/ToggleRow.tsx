import { View } from 'react-native'

import { Switch } from '@/core/components/atoms/Switch'
import { Text } from '@/core/components/atoms/Text'

export type ToggleRowProps = {
  label: string
  description?: string
  value: boolean
  onValueChange: (value: boolean) => void
}

export function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="flex-1 gap-0.5">
        <Text variant="label" className="font-medium">
          {label}
        </Text>
        {description ? (
          <Text variant="caption" color="tertiary">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  )
}
