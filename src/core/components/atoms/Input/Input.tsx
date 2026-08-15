import { forwardRef, useState } from 'react'
import type { ComponentType } from 'react'

import { Pressable, TextInput, View } from 'react-native'
import type { TextInputProps } from 'react-native'

import { Eye, EyeOff, X } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'

import * as Haptics from 'expo-haptics'

import type { SvgProps } from 'react-native-svg'

import { cn } from '@/core/utils/cn'

type IconProps = Pick<SvgProps, 'stroke'> & { size?: number }
const EyeIcon = Eye as ComponentType<IconProps>
const EyeOffIcon = EyeOff as ComponentType<IconProps>
const XIcon = X as ComponentType<IconProps>

export type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputTone = 'default' | 'onBrand'

export type InputProps = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  state?: InputState
  size?: InputSize
  tone?: InputTone
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  isSecure?: boolean
  multiline?: boolean
  maxLength?: number
  autoCapitalize?: TextInputProps['autoCapitalize']
  keyboardType?: TextInputProps['keyboardType']
  returnKeyType?: TextInputProps['returnKeyType']
  autoFocus?: boolean
  onFocus?: TextInputProps['onFocus']
  onBlur?: TextInputProps['onBlur']
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  className?: string
}

const MULTILINE_MAX_HEIGHT = 120

const containerStateStyles: Record<InputState, string> = {
  default: 'border border-border bg-surface-raised',
  focused: 'border-2 border-sky-400 bg-surface-raised',
  error: 'border-2 border-semantic-error bg-semantic-error-light',
  success: 'border-2 border-semantic-success bg-surface-raised',
  disabled: 'border border-border bg-surface-sunken opacity-40',
}

const onBrandContainerStateStyles: Record<InputState, string> = {
  default: 'border border-white bg-white dark:border-sky-900 dark:bg-sky-900',
  focused: 'border-2 border-sky-300 bg-white dark:border-sky-400 dark:bg-sky-900',
  error: 'border-2 border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950',
  success: 'border-2 border-emerald-400 bg-white dark:border-emerald-600 dark:bg-sky-900',
  disabled: 'border border-white bg-white opacity-40 dark:border-sky-900 dark:bg-sky-900',
}

const containerSizeStyles: Record<InputSize, string> = {
  sm: 'min-h-9 px-3 rounded-md',
  md: 'min-h-11 px-3.5 rounded-lg',
  lg: 'min-h-13 px-4 rounded-xl',
}

const textSizeStyles: Record<InputSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
}

const ICON_SIZE: Record<InputSize, number> = { sm: 16, md: 18, lg: 20 }
const ICON_COLOR = { default: '#737373', error: '#DC2626', success: '#16A34A' }
const ON_BRAND_DARK_ICON_COLOR = {
  default: 'rgba(255,255,255,0.7)',
  error: '#FCA5A5',
  success: '#6EE7B7',
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    value,
    onChangeText,
    placeholder,
    state = 'default',
    size = 'md',
    tone = 'default',
    leftElement,
    rightElement,
    isSecure = false,
    multiline = false,
    maxLength,
    autoCapitalize,
    keyboardType,
    onFocus,
    onBlur,
    className,
    autoFocus,
    returnKeyType,
    onSubmitEditing,
  }: InputProps,
  ref
) {
  const [isFocused, setIsFocused] = useState(false)
  const [isSecureVisible, setIsSecureVisible] = useState(false)

  const effectiveState: InputState = (() => {
    if (state === 'error' || state === 'success' || state === 'disabled') return state
    return isFocused ? 'focused' : 'default'
  })()

  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const isDisabled = state === 'disabled'
  const iconColors = tone === 'onBrand' && isDark ? ON_BRAND_DARK_ICON_COLOR : ICON_COLOR
  const iconColor =
    state === 'error'
      ? iconColors.error
      : state === 'success'
        ? iconColors.success
        : iconColors.default
  const iconSize = ICON_SIZE[size]

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const toggleSecure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
    setIsSecureVisible((v) => !v)
  }

  const showClearButton =
    !rightElement && !isSecure && value.length > 0 && !isDisabled && !multiline
  const showSecureToggle = isSecure && !rightElement

  const resolvedRightElement = (() => {
    if (rightElement) return rightElement
    if (showSecureToggle) {
      return (
        <Pressable
          onPress={toggleSecure}
          accessibilityLabel={isSecureVisible ? 'Hide password' : 'Show password'}
          className="p-1"
        >
          {isSecureVisible ? (
            <EyeOffIcon size={iconSize} stroke={iconColor} />
          ) : (
            <EyeIcon size={iconSize} stroke={iconColor} />
          )}
        </Pressable>
      )
    }
    if (showClearButton) {
      return (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityLabel="Clear input"
          className="p-1"
        >
          <XIcon size={iconSize} stroke={iconColor} />
        </Pressable>
      )
    }
    return null
  })()

  return (
    <View
      className={cn(
        'flex-row items-center',
        tone === 'onBrand'
          ? onBrandContainerStateStyles[effectiveState]
          : containerStateStyles[effectiveState],
        containerSizeStyles[size],
        multiline && 'items-start py-2.5',
        className
      )}
    >
      {leftElement && <View className="mr-2">{leftElement}</View>}

      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tone === 'onBrand' && isDark ? 'rgba(255,255,255,0.55)' : '#A3A3A3'}
        editable={!isDisabled}
        secureTextEntry={isSecure && !isSecureVisible}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={multiline ? { maxHeight: MULTILINE_MAX_HEIGHT } : undefined}
        className={cn(
          'flex-1 p-0',
          tone === 'onBrand' ? 'text-neutral-900 dark:text-white' : 'text-content-primary',
          textSizeStyles[size],
          multiline && 'align-top'
        )}
      />

      {resolvedRightElement && <View className="ml-2">{resolvedRightElement}</View>}
    </View>
  )
})
