const db = require('../db')
const { listMeta } = require('../helpers')

function countExpertsForCategory(categoryName) {
  return db.experts.filter((e) => e.specializations.includes(categoryName)).length
}

function countCompletedMatchesForCategory(categoryName) {
  const listingById = Object.fromEntries(db.listings.map((l) => [l.id, l]))
  return db.matches.filter((m) => {
    if (m.status !== 'COMPLETED' && m.status !== 'RELEASED') return false
    const listing = listingById[m.listingId]
    return listing?.specialization?.includes(categoryName) ?? false
  }).length
}

function registerCategoryHandlers(mock) {
  mock.onGet('/categories').reply(() => {
    return [200, { data: db.categories, meta: listMeta(db.categories, { perPage: 50 }) }]
  })

  mock.onGet(/\/categories\/[\w-]+$/).reply((config) => {
    const slug = config.url.split('/').pop()
    const category = db.categories.find((c) => c.slug === slug)
    if (!category) return [404, { code: 'CATEGORY_NOT_FOUND', message: 'Kategori bulunamadı.' }]
    return [200, {
      ...category,
      expertCount: countExpertsForCategory(category.name),
      completedMatchCount: countCompletedMatchesForCategory(category.name),
    }]
  })
}

module.exports = { registerCategoryHandlers }
