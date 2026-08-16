const { registerAuthHandlers } = require('./auth.handlers')
const { registerExpertHandlers } = require('./expert.handlers')
const { registerClientHandlers } = require('./client.handlers')
const { registerListingHandlers } = require('./listing.handlers')
const { registerOfferHandlers } = require('./offer.handlers')
const { registerMatchHandlers } = require('./match.handlers')
const { registerAssessmentHandlers } = require('./assessment.handlers')
const { registerPaymentHandlers } = require('./payment.handlers')
const { registerBlogHandlers } = require('./blog.handlers')
const { registerCategoryHandlers } = require('./category.handlers')
const { registerSuggestionHandlers } = require('./suggestion.handlers')
const { registerNotificationHandlers } = require('./notification.handlers')

function setupMocks(mock) {
  registerAuthHandlers(mock)
  registerExpertHandlers(mock)
  registerClientHandlers(mock)
  registerListingHandlers(mock)
  registerMatchHandlers(mock)
  registerOfferHandlers(mock)
  registerAssessmentHandlers(mock)
  registerPaymentHandlers(mock)
  registerSuggestionHandlers(mock)
  registerCategoryHandlers(mock)
  registerBlogHandlers(mock)
  registerNotificationHandlers(mock)

  mock.onAny().reply((config) => {
    console.warn('[MOCK] Tanımsız endpoint:', config.method?.toUpperCase(), config.url)
    return [404, { code: 'NOT_FOUND', message: `Mock: ${config.url} için handler yok.` }]
  })
}

module.exports = { setupMocks }
