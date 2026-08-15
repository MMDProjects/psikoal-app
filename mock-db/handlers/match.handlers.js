const db = require('../db')
const { initialsFromName, listMeta, toArrayParam, relativeTimeTR } = require('../helpers')

const PAST_STATUSES = ['COMPLETED', 'RELEASED']

function serveMatch(match) {
  const { serveListing } = require('./listing.handlers')
  const { serveOffer } = require('./offer.handlers')
  const listing = db.listings.find((l) => l.id === match.listingId)
  const offer = db.offers.find((o) => o.id === match.acceptedOfferId)
  return {
    ...match,
    client: match.client
      ? { ...match.client, initials: initialsFromName(match.client.fullName) }
      : match.client,
    expert: match.expert
      ? { ...match.expert, initials: initialsFromName(match.expert.name) }
      : match.expert,
    listing: listing ? serveListing(listing) : null,
    offer: offer ? serveOffer(offer) : null,
    createdAtRelative: relativeTimeTR(match.createdAt),
  }
}

function userMatches() {
  return db.matches.filter(
    (m) => m.clientId === db.auth.clientUser.id || m.expertId === db.auth.expertUser.id,
  )
}

function registerMatchHandlers(mock) {
  mock.onGet('/match/active').reply(() => {
    const activeMatch = userMatches().find((m) => m.status === 'ACTIVE')
    return activeMatch ? [200, serveMatch(activeMatch)] : [200, null]
  })

  mock.onGet(/\/matches\/[\w-]+$/).reply((config) => {
    const id = config.url.split('/').pop()
    const match = db.matches.find((m) => m.id === id)
    if (!match) return [404, { code: 'MATCH_NOT_FOUND', message: 'Eşleşme bulunamadı.' }]
    return [200, serveMatch(match)]
  })

  mock.onGet('/matches').reply((config) => {
    const statusFilter = toArrayParam(config.params?.status)
    const all = userMatches()
    const filtered = statusFilter.length > 0 ? all.filter((m) => statusFilter.includes(m.status)) : all
    const result = filtered.map(serveMatch)
    return [200, {
      data: result,
      meta: listMeta(result, {
        activeCount: all.filter((m) => m.status === 'ACTIVE').length,
        pastCount: all.filter((m) => PAST_STATUSES.includes(m.status)).length,
      }),
    }]
  })

  mock.onPost(/\/match\/[\w-]+\/release/).reply((config) => {
    const matchId = config.url.split('/').slice(-2, -1)[0]
    const match = db.matches.find((m) => m.id === matchId)
    if (!match) return [404, { code: 'MATCH_NOT_FOUND', message: 'Eşleşme bulunamadı.' }]
    if (match.status !== 'ACTIVE') {
      return [409, { code: 'MATCH_NOT_ACTIVE', message: 'Yalnızca aktif eşleşmeler sonlandırılabilir.' }]
    }
    match.status = 'RELEASED'
    return [200, serveMatch(match)]
  })
}

module.exports = { registerMatchHandlers }
