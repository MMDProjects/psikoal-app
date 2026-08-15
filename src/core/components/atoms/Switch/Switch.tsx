import { Switch as RNSwitch } from 'react-native'

import * as Haptics from 'expo-haptics'

export type SwitchProps = {
  value: boolean
  onValueChange: (value: boolean) => void
  isDisabled?: boolean
  className?: string
}

const TRACK_COLOR = { false: '#E5E5E5', true: '#0EA5E9' } // neutral-200 / sky-500
const THUMB_COLOR = '#FFFFFF'

export function Switch({ value, onValueChange, isDisabled = false, className }: SwitchProps) {
  const handleChange = (next: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
    onValueChange(next)
  }

  return (
    <RNSwitch
      value={value}
      onValueChange={handleChange}
      disabled={isDisabled}
      trackColor={TRACK_COLOR}
      thumbColor={THUMB_COLOR}
      ios_backgroundColor={TRACK_COLOR.false}
      className={className}
      accessibilityRole="switch"
    />
  )
}
