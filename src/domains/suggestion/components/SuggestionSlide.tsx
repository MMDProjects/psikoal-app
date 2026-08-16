import { View } from 'react-native'

import type { Suggestion } from '../types/suggestion.types'

import { Text } from '@/core/components/atoms/Text'

type SuggestionSlideProps = {
  suggestion: Suggestion
}

export function SuggestionSlide({ suggestion }: SuggestionSlideProps) {
  return (
    <View className="flex-1 justify-center gap-1 rounded-2xl bg-sky-100 px-4 py-3 dark:bg-sky-900">
      <Text
        variant="caption"
        className="font-semibold uppercase tracking-wide text-sky-500 dark:text-sky-300"
      >
        {suggestion.category}
      </Text>
      <Text
        variant="label"
        className="font-semibold text-sky-900 dark:text-white"
        numberOfLines={1}
      >
        {suggestion.title}
      </Text>
      <Text
        variant="caption"
        className="leading-snug text-sky-700 dark:text-sky-100"
        numberOfLines={2}
      >
        {suggestion.body}
      </Text>
    </View>
  )
}
