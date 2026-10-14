import { useState } from 'react'

import { Pressable, View } from 'react-native'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'

const STARS = [1, 2, 3, 4, 5] as const
const STAR_ACTIVE = '#F59E0B'
const STAR_INACTIVE = '#D4D4D4'

export type ReviewFormProps = {
  onSubmit: (rating: number, comment: string) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export function ReviewForm({ onSubmit, isSubmitting, errorMessage }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  return (
    <View className="gap-4">
      <View className="flex-row gap-2" accessibilityRole="adjustable" accessibilityLabel="Puan">
        {STARS.map((value) => (
          <Pressable
            key={value}
            onPress={() => setRating(value)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`${value} yıldız`}
            accessibilityState={{ selected: rating >= value }}
          >
            <Icon
              name="Star"
              size={28}
              color={rating >= value ? STAR_ACTIVE : STAR_INACTIVE}
              strokeWidth={rating >= value ? 2.25 : 1.5}
            />
          </Pressable>
        ))}
      </View>

      <InputField
        label="Yorumunuz"
        placeholder="Uzmanla çalışma deneyiminizi kısaca anlatın"
        multiline
        maxLength={1000}
        value={comment}
        onChangeText={setComment}
      />

      {errorMessage ? (
        <Text variant="caption" color="error">
          {errorMessage}
        </Text>
      ) : null}

      <Button
        label={isSubmitting ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
        onPress={() => onSubmit(rating, comment)}
        isLoading={isSubmitting}
        isDisabled={rating === 0 || comment.trim().length === 0}
      />
    </View>
  )
}
