import { Analytics } from '../analytics'
import { NoProps, t, TrackingPlan } from '../tracking-plan'
import { envvar } from '../utils'

const traits = {
  email: t.string,
}
const events = {
  'User Signed Up': {
    name: t.string,
    age: t.number,
  },
  'Account Created': {
    id: t.string,
  },
  'Song Started': NoProps,
}

const analytics = new Analytics({
  segmentWriteKey: envvar.string('SEGMENT_WRITEKEY'),
  trackingPlan: new TrackingPlan(traits, events),
  debug: true,
})

afterEach(async () => {
  expect.hasAssertions()
})

const userId = 'analytics-test-user-id'

it('tracks event with no props', async () => {
  analytics.user(userId).track('Song Started', {})

  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('tracks event to segment', async () => {
  analytics.user(userId).track('User Signed Up', {
    name: 'Tony',
    age: 28,
  })

  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('identifies event to segment', async () => {
  analytics.user(userId).identify({
    email: 'test@test.com',
  })
  await expect(analytics.flush()).resolves.toBeTruthy()
})

describe('while debugging', () => {
  it('throws for bad event', () => {
    expect(() => analytics.user(userId).track('Bad event' as any, {})).toThrow(
      "'Bad event' not found in tracking plan",
    )
  })

  it('throws for bad traits', () => {
    expect(() => analytics.user(userId).identify({ ssn: '1' } as any)).toThrow(
      'Traits are not valid',
    )
  })
})
