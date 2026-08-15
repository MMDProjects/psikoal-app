import { View } from 'react-native'

import { Chip } from '@/core/components/atoms/Chip'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { InputField } from '@/core/components/molecules/InputField'
import { useCategoriesQuery } from '@/domains/category'

export type CreateListingStepTopicProps = {
  title: string
  onTitleChange: (value: string) => void
  titleError?: string
  description: string
  onDescriptionChange: (value: string) => void
  selectedSpecs: string[]
  onToggleSpec: (spec: string) => void
  specsError?: string
}

export function CreateListingStepTopic({
  title,
  onTitleChange,
  titleError,
  description,
  onDescriptionChange,
  selectedSpecs,
  onToggleSpec,
  specsError,
}: CreateListingStepTopicProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery()

  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text variant="heading" className="text-white">
          İlanını Oluştur
        </Text>
        <Text variant="body" className="text-sky-100">
          Neye ihtiyaç duyduğunu anlat, uzmanlara ilanını göster.
        </Text>
      </View>

      <InputField
        tone="onBrand"
        label="İlan Başlığı"
        placeholder="Örn: Kaygı ve panik atak için destek arıyorum"
        value={title}
        onChangeText={onTitleChange}
        errorMessage={titleError}
        isRequired
        maxLength={100}
        hint={`${title.length}/100`}
      />

      <InputField
        tone="onBrand"
        label="Açıklama (opsiyonel)"
        placeholder="Deneyimini, beklentilerini, mevcut durumunu kısaca anlat..."
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        maxLength={500}
        hint={`${description.length}/500`}
      />

      <View className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text variant="label" className="text-white">
            Uzmanlık Alanı{' '}
            <Text variant="caption" className="text-red-100">
              *
            </Text>
          </Text>
          {selectedSpecs.length > 0 && (
            <Text variant="caption" className="text-sky-100">
              {selectedSpecs.length} seçildi
            </Text>
          )}
        </View>
        <View className="flex-row flex-wrap gap-2">
          {categoriesLoading ? (
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
                variant="onBrand"
                isSelected={selectedSpecs.includes(category.name)}
                onPress={() => onToggleSpec(category.name)}
              />
            ))
          )}
        </View>
        {specsError && (
          <Text variant="caption" className="text-red-100">
            {specsError}
          </Text>
        )}
      </View>
    </View>
  )
}
