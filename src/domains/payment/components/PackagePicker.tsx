import { Pressable, View } from 'react-native'

import type { Package } from '../types/payment.types'

import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type PackagePickerProps = {
  packages: Package[]
  selectedId: string | null
  onSelect: (id: string) => void
  className?: string
}

export function PackagePicker({ packages, selectedId, onSelect, className }: PackagePickerProps) {
  return (
    <View className={cn('gap-3', className)}>
      {packages.map((pkg) => {
        const isSelected = selectedId === pkg.id
        return (
          <Pressable
            key={pkg.id}
            onPress={() => onSelect(pkg.id)}
            className={cn(
              'gap-3 rounded-2xl border p-5',
              isSelected
                ? 'bg-sky-50 dark:bg-sky-950 border-sky-300 dark:border-sky-700'
                : 'bg-white dark:bg-dark-card border-neutral-100 dark:border-dark-border active:bg-neutral-50 dark:active:bg-dark-elevated'
            )}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <View className="flex-row items-start justify-between">
              <View className="mr-3 flex-1 gap-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text
                    variant="label"
                    className={cn('font-semibold', isSelected && 'text-sky-800 dark:text-sky-300')}
                  >
                    {pkg.name}
                  </Text>
                  {pkg.isPopular && <Badge label="Popüler" variant="sky" size="sm" />}
                </View>
                <Text variant="caption" color="secondary">
                  {pkg.sessionCount} seans · {pkg.validDays} gün geçerli
                </Text>
              </View>

              <View className="items-end gap-0.5">
                <Text
                  variant="subheading"
                  className={cn('font-bold', isSelected && 'text-sky-700 dark:text-sky-400')}
                >
                  ₺{pkg.price.toLocaleString('tr-TR')}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text variant="caption" color="secondary" className="line-through">
                    ₺{pkg.originalPrice.toLocaleString('tr-TR')}
                  </Text>
                  <Badge label={`%${pkg.discountPct}`} variant="sage" size="sm" />
                </View>
              </View>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Icon name="CheckCircle2" size={14} color={isSelected ? '#0369A1' : '#16A34A'} />
              <Text
                variant="caption"
                className={cn(isSelected ? 'text-sky-700' : 'text-green-700')}
              >
                Seans başı ₺{pkg.unitPrice.toLocaleString('tr-TR')}
              </Text>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}
