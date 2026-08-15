import { ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { AssessmentResultCard, useAssessmentResultQuery } from '@/domains/assessment'

export default function AssessmentResultScreen() {
  const { resultId } = useLocalSearchParams<{ resultId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { data: result, isLoading, isError } = useAssessmentResultQuery(resultId ?? '')

  const bottomBarHeight = 56 + insets.bottom

  if (isLoading) {
    return (
      <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
        <DecorCircles />
        <BackButton />
        <ScreenTitle title="Değerlendirme Tamamlandı" topInset titleClassName="text-white" />
        <View className="gap-4 px-5 pt-2">
          <Skeleton variant="rect" width="100%" height={220} borderRadius="xl" />
          <Skeleton variant="line" width="70%" height={14} />
          <Skeleton variant="line" width="85%" height={14} />
        </View>
      </View>
    )
  }

  if (isError || !result) {
    return (
      <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
        <DecorCircles />
        <BackButton />
        <EmptyState
          icon="AlertCircle"
          title="Sonuç bulunamadı"
          ctaLabel="Teste Dön"
          onCta={() => router.replace('/assessment')}
        />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />

      <BackButton />

      <ScreenTitle title="Değerlendirme Tamamlandı" topInset titleClassName="text-white" />

      <ScrollView
        contentContainerClassName="px-5 gap-5"
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <AssessmentResultCard result={result} />
      </ScrollView>

      <BottomActionBar
        actions={[
          {
            label: 'Testi Tekrar Yap',
            onPress: () => router.replace('/assessment'),
            variant: 'inverseGhost',
          },
          { label: 'Destek Al', onPress: () => router.push('/listing/new'), variant: 'inverse' },
        ]}
      />
    </View>
  )
}
