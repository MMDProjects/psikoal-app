const db = require('../db')
const { listMeta, relativeTimeTR } = require('../helpers')

function registerNotificationHandlers(mock) {
  mock.onGet('/notifications').reply(() => {
    const sorted = db.notifications
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((n) => ({ ...n, timeLabel: relativeTimeTR(n.createdAt) }))
    return [200, {
      data: sorted,
      meta: listMeta(sorted, {
        unreadCount: db.notifications.filter((n) => !n.read).length,
      }),
    }]
  })

  mock.onPost('/notifications/read-all').reply(() => {
    db.notifications.forEach((n) => { n.read = true })
    return [200, { success: true }]
  })

  mock.onPost(/\/notifications\/[\w-]+\/read/).reply((config) => {
    const id = config.url.split('/')[2]
    const notification = db.notifications.find((n) => n.id === id)
    if (!notification) return [404, { code: 'NOTIFICATION_NOT_FOUND', message: 'Bildirim bulunamadı.' }]
    notification.read = true
    return [200, { success: true }]
  })
}

module.exports = { registerNotificationHandlers }
