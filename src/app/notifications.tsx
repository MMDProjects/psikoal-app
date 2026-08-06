import { Pressable, ScrollView, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppRefreshControl } from '@/core/components/atoms/AppRefreshControl'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useRefresh } from '@/core/hooks'
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  usePushTokenRegistration,
  NOTIFICATION_TYPE_CONFIG,
} from '@/domains/notification'

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const notificationsQuery = useNotificationsQuery()
  const { data, isLoading, isError, refetch } = notificationsQuery
  const { isRefreshing, onRefresh } = useRefresh(notificationsQuery)
  const notifications = data?.data ?? []
  const unreadCount = data?.meta.unreadCount ?? 0

  // PsikoAl kuralı: push izni ilk login'de değil, kullanıcı ilk bildirimiyle
  // karşılaştığında istenir — bu yüzden liste dolu olduğunda tetiklenir.
  usePushTokenRegistration(!isLoading && notifications.length > 0)

  const { mutate: markRead } = useMarkNotificationReadMutation()
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsReadMutation()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-6"
        contentContainerStyle={{ paddingTop: insets.top + 8 }}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <ScreenTitle title="Bildirimler" />

        {unreadCount > 0 && !isLoading && !isError && (
          <Pressable
            onPress={() => markAllRead()}
            disabled={isMarkingAll}
            className="flex-row items-center justify-end gap-1.5 px-4 pb-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Tümünü okundu işaretle"
          >
            <Icon name="CheckCheck" size={14} color="#0EA5E9" />
            <Text variant="caption" className="text-sky-600 dark:text-sky-400 font-semibold">
              Tümünü okundu işaretle
            </Text>
          </Pressable>
        )}

        {isLoading ? (
          <View>
            {[1, 2, 3].map((i) => (
              <View key={i} className="flex-row items-start gap-3 px-4 py-4">
                <Skeleton variant="circle" width={40} height={40} />
                <View className="flex-1 gap-2">
                  <Skeleton variant="line" width="55%" height={13} />
                  <Skeleton variant="line" width="85%" height={12} />
                </View>
              </View>
            ))}
          </View>
        ) : isError ? (
          <EmptyState icon="WifiOff" title="Yüklenemedi" ctaLabel="Tekrar Dene" onCta={refetch} />
        ) : notifications.length === 0 ? (
          <EmptyState icon="Bell" title="Henüz bildiriminiz yok" />
        ) : (
          notifications.map((notif, index) => {
            const cfg = NOTIFICATION_TYPE_CONFIG[notif.type]
            return (
              <View key={notif.id}>
                {index > 0 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                <Pressable
                  onPress={() => { if (!notif.read) markRead(notif.id) }}
                  className="flex-row items-start gap-3 px-4 py-4 active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel={notif.read ? notif.title : `${notif.title}, okunmadı`}
                >
                  {!notif.read && (
                    <View className="absolute left-1.5 top-6 w-1.5 h-1.5 rounded-full bg-sky-500" />
                  )}
                  <View className={`w-10 h-10 rounded-full items-center justify-center flex-shrink-0 ${cfg.bgClass}`}>
                    <Icon name={cfg.icon} size={18} color={isDark ? cfg.iconColorDark : cfg.iconColorLight} />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text variant="label" className={!notif.read ? 'font-semibold' : ''}>
                      {notif.title}
                    </Text>
                    <Text variant="caption" color="secondary" numberOfLines={2}>
                      {notif.body}
                    </Text>
                    <Text variant="caption" color="tertiary" className="mt-1">
                      {notif.timeLabel}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}
