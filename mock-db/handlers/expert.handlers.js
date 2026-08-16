const db = require('../db')
const { uuid, fullNameOf, initialsFromName, listMeta, relativeTimeTR } = require('../helpers')

function serveExpert(expert) {
  const { rating, reviewCount } = db.expertRatingOf(expert.id)
  return {
    ...expert,
    rating,
    reviewCount,
    initials: initialsFromName(fullNameOf(expert)),
    acceptsOffers: expert.status === 'approved',
  }
}

function registerExpertHandlers(mock) {
  mock.onGet('/experts').reply((config) => {
    const search = config.params?.search?.toLowerCase() ?? ''
    const spec = config.params?.specialization ?? ''
    let result = db.experts.map(serveExpert)
    if (search) result = result.filter((e) => fullNameOf(e).toLowerCase().includes(search))
    if (spec) result = result.filter((e) => e.specializations.includes(spec))
    return [200, { data: result, meta: listMeta(result) }]
  })

  mock.onGet(/\/experts\/[\w-]+\/reviews/).reply((config) => {
    const id = config.url.split('/')[2]
    const expert = db.experts.find((e) => e.id === id)
    if (!expert) return [404, { code: 'EXPERT_NOT_FOUND', message: 'Uzman bulunamadı.' }]
    const result = db
      .expertReviewsOf(id)
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((r) => ({ ...r, createdAtRelative: relativeTimeTR(r.createdAt) }))
    return [200, result]
  })

  mock.onGet(/\/experts\/[\w-]+/).reply((config) => {
    const id = config.url.split('/').pop()
    const expert = db.experts.find((e) => e.id === id)
    return expert ? [200, serveExpert(expert)] : [404, { code: 'EXPERT_NOT_FOUND', message: 'Uzman bulunamadı.' }]
  })

  mock.onPost('/experts/profile').reply((config) => {
    const body = JSON.parse(config.data)
    return [201, {
      id: uuid(),
      ...body,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      status: 'pending',
      acceptsOffers: false,
    }]
  })

  mock.onPatch('/experts/profile').reply((config) => {
    const body = JSON.parse(config.data)
    const base = serveExpert(db.experts[0])
    return [200, { ...base, ...body }]
  })
}

module.exports = { registerExpertHandlers }
