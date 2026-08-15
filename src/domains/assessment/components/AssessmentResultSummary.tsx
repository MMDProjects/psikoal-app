import { View } from 'react-native'

import { RESULT_LEVEL_CONFIG } from '../assessment.constants'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'

export type AssessmentResultSummaryProps = {
  result: {
    level: keyof typeof RESULT_LEVEL_CONFIG
    assessmentTitle: string
    score: number
    summary: string
  }
}

export function AssessmentResultSummary({ result }: AssessmentResultSummaryProps) {
  const colors = useThemeColors()
  const cfg = RESULT_LEVEL_CONFIG[result.level]

  return (
    <View className="gap-3 px-4 py-5">
      <View className="flex-row items-center gap-1.5">
        <Text
          variant="caption"
          color="secondary"
          className="font-semibold uppercase tracking-widest"
        >
          Test Sonucu
        </Text>
        <Icon name="Paperclip" size={12} color={colors.contentDisabled} />
      </View>
      <View className="overflow-hidden rounded-xl border border-neutral-200">
        {/* REASON: statü rengi ve pastel zemin RESULT_LEVEL_CONFIG'ten dinamik gelir, statik class üretilemez */}
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ backgroundColor: cfg.headerBg }}
        >
          <View className="flex-row items-center gap-2">
            <Icon name="ClipboardList" size={14} color={cfg.color} />
            <Text variant="label" className="font-semibold" style={{ color: cfg.color }}>
              {result.assessmentTitle}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: cfg.color + '20' }}
            >
              <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                {cfg.label}
              </Text>
            </View>
            <Text variant="caption" color="tertiary">
              Puan: {result.score}
            </Text>
          </View>
        </View>
        <View className="bg-white px-4 pb-3 pt-3">
          <Text variant="caption" color="secondary" className="leading-relaxed">
            {result.summary}
          </Text>
        </View>
      </View>
    </View>
  )
}
