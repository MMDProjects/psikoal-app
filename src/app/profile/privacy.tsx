import { Alert, ScrollView, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouter } from 'expo-router'

import { Divider } from '@/core/components/atoms/Divider'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { MenuRow } from '@/core/components/molecules/MenuRow'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useFreezeAccountMutation, useDeleteAccountMutation } from '@/domains/auth'

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const { mutate: freezeAccount, isPending: isFreezing } = useFreezeAccountMutation()
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccountMutation()

  const goToLogin = () => router.replace('/(auth)/login')

  const handleFreeze = () => {
    Alert.alert(
      'Hesabımı Dondur',
      'Hesabın geçici olarak devre dışı bırakılacak, istediğin zaman tekrar giriş yaparak aktifleştirebilirsin. Devam etmek istiyor musun?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Dondur',
          style: 'destructive',
          onPress: () =>
            freezeAccount(undefined, {
              onSuccess: goToLogin,
              onError: () =>
                Alert.alert('İşlem Başarısız', 'Hesap dondurulamadı. Lütfen tekrar deneyin.'),
            }),
        },
      ]
    )
  }

  const handleDelete = () => {
    Alert.alert(
      'Hesabımı Sil',
      'Bu işlem geri alınamaz. Hesabın ve tüm verilerin kalıcı olarak silinir.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Devam Et',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Son Onay',
              'Hesabını silmek istediğinden emin misin? Bu işlem geri alınamaz.',
              [
                { text: 'Vazgeç', style: 'cancel' },
                {
                  text: 'Hesabımı Sil',
                  style: 'destructive',
                  onPress: () =>
                    deleteAccount(undefined, {
                      onSuccess: goToLogin,
                      onError: () =>
                        Alert.alert('İşlem Başarısız', 'Hesap silinemedi. Lütfen tekrar deneyin.'),
                    }),
                },
              ]
            )
          },
        },
      ]
    )
  }

  const handlePrivacyPolicy = () => {
    Alert.alert('Gizlilik Politikası', 'Bu özellik yakında aktif olacak.')
  }

  const isBusy = isFreezing || isDeleting

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitle title="Veri ve Gizlilik" />

        <View className="px-4 pb-2 pt-4">
          <Text
            variant="caption"
            color="secondary"
            className="font-semibold uppercase tracking-widest"
          >
            Hesap Yönetimi
          </Text>
        </View>
        <MenuRow
          icon="PauseCircle"
          label={isFreezing ? 'Donduruluyor...' : 'Hesabımı Dondur'}
          onPress={isBusy ? () => {} : handleFreeze}
        />
        <MenuRow
          icon="Trash2"
          label={isDeleting ? 'Siliniyor...' : 'Hesabımı Sil'}
          danger
          onPress={isBusy ? () => {} : handleDelete}
        />

        <Divider spacing="none" className="mx-4 mt-4" />

        <View className="px-4 pb-2 pt-4">
          <Text
            variant="caption"
            color="secondary"
            className="font-semibold uppercase tracking-widest"
          >
            Gizlilik
          </Text>
        </View>
        <MenuRow icon="ShieldCheck" label="Gizlilik Politikası" onPress={handlePrivacyPolicy} />
      </ScrollView>
    </View>
  )
}
