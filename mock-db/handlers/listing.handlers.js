const db = require('../db')
const {
  uuid,
  now,
  fullNameOf,
  initialsFromName,
  maskFullName,
  budgetLabelOf,
  relativeTimeTR,
  listMeta,
  toArrayParam,
} = require('../helpers')

function serveListing(listing) {
  return {
    ...listing,
    client: listing.client
      ? { ...listing.client, initials: initialsFromName(listing.client.fullName) }
      : undefined,
    clientDisplayName: listing.client ? maskFullName(listing.client.fullName) : undefined,
    budgetLabel: budgetLabelOf(listing.budgetMin, listing.budgetMax),
    createdAtRelative: relativeTimeTR(listing.createdAt),
  }
}

function sortListings(items, sort) {
  const sorted = items.slice()
  switch (sort) {
    case 'budget_desc': return sorted.sort((a, b) => b.budgetMax - a.budgetMax)
    case 'budget_asc':  return sorted.sort((a, b) => a.budgetMin - b.budgetMin)
    case 'offer_asc':   return sorted.sort((a, b) => a.offerCount - b.offerCount)
    case 'newest':
    default:            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

function registerListingHandlers(mock) {
  mock.onGet('/listings').reply((config) => {
    const specFilter = toArrayParam(config.params?.specialization)
    const sessionFilter = toArrayParam(config.params?.sessionType)
    const budgetMin = config.params?.budgetMin != null ? Number(config.params.budgetMin) : undefined
    const budgetMax = config.params?.budgetMax != null ? Number(config.params.budgetMax) : undefined
    const sort = config.params?.sort

    let result = db.listings.filter((l) => l.status === 'OPEN')
    if (specFilter.length > 0) {
      result = result.filter((l) => l.specialization.some((s) => specFilter.includes(s)))
    }
    if (sessionFilter.length > 0) {
      result = result.filter((l) => sessionFilter.includes(l.preferredSessionType))
    }
    if (budgetMin != null) result = result.filter((l) => l.budgetMax >= budgetMin)
    if (budgetMax != null) result = result.filter((l) => l.budgetMin <= budgetMax)

    const sorted = sortListings(result, sort).map(serveListing)
    return [200, { data: sorted, meta: listMeta(sorted) }]
  })

  mock.onGet('/listings/my').reply((config) => {
    const statusFilter = toArrayParam(config.params?.status)
    const myListings = db.listings.filter((l) => l.clientId === db.auth.clientUser.id)
    const filtered = statusFilter.length > 0 ? myListings.filter((l) => statusFilter.includes(l.status)) : myListings
    const result = sortListings(filtered, 'newest').map(serveListing)
    return [200, {
      data: result,
      meta: listMeta(result, {
        activeCount: myListings.filter((l) => l.status === 'OPEN').length,
      }),
    }]
  })

  mock.onGet(/\/listings\/[\w-]+\/offers/).reply((config) => {
    const { serveOffer } = require('./offer.handlers')
    const listingId = config.url.split('/').slice(-2, -1)[0]
    const listingOffers = db.offers.filter((o) => o.listingId === listingId).map(serveOffer)
    return [200, { data: listingOffers, meta: listMeta(listingOffers) }]
  })

  mock.onGet(/\/listings\/[\w-]+$/).reply((config) => {
    const lastSegment = config.url.split('/').pop()
    if (lastSegment === 'my') return [404]
    const listing = db.listings.find((l) => l.id === lastSegment)
    if (!listing) return [404, { code: 'LISTING_NOT_FOUND', message: 'İlan bulunamadı.' }]
    const viewerOffer = db.offers.find(
      (o) => o.listingId === listing.id && o.expertId === db.auth.expertUser.id,
    )
    return [200, {
      ...serveListing(listing),
      viewerHasOffered: Boolean(viewerOffer),
      viewerOfferId: viewerOffer?.id,
    }]
  })

  mock.onPost('/listings').reply((config) => {
    const body = JSON.parse(config.data)
    const newListing = {
      id: uuid(),
      clientId: db.auth.clientUser.id,
      client: { id: db.auth.clientUser.id, fullName: fullNameOf(db.auth.clientUser), avatarUrl: null },
      title: body.title,
      description: body.description ?? '',
      specialization: body.specialization ?? [],
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
      preferredSessionType: body.preferredSessionType,
      assessmentResultId: body.assessmentResultId ?? null,
      offerCount: 0,
      status: 'OPEN',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now(),
    }
    return [201, serveListing(newListing)]
  })

  mock.onPost(/\/listings\/[\w-]+\/close/).reply((config) => {
    const listingId = config.url.split('/').slice(-2, -1)[0]
    const listing = db.listings.find((l) => l.id === listingId)
    if (!listing) return [404, { code: 'LISTING_NOT_FOUND', message: 'İlan bulunamadı.' }]
    return [200, serveListing({ ...listing, status: 'CLOSED' })]
  })
}

module.exports = { registerListingHandlers, serveListing }
