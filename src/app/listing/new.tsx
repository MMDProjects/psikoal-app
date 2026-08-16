import { useState } from 'react'

import { View } from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'

import type { CreateListingRequest } from '@/domains/listing'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { CreateListingForm, useCreateListingMutation } from '@/domains/listing'

export default function NewListingScreen() {
  const router = useRouter()
  const { spec } = useLocalSearchParams<{ spec?: string }>()

  const [step, setStep] = useState(1)

  const { mutate: createListing, isPending, error } = useCreateListingMutation()

  const handleSubmit = (data: CreateListingRequest) => {
    createListing(data, {
      onSuccess: (response) => {
        router.replace(`/listing/${response.id}` as never)
      },
    })
  }

  const apiError = error instanceof Error ? error.message : undefined

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles phase={step} />

      <BackButton onPress={() => (step > 1 ? setStep(step - 1) : router.back())} />

      <ScreenTitle title="İlan Oluştur" topInset titleClassName="text-white" />

      {apiError && (
        <View className="mx-4 mb-2 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950">
          <Text variant="caption" className="text-red-600 dark:text-red-300">
            {apiError}
          </Text>
        </View>
      )}

      <CreateListingForm
        step={step}
        onStepChange={setStep}
        onSubmit={handleSubmit}
        isLoading={isPending}
        initialSpecialization={spec ?? undefined}
      />
    </View>
  )
}
