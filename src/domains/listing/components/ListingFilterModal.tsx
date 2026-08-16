import { useEffect, useState } from 'react'

import { Modal, Pressable, ScrollView, useColorScheme, View } from 'react-native'

import type { ListingListFilters } from '../types/listing.types'

import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useCategoriesQuery } from '@/domains/category'

const SESSION_FILTER_OPTIONS = [
  { label: 'Online', value: 'online' as const },
  { label: 'Yüz Yüze', value: 'yüz_yüze' as const },
  { label: 'Yüz Yüze / Online', value: 'yüz_yüze_online' as const },
]

export const PRICE_FILTER_OPTIONS: Array<{
  label: string
  budgetMin: number
  budgetMax: number | undefined
}> = [
  { label: '₺0 – ₺500', budgetMin: 0, budgetMax: 500 },
  { label: '₺500 – ₺1500', budgetMin: 500, budgetMax: 1500 },
  { label: '₺1500 – ₺3000', budgetMin: 1500, budgetMax: 3000 },
  { label: '₺3000+', budgetMin: 3000, budgetMax: undefined },
]

export type ListingFilterResult = {
  filters: ListingListFilters
  priceLabels: string[]
}

export type ListingFilterModalProps = {
  visible: boolean
  current: ListingListFilters
  currentPriceLabels: string[]
  onApply: (result: ListingFilterResult) => void
  onClear: () => void
  onClose: () => void
}

function toggleArr<T extends string>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

function priceLabelsToBudget(
  labels: string[]
): Pick<ListingListFilters, 'budgetMin' | 'budgetMax'> {
  const ranges = PRICE_FILTER_OPTIONS.filter((o) => labels.includes(o.label))
  if (ranges.length === 0) return { budgetMin: undefined, budgetMax: undefined }
  const hasUnbounded = ranges.some((r) => r.budgetMax === undefined)
  return {
    budgetMin: Math.min(...ranges.map((r) => r.budgetMin)),
    budgetMax: hasUnbounded ? undefined : Math.max(...ranges.map((r) => r.budgetMax as number)),
  }
}

export function ListingFilterModal({
  visible,
  current,
  currentPriceLabels,
  onApply,
  onClear,
  onClose,
}: ListingFilterModalProps) {
  const isDark = useColorScheme() === 'dark'
  const { data: categories } = useCategoriesQuery()
  const [spec, setSpec] = useState<string[]>([])
  const [session, setSession] = useState<string[]>([])
  const [price, setPrice] = useState<string[]>([])

  useEffect(() => {
    if (visible) {
      setSpec(current.specialization ?? [])
      setSession(current.sessionType ?? [])
      setPrice(currentPriceLabels)
    }
  }, [visible, current.specialization, current.sessionType, currentPriceLabels])

  const handleApply = () => {
    onApply({
      filters: {
        specialization: spec.length > 0 ? spec : undefined,
        sessionType: session.length > 0 ? session : undefined,
        ...priceLabelsToBudget(price),
      },
      priceLabels: price,
    })
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View
        className="rounded-t-3xl bg-white px-5 pb-10 pt-5 dark:bg-dark-card"
        style={{ maxHeight: '85%' }}
      >
        <View className="mb-5 flex-row items-center justify-between">
          <Text variant="subheading">Filtrele</Text>
          <Pressable onPress={onClose}>
            <Icon name="X" size={20} color={isDark ? '#F5F5F7' : '#171717'} />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-5 pb-5">
          <View className="gap-2">
            <Text variant="label" className="font-semibold">
              Uzmanlık Alanı
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categories?.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  variant="filter"
                  isSelected={spec.includes(category.name)}
                  onPress={() => setSpec((prev) => toggleArr(prev, category.name))}
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text variant="label" className="font-semibold">
              Seans Tipi
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SESSION_FILTER_OPTIONS.map((opt) => (
                <Chip
                  key={opt.label}
                  label={opt.label}
                  variant="session"
                  isSelected={session.includes(opt.value)}
                  onPress={() => setSession((prev) => toggleArr(prev, opt.value))}
                />
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text variant="label" className="font-semibold">
              Fiyat Aralığı
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {PRICE_FILTER_OPTIONS.map((opt) => (
                <Chip
                  key={opt.label}
                  label={opt.label}
                  variant="tag"
                  isSelected={price.includes(opt.label)}
                  onPress={() => setPrice((prev) => toggleArr(prev, opt.label))}
                />
              ))}
            </View>
          </View>
        </ScrollView>
        <View className="mt-4 flex-row gap-3">
          <Pressable
            onPress={onClear}
            className="flex-1 items-center rounded-xl border border-neutral-200 py-3 active:bg-neutral-50 dark:border-dark-border2 dark:active:bg-dark-elevated"
          >
            <Text variant="label" color="secondary">
              Temizle
            </Text>
          </Pressable>
          <Pressable
            onPress={handleApply}
            className="flex-1 items-center rounded-xl bg-sky-500 py-3 active:bg-sky-600"
          >
            <Text variant="label" className="font-semibold text-white">
              Uygula
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
