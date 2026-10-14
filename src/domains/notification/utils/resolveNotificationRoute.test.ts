import { NOTIFICATIONS_ROUTE, resolveNotificationRoute } from './resolveNotificationRoute'

const ID = '0b8f3c6e-1d2a-4f5b-9c8d-7e6f5a4b3c2d'

describe('resolveNotificationRoute', () => {
  it.each([
    ['OFFER_RECEIVED', ID, `/listing/${ID}`],
    ['OFFER_ACCEPTED', ID, `/match/${ID}`],
    ['LISTING_EXPIRING', ID, `/listing/${ID}`],
    ['LISTING_APPROVED', ID, `/listing/${ID}`],
    ['LISTING_REJECTED', ID, `/listing/${ID}`],
    ['EXPERT_APPROVED', null, '/(tabs)'],
    ['EXPERT_REJECTED', null, '/profile/professional'],
    ['REVIEW_APPROVED', null, NOTIFICATIONS_ROUTE],
    ['SYSTEM', null, NOTIFICATIONS_ROUTE],
  ])('%s → route', (type, entityId, expected) => {
    expect(resolveNotificationRoute({ type, entityId })).toBe(expected)
  })

  it('falls back to the tab when the entity id is missing (in-app list rows)', () => {
    expect(resolveNotificationRoute({ type: 'OFFER_RECEIVED' })).toBe('/(tabs)/offers')
    expect(resolveNotificationRoute({ type: 'OFFER_ACCEPTED', entityId: null })).toBe(
      '/(tabs)/matches'
    )
  })

  it('opens the notification list for unknown or malformed data', () => {
    expect(resolveNotificationRoute({ type: 'SOMETHING_NEW', entityId: ID })).toBe(
      NOTIFICATIONS_ROUTE
    )
    expect(resolveNotificationRoute(undefined)).toBe(NOTIFICATIONS_ROUTE)
    expect(resolveNotificationRoute('x')).toBe(NOTIFICATIONS_ROUTE)
  })
})
