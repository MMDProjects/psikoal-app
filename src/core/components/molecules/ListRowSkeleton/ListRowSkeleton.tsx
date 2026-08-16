import { View } from 'react-native'

import { Skeleton } from '@/core/components/atoms/Skeleton'

export type ListRowSkeletonProps = {
  lineWidths?: string[]
}

export function ListRowSkeleton({ lineWidths = ['60%', '90%', '40%'] }: ListRowSkeletonProps) {
  return (
    <View className="gap-3 px-4 py-4">
      {lineWidths.map((width, i) => (
        <Skeleton key={i} variant="line" width={width} height={i === 0 ? 14 : 11} />
      ))}
    </View>
  )
}
