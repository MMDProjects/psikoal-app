import { useColorScheme, View } from 'react-native'

import { RESULT_LEVEL_CONFIG } from '../assessment.constants'

import type { AssessmentResult } from '../types/assessment.types'

import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

export type AssessmentResultCardProps = {
  result: AssessmentResult
  className?: string
}

export function AssessmentResultCard({ result, className }: AssessmentResultCardProps) {
  const levelConfig = RESULT_LEVEL_CONFIG[result.level]
  const isDark = useColorScheme() === 'dark'
  const iconColor = isDark ? '#A3A3A3' : '#404040'

  return (
    <View className={cn('gap-5', className)}>
      <View className="items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
          <Text variant="heading" className="text-3xl font-bold text-sky-700">
            {result.score}
          </Text>
        </View>
        <Badge
          label={`${levelConfig.label} Düzey`}
          variant={levelConfig.badgeVariant as 'sky' | 'sage' | 'warning' | 'error' | 'neutral'}
        />
      </View>

      <View className="gap-2 rounded-xl bg-white p-5 dark:bg-dark-card">
        <View className="mb-1 flex-row items-center gap-2">
          <Icon name="ClipboardList" size={16} color={iconColor} />
          <Text variant="label" className="font-semibold">
            Değerlendirme
          </Text>
        </View>
        <Text variant="body" color="secondary">
          {result.summary}
        </Text>
      </View>

      {result.suggestions.length > 0 && (
        <View className="gap-3 rounded-xl bg-white p-5 dark:bg-dark-card">
          <View className="mb-1 flex-row items-center gap-2">
            <Icon name="Lightbulb" size={16} color={iconColor} />
            <Text variant="label" className="font-semibold">
              Öneriler
            </Text>
          </View>
          {result.suggestions.map((suggestion, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View className="mt-0.5 h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
                <Text variant="caption" className="text-xs text-sky-600 dark:text-sky-400">
                  {i + 1}
                </Text>
              </View>
              <Text variant="body" color="secondary" className="flex-1">
                {suggestion}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row items-start gap-3 rounded-xl bg-sky-600 px-4 py-3 dark:bg-sky-900">
        <Icon name="Heart" size={16} color="#FFFFFF" />
        <Text variant="caption" className="flex-1 text-white">
          Uzman bir psikologla çalışmak sonuçlarınızı iyileştirmenize yardımcı olabilir.
        </Text>
      </View>
    </View>
  )
}
