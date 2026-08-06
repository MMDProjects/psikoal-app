import * as Notifications from 'expo-notifications'

// Uygulama önplandayken gelen bildirimin nasıl gösterileceğini belirler —
// import edilir edilmez (modül yüklenirken) bir kere kurulur.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})
