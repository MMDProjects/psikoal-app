const db = require('../db')
const { uuid, now } = require('../helpers')

function registerAuthHandlers(mock) {
  mock.onPost('/auth/login').reply((config) => {
    const { email } = JSON.parse(config.data)
    const user = email === db.auth.expertUser.email ? db.auth.expertUser : db.auth.clientUser
    return [200, { user, tokens: db.auth.tokens }]
  })

  mock.onPost('/auth/register').reply((config) => {
    const { email, firstName, lastName, role } = JSON.parse(config.data)
    const user = {
      id: uuid(),
      email,
      firstName,
      lastName,
      role,
      isVerified: false,
      avatarUrl: null,
      createdAt: now(),
    }
    return [200, { user, tokens: db.auth.tokens }]
  })

  mock.onPost('/auth/logout').reply(204)

  mock.onPost('/auth/refresh').reply(() => {
    return [200, { accessToken: db.auth.tokens.accessToken, refreshToken: db.auth.tokens.refreshToken }]
  })

  mock.onPatch('/auth/me').reply((config) => {
    return [200, JSON.parse(config.data)]
  })

  mock.onPost('/auth/freeze').reply(() => [200, { success: true }])

  mock.onDelete('/auth/me').reply(204)

  mock.onPost('/auth/change-password').reply(() => [200, { success: true }])

  mock.onPost('/auth/forgot-password').reply(() => [200, { success: true }])
}

module.exports = { registerAuthHandlers }
