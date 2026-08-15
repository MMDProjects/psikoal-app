import { Pressable, ScrollView, useColorScheme, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ListRowSkeleton } from '@/core/components/molecules/ListRowSkeleton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { SectionHeader } from '@/core/components/molecules/SectionHeader'
import { useRefresh } from '@/core/hooks'
import { formatDate } from '@/core/utils/formatDate'
import {
  useAssessmentListQuery,
  useMyAssessmentResultsQuery,
  RESULT_LEVEL_CONFIG,
} from '@/domains/assessment'

export default function AssessmentListScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'

  const assessmentsQuery = useAssessmentListQuery()
  const { data: assessmentList, isLoading: listLoading } = assessmentsQuery
  const myResultsQuery = useMyAssessmentResultsQuery()
  const { isLoading: resultsLoading } = myResultsQuery
  const myResults = myResultsQuery.data?.data
  const { isRefreshing, onRefresh } = useRefresh(assessmentsQuery, myResultsQuery)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
        contentContainerStyle={{ paddingTop: insets.top + 8 }}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <ScreenTitle title="Testler" />

        <Divider spacing="none" className="mx-4 mt-4" />
        <SectionHeader title="Sonuçlarım" />

        {resultsLoading ? (
          <ListRowSkeleton />
        ) : !myResults || myResults.length === 0 ? (
          <View className="items-center gap-2 px-4 py-6">
            <Icon name="ClipboardList" size={28} color="#A3A3A3" />
            <Text variant="body" color="secondary" align="center">
              Henüz tamamlanmış test yok
            </Text>
            <Text variant="caption" color="tertiary" align="center">
              Aşağıdaki testlerden birini tamamlayın.
            </Text>
          </View>
        ) : (
          myResults.map((result, index) => {
            const cfg = RESULT_LEVEL_CONFIG[result.level]
            return (
              <View key={result.id}>
                {index > 0 && <Divider spacing="none" className="mx-4" />}
                <View className="gap-2 px-4 py-4">
                  <View className="flex-row items-center gap-2.5">
                    <Text
                      variant="label"
                      className="flex-1 font-semibold text-neutral-900 dark:text-[#F5F5F7]"
                      numberOfLines={1}
                    >
                      {result.assessmentTitle}
                    </Text>
                    <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                      {cfg.label}
                    </Text>
                  </View>

                  <Text
                    variant="caption"
                    color="secondary"
                    numberOfLines={2}
                    className="leading-relaxed"
                  >
                    {result.summary}
                  </Text>

                  <View className="flex-row items-center justify-between pt-1">
                    <Text variant="caption" color="tertiary">
                      Puan: {result.score}
                    </Text>
                    <Text variant="caption" color="tertiary">
                      {formatDate(result.createdAt, 'long')}
                    </Text>
                  </View>
                </View>
              </View>
            )
          })
        )}

        <Divider spacing="none" className="mx-4 mt-4" />
        <SectionHeader title="Mevcut Testler" />

        {listLoading ? (
          <ListRowSkeleton />
        ) : (
          assessmentList?.map((test, index) => (
            <View key={test.id}>
              {index > 0 && <Divider spacing="none" className="mx-4" />}
              <Pressable
                onPress={() => router.push('/assessment' as never)}
                className="flex-row items-center gap-3 px-4 py-4 active:opacity-90"
              >
                <View className="flex-1 gap-0.5">
                  <Text variant="body" className="dark:text-[#F5F5F7]">
                    {test.title}
                  </Text>
                  <Text variant="caption" color="tertiary">
                    Ücretsiz · {test.questionCount} soru · ~{test.estimatedMinutes} dk · Kayıt
                    gerekmez
                  </Text>
                </View>
                <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
