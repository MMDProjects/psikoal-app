import { View } from 'react-native'

import { Chip } from '@/core/components/atoms/Chip'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { useCategoriesQuery } from '@/domains/category'

export type OnboardingStepSpecsProps = {
  selectedSpecs: string[]
  onToggleSpec: (spec: string) => void
  errorMessage?: string
}

export function OnboardingStepSpecs({
  selectedSpecs,
  onToggleSpec,
  errorMessage,
}: OnboardingStepSpecsProps) {
  const { data: categories, isLoading } = useCategoriesQuery()

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {isLoading ? (
          <>
            <Skeleton variant="rect" width={90} height={32} borderRadius="full" />
            <Skeleton variant="rect" width={110} height={32} borderRadius="full" />
            <Skeleton variant="rect" width={80} height={32} borderRadius="full" />
          </>
        ) : (
          categories?.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              isSelected={selectedSpecs.includes(category.name)}
              onPress={() => onToggleSpec(category.name)}
              variant="onBrand"
            />
          ))
        )}
      </View>
      {errorMessage && (
        <Text variant="caption" className="text-red-100">
          {errorMessage}
        </Text>
      )}
    </View>
  )
}
