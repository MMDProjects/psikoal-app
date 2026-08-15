import { useState } from 'react'

import { Pressable, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { StepProgress } from '@/core/components/molecules/StepProgress'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import {
  useAssessmentQuery,
  useSubmitAssessmentMutation,
  useAssessmentEngine,
} from '@/domains/assessment'

export default function AssessmentScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: assessment, isLoading, isError } = useAssessmentQuery()
  const { mutate: submit, isPending } = useSubmitAssessmentMutation()
  const [started, setStarted] = useState(false)

  const {
    currentQuestion,
    currentAnswer,
    answers,
    isFirst,
    isLast,
    canProceed,
    selectOption,
    goNext,
    goPrev,
    currentIndex,
  } = useAssessmentEngine(assessment)

  const handleNext = () => {
    if (isLast) {
      if (!assessment) return
      submit(
        { assessmentId: assessment.id, answers },
        {
          onSuccess: (result) => {
            router.replace(`/assessment/result?resultId=${result.id}`)
          },
        }
      )
    } else {
      goNext()
    }
  }

  const handleBack = () => {
    if (!started) {
      router.back()
    } else if (isFirst) {
      setStarted(false)
    } else {
      goPrev()
    }
  }

  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles phase={started ? currentIndex + 1 : 0} />

      <BackButton onPress={handleBack} />

      <ScreenTitle title="Değerlendirme Testi" topInset titleClassName="text-white" />

      {isLoading ? (
        <View className="flex-1 justify-center px-5">
          <SkeletonGroup gap="lg" className="items-center">
            <Skeleton variant="circle" width={64} height={64} />
            <Skeleton variant="line" width="60%" height={24} />
            <Skeleton variant="line" width="80%" height={16} />
          </SkeletonGroup>
        </View>
      ) : isError || !assessment ? (
        <EmptyState
          icon="AlertCircle"
          title="Test yüklenemedi"
          description="Lütfen daha sonra tekrar deneyin."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      ) : !started ? (
        <>
          <ScrollView
            contentContainerClassName="flex-grow justify-center px-5 gap-6"
            contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                <Icon name="Brain" size={32} color="#0EA5E9" />
              </View>
              <View className="items-center gap-2">
                <Text variant="heading" className="text-center text-white">
                  {assessment.title}
                </Text>
                <Text variant="body" className="text-center text-sky-100">
                  {assessment.description}
                </Text>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Icon name="HelpCircle" size={14} color="#E0F2FE" />
                  <Text variant="caption" className="text-sky-100">
                    {assessment.questions.length} soru
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Icon name="Clock" size={14} color="#E0F2FE" />
                  <Text variant="caption" className="text-sky-100">
                    ~{assessment.estimatedMinutes} dakika
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-start gap-3 rounded-xl bg-sky-600 px-4 py-3 dark:bg-sky-900">
              <Icon name="Info" size={16} color="#FFFFFF" />
              <Text variant="caption" className="flex-1 text-white">
                Bu test tanı koymaz. Sonuçlar bilgilendirme amaçlıdır. Ücretsiz, kayıt gerektirmez.
              </Text>
            </View>
          </ScrollView>

          <BottomActionBar
            actions={[
              { label: 'Testi Başlat', onPress: () => setStarted(true), variant: 'inverse' },
            ]}
          />
        </>
      ) : (
        <>
          <View className="px-5 pb-4 pt-2">
            <StepProgress
              current={currentIndex + 1}
              total={assessment.questions.length}
              label={`Soru ${currentIndex + 1}`}
            />
          </View>

          <ScrollView
            contentContainerClassName="px-5 gap-6"
            contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
            showsVerticalScrollIndicator={false}
          >
            {currentQuestion && (
              <>
                <Text variant="subheading" className="leading-relaxed text-white">
                  {currentQuestion.text}
                </Text>

                <View className="gap-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentAnswer?.values.includes(option.value) ?? false
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => selectOption(option.value)}
                        className={cn(
                          'rounded-xl px-4 py-4',
                          isSelected
                            ? 'bg-white dark:bg-white'
                            : 'bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800'
                        )}
                      >
                        <View className="flex-row items-center gap-3">
                          <View
                            className={cn(
                              'h-5 w-5 items-center justify-center rounded-full border-2',
                              isSelected
                                ? 'border-sky-500 bg-sky-500'
                                : 'border-sky-300 dark:border-sky-700'
                            )}
                          >
                            {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-white" />}
                          </View>
                          <Text
                            variant="body"
                            className={cn(
                              'flex-1',
                              isSelected
                                ? 'text-sky-700 dark:text-sky-700 font-medium'
                                : 'text-white'
                            )}
                          >
                            {option.text}
                          </Text>
                        </View>
                      </Pressable>
                    )
                  })}
                </View>
              </>
            )}
          </ScrollView>

          <BottomActionBar
            actions={[
              {
                label: isLast ? 'Sonuçları Gör' : 'Sonraki',
                onPress: handleNext,
                variant: 'inverse',
                isDisabled: !canProceed,
                isLoading: isPending && isLast,
                loadingLabel: 'Hesaplanıyor...',
              },
            ]}
          />
        </>
      )}
    </View>
  )
}
