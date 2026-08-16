import { forwardRef } from 'react'

import type { TextInput } from 'react-native'
import { View } from 'react-native'

import type { InputProps, InputState } from '@/core/components/atoms'

import { Input, Text } from '@/core/components/atoms'
import { cn } from '@/core/utils/cn'

export type InputFieldProps = Omit<InputProps, 'state' | 'className'> & {
  label?: string
  hint?: string
  errorMessage?: string
  successMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  className?: string // applied to the outer container
  inputClassName?: string // forwarded to Input
}

export const InputField = forwardRef<TextInput, InputFieldProps>(function InputField(
  {
    label,
    hint,
    errorMessage,
    successMessage,
    isRequired = false,
    isDisabled = false,
    className,
    inputClassName,
    ...inputProps
  },
  ref
) {
  const derivedState: InputState = (() => {
    if (isDisabled) return 'disabled'
    if (errorMessage) return 'error'
    if (successMessage) return 'success'
    return 'default'
  })()

  const subText = errorMessage ?? successMessage ?? hint

  const isOnBrand = inputProps.tone === 'onBrand'

  const subTextColor = (() => {
    if (isOnBrand) return undefined // onBrand'de renk className ile verilir
    if (errorMessage) return 'error' as const
    if (successMessage) return 'success' as const
    return 'tertiary' as const
  })()

  const onBrandSubTextClass = errorMessage
    ? 'text-red-100'
    : successMessage
      ? 'text-emerald-100'
      : 'text-sky-100'

  return (
    <View className={cn('gap-1.5', className)}>
      {label && (
        <View className="flex-row items-center gap-0.5">
          <Text
            variant="label"
            color={isOnBrand ? undefined : 'secondary'}
            className={isOnBrand ? 'text-white' : undefined}
          >
            {label}
          </Text>
          {isRequired && (
            <Text
              variant="label"
              color={isOnBrand ? undefined : 'error'}
              className={cn('leading-none', isOnBrand && 'text-red-100')}
            >
              *
            </Text>
          )}
        </View>
      )}

      <Input ref={ref} state={derivedState} className={inputClassName} {...inputProps} />

      {subText && (
        <Text
          variant="caption"
          color={subTextColor}
          className={isOnBrand ? onBrandSubTextClass : undefined}
        >
          {subText}
        </Text>
      )}
    </View>
  )
})
