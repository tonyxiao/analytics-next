import { Analytics } from '../analytics'
import { NodeAdapter } from '../platform-adapters/node-adapter'
import { NoProps, t, TrackingPlan } from '../tracking-plan'
import { envvar } from './test-utils'

const traits = {
  email: t.string,
  cohort: t.string,
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

const plan = new TrackingPlan({ traits, events })

const analytics = new Analytics({
  adapter: new NodeAdapter({
    segmentWriteKey: envvar.string('SEGMENT_WRITEKEY'),
  }),
  validator: plan,
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
  analytics.user(userId).identify({
    cohort: 'april-2017',
  })
  await expect(analytics.flush()).resolves.toBeTruthy()
})

describe('while debugging', () => {
  it('throws for bad event', () => {
    expect(() => analytics.user(userId).track('Bad event' as any, {})).toThrow(
      "'Bad event' not found in tracking plan",
    )
  })

  it('throws for not allowed prop on event', () => {
    expect(() =>
      analytics.user(userId).track('Account Created', {
        id: 'aid-123',
        banana: 'money',
      } as any),
    ).toThrow("property not allowed: 'banana'")
  })

  it('throws for missing props on event', () => {
    expect(() =>
      analytics.user(userId).track('Account Created', {} as any),
    ).toThrow('properties are not valid')
  })

  it('throws for bad traits', () => {
    expect(() => analytics.user(userId).identify({ ssn: '1' } as any)).toThrow(
      "Trait not allowed: 'ssn'",
    )
  })
})
