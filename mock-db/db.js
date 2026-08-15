const auth = require('./data/auth.json')
const experts = require('./data/experts.json')
const reviews = require('./data/reviews.json')
const clients = require('./data/clients.json')
const listings = require('./data/listings.json')
const matches = require('./data/matches.json')
const offers = require('./data/offers.json')
const assessment = require('./data/assessment.json')
const assessmentResults = require('./data/assessment-results.json')
const packages = require('./data/packages.json')
const blogs = require('./data/blogs.json')
const suggestions = require('./data/suggestions.json')
const categories = require('./data/categories.json')
const notifications = require('./data/notifications.json')
const wallet = require('./data/wallet.json')

const blogLikes = Object.fromEntries(blogs.map((b) => [b.id, b.likeCount]))
const likedBlogIds = new Set()

function expertReviewsOf(expertId) {
  return reviews.filter((r) => r.expertId === expertId)
}

function expertRatingOf(expertId) {
  const items = expertReviewsOf(expertId)
  if (items.length === 0) return { rating: 0, reviewCount: 0 }
  const sum = items.reduce((acc, r) => acc + r.rating, 0)
  return { rating: Math.round((sum / items.length) * 10) / 10, reviewCount: items.length }
}

module.exports = {
  auth,
  experts,
  reviews,
  clients,
  listings,
  matches,
  offers,
  assessment,
  assessmentResults,
  packages,
  blogs,
  suggestions,
  categories,
  notifications,
  wallet,
  blogLikes,
  likedBlogIds,
  expertReviewsOf,
  expertRatingOf,
}
