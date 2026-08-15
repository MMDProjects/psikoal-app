import { Text as RNText } from 'react-native'
import type { TextProps as RNTextProps } from 'react-native'

import { cn } from '@/core/utils/cn'

export type TextVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'label'
  | 'caption'
  | 'overline'
export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold'
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
export type TextAlign = 'left' | 'center' | 'right'

export type TextProps = RNTextProps & {
  variant?: TextVariant
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  className?: string
}

const variantStyles: Record<TextVariant, string> = {
  display: 'font-display text-5xl font-extrabold tracking-tight',
  heading: 'font-display text-4xl font-extrabold tracking-tight',
  subheading: 'font-body text-xl font-bold',
  body: 'font-body text-[15px] font-regular leading-relaxed',
  label: 'font-body text-sm font-medium',
  caption: 'font-body text-xs font-medium',
  overline: 'font-body text-xs font-medium uppercase tracking-widest',
}

const colorStyles: Record<TextColor, string> = {
  primary: 'text-content-primary   dark:text-[#F5F5F7]',
  secondary: 'text-content-secondary dark:text-[#8E8E93]',
  tertiary: 'text-content-tertiary  dark:text-[#636366]',
  disabled: 'text-content-disabled  dark:text-[#48484A]',
  inverse: 'text-content-inverse   dark:text-neutral-900',
  brand: 'text-brand-text        dark:text-sky-400',
  accent: 'text-accent-text       dark:text-sky-300',
  success: 'text-semantic-success  dark:text-emerald-400',
  warning: 'text-semantic-warning  dark:text-amber-400',
  error: 'text-semantic-error    dark:text-red-400',
}

const alignStyles: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const weightStyles: Record<TextWeight, string> = {
  light: 'font-light',
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

export function Text({
  variant = 'body',
  weight,
  color = 'primary',
  align,
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      {...props}
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        align && alignStyles[align],
        weight && weightStyles[weight],
        className
      )}
    />
  )
}
