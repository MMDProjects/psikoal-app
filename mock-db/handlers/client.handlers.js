const db = require('../db')
const { listMeta, initialsFromName } = require('../helpers')

function serveClient(client) {
  return { ...client, initials: initialsFromName(client.fullName) }
}

function registerClientHandlers(mock) {
  mock.onGet('/clients').reply(() => {
    const result = db.clients.map(serveClient)
    return [200, { data: result, meta: listMeta(result) }]
  })

  mock.onGet(/\/clients\/[\w-]+/).reply((config) => {
    const id = config.url.split('/').pop()
    const client = db.clients.find((c) => c.id === id)
    return client ? [200, serveClient(client)] : [404, { code: 'CLIENT_NOT_FOUND', message: 'Danışan bulunamadı.' }]
  })
}

module.exports = { registerClientHandlers }
