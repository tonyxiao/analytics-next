import { envvar } from './utils'

import {Analytics} from './analytics'

const analytics = new Analytics({
  segmentWriteKey: envvar.string('SEGMENT_WRITEKEY'),
  debug: true,
})

afterEach(async () => {
  expect.hasAssertions()
})

const userId = 'analytics-test-user-id'

it('tracks event to segment', async () => {
  analytics.user(userId).track('Test Event', {
    email: 'test@test.com',
    referralCode: 'CASH-123',
    referredBy: 'CASH-234',
  })
  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('identifies event to segment', async () => {
  analytics.user(userId).identify({
    email: 'test@test.com',
    createdAt: new Date(),
  })
  await expect(analytics.flush()).resolves.toBeTruthy()
})
