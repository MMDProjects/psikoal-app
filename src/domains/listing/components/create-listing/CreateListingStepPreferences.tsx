import { Pressable, View } from 'react-native'

import type { IconName } from '@/core/components/atoms/Icon'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { useThemeColors } from '@/core/theme'
import { cn } from '@/core/utils/cn'

const ICON_ON_BRAND = '#FFFFFF'

export type SessionType = 'online' | 'yüz_yüze' | 'yüz_yüze_online'

const SESSION_OPTIONS: Array<{
  value: SessionType
  label: string
  subtitle: string
  icon: IconName
}> = [
  { value: 'online', label: 'Online', subtitle: 'Video veya ses ile görüşme', icon: 'Video' },
  { value: 'yüz_yüze', label: 'Yüz Yüze', subtitle: 'Fiziksel ofis görüşmesi', icon: 'MapPin' },
  {
    value: 'yüz_yüze_online',
    label: 'Yüz Yüze / Online',
    subtitle: 'Her iki yöntem de uygun',
    icon: 'Shuffle',
  },
]

export type CreateListingStepPreferencesProps = {
  sessionType: SessionType
  onSessionTypeChange: (value: SessionType) => void
  budgetMin: string
  onBudgetMinChange: (value: string) => void
  budgetMinError?: string
  budgetMax: string
  onBudgetMaxChange: (value: string) => void
  budgetMaxError?: string
}

export function CreateListingStepPreferences({
  sessionType,
  onSessionTypeChange,
  budgetMin,
  onBudgetMinChange,
  budgetMinError,
  budgetMax,
  onBudgetMaxChange,
  budgetMaxError,
}: CreateListingStepPreferencesProps) {
  const colors = useThemeColors()

  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text variant="heading" className="text-white">
          Tercihleriniz
        </Text>
        <Text variant="body" className="text-sky-100">
          Görüşme yönteminizi ve bütçe aralığınızı belirleyin.
        </Text>
      </View>

      <View className="gap-2.5">
        <Text variant="label" className="text-white">
          Seans Tipi
        </Text>
        <View className="gap-2">
          {SESSION_OPTIONS.map(({ value, label, subtitle, icon }) => {
            const isActive = sessionType === value
            return (
              <Pressable
                key={value}
                onPress={() => onSessionTypeChange(value)}
                className={cn(
                  'flex-row items-center gap-3 rounded-xl border p-4',
                  isActive
                    ? 'bg-white border-white'
                    : 'bg-sky-600 border-sky-600 dark:bg-sky-900 dark:border-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
                )}
              >
                <View
                  className={cn(
                    'h-9 w-9 items-center justify-center rounded-xl',
                    isActive ? 'bg-sky-100' : 'bg-sky-700 dark:bg-sky-950'
                  )}
                >
                  <Icon name={icon} size={18} color={isActive ? colors.brand : ICON_ON_BRAND} />
                </View>
                <View className="flex-1">
                  <Text
                    variant="label"
                    className={isActive ? 'text-neutral-900 dark:text-neutral-900' : 'text-white'}
                  >
                    {label}
                  </Text>
                  <Text
                    variant="caption"
                    className={isActive ? 'text-neutral-500 dark:text-neutral-500' : 'text-sky-100'}
                  >
                    {subtitle}
                  </Text>
                </View>
                <View
                  className={cn(
                    'h-5 w-5 items-center justify-center rounded-full border-2',
                    isActive ? 'border-sky-500' : 'border-sky-300 dark:border-sky-700'
                  )}
                >
                  {isActive && <View className="h-2.5 w-2.5 rounded-full bg-sky-500" />}
                </View>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View className="gap-2.5">
        <Text variant="label" className="text-white">
          Bütçe Aralığı (₺ / seans)
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputField
              tone="onBrand"
              label="Minimum"
              placeholder="500"
              keyboardType="numeric"
              value={budgetMin}
              onChangeText={onBudgetMinChange}
              errorMessage={budgetMinError}
              isRequired
            />
          </View>
          <View className="flex-1">
            <InputField
              tone="onBrand"
              label="Maksimum"
              placeholder="1000"
              keyboardType="numeric"
              value={budgetMax}
              onChangeText={onBudgetMaxChange}
              errorMessage={budgetMaxError}
              isRequired
            />
          </View>
        </View>
        {budgetMin && budgetMax && !budgetMinError && !budgetMaxError && (
          <View className="flex-row items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-2 dark:bg-sky-900">
            <Icon name="Info" size={14} color={ICON_ON_BRAND} />
            <Text variant="caption" className="text-white">
              ₺{parseFloat(budgetMin).toLocaleString('tr-TR')} – ₺
              {parseFloat(budgetMax).toLocaleString('tr-TR')} aralığı
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
