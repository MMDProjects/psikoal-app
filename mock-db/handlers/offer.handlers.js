const db = require('../db')
const {
  uuid,
  now,
  fullNameOf,
  initialsFromName,
  maskFullName,
  listMeta,
  toArrayParam,
  relativeTimeTR,
} = require('../helpers')

function serveOffer(offer) {
  const listing = db.listings.find((l) => l.id === offer.listingId)
  const embeddedListing = offer.listing
    ? {
        ...offer.listing,
        city: listing?.city ?? offer.listing.city,
        client: listing?.client
          ? { ...listing.client, initials: initialsFromName(listing.client.fullName) }
          : offer.listing.client,
        clientDisplayName: listing?.client ? maskFullName(listing.client.fullName) : undefined,
      }
    : offer.listing
  const embeddedExpert = offer.expert
    ? { ...offer.expert, initials: initialsFromName(offer.expert.name) }
    : offer.expert
  return {
    ...offer,
    listing: embeddedListing,
    expert: embeddedExpert,
    createdAtRelative: relativeTimeTR(offer.createdAt),
  }
}

function registerOfferHandlers(mock) {
  mock.onGet('/offers/my').reply((config) => {
    const statusFilter = toArrayParam(config.params?.status)
    const myOffers = db.offers.filter((o) => o.expertId === db.auth.expertUser.id)
    const filtered = statusFilter.length > 0 ? myOffers.filter((o) => statusFilter.includes(o.status)) : myOffers
    const result = filtered.map(serveOffer)
    return [200, {
      data: result,
      meta: listMeta(result, {
        pendingCount: myOffers.filter((o) => o.status === 'PENDING').length,
      }),
    }]
  })

  mock.onGet(/\/offers\/[\w-]+$/).reply((config) => {
    const lastSegment = config.url.split('/').pop()
    if (lastSegment === 'my') return [404]
    const offer = db.offers.find((o) => o.id === lastSegment)
    if (!offer) return [404, { code: 'OFFER_NOT_FOUND', message: 'Teklif bulunamadı.' }]
    return [200, serveOffer(offer)]
  })

  mock.onPost('/offers').reply((config) => {
    const body = JSON.parse(config.data)
    const listing = db.listings.find((l) => l.id === body.listingId)
    const expertRecord = db.experts.find((e) => e.id === db.auth.expertUser.id)
    const { rating } = db.expertRatingOf(db.auth.expertUser.id)
    const newOffer = {
      id: uuid(),
      listingId: body.listingId,
      expertId: db.auth.expertUser.id,
      title: body.title ?? undefined,
      price: body.price,
      description: body.description ?? '',
      sessionType: body.sessionType,
      status: 'PENDING',
      createdAt: now(),
      listing: listing
        ? { id: listing.id, title: listing.title, clientId: listing.clientId }
        : null,
      expert: {
        id: db.auth.expertUser.id,
        name: fullNameOf(db.auth.expertUser),
        title: expertRecord?.title ?? '',
        avatarUrl: db.auth.expertUser.avatarUrl,
        rating,
      },
    }
    return [201, serveOffer(newOffer)]
  })

  mock.onPost(/\/offers\/[\w-]+\/accept/).reply((config) => {
    const offerId = config.url.split('/').slice(-2, -1)[0]
    const offer = db.offers.find((o) => o.id === offerId)
    if (!offer) return [404, { code: 'OFFER_NOT_FOUND', message: 'Teklif bulunamadı.' }]
    const newMatchId = uuid()
    const acceptedOffer = { ...offer, status: 'ACCEPTED', matchId: newMatchId }
    const newMatch = {
      id: newMatchId,
      listingId: offer.listingId,
      acceptedOfferId: offerId,
      clientId: db.auth.clientUser.id,
      expertId: offer.expertId,
      status: 'ACTIVE',
      createdAt: now(),
      client: {
        id: db.auth.clientUser.id,
        fullName: fullNameOf(db.auth.clientUser),
        initials: initialsFromName(fullNameOf(db.auth.clientUser)),
      },
      expert: offer.expert ?? null,
    }
    return [200, { offer: serveOffer(acceptedOffer), match: newMatch }]
  })

  mock.onPost(/\/offers\/[\w-]+\/reject/).reply((config) => {
    const offerId = config.url.split('/').slice(-2, -1)[0]
    const offer = db.offers.find((o) => o.id === offerId)
    if (!offer) return [404, { code: 'OFFER_NOT_FOUND', message: 'Teklif bulunamadı.' }]
    return [200, serveOffer({ ...offer, status: 'REJECTED' })]
  })

  mock.onPost(/\/offers\/[\w-]+\/withdraw/).reply((config) => {
    const offerId = config.url.split('/').slice(-2, -1)[0]
    const offer = db.offers.find((o) => o.id === offerId)
    if (!offer) return [404, { code: 'OFFER_NOT_FOUND', message: 'Teklif bulunamadı.' }]
    return [200, serveOffer({ ...offer, status: 'WITHDRAWN' })]
  })
}

module.exports = { registerOfferHandlers, serveOffer }
