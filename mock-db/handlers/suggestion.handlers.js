const db = require('../db')
const { listMeta } = require('../helpers')

function registerSuggestionHandlers(mock) {
  mock.onGet('/suggestions').reply((config) => {
    const audience = config.params?.audience ?? ''
    const result = audience
      ? db.suggestions.filter((s) => s.audience === audience || s.audience === 'all')
      : db.suggestions
    return [200, { data: result, meta: listMeta(result) }]
  })
}

module.exports = { registerSuggestionHandlers }
