import { Analytics } from '../analytics'
import { NodeAdapter } from '../platform-adapters/node-adapter'
import { envvar } from '../utils'

const analytics = new Analytics({
  adapter: new NodeAdapter({
    segmentWriteKey: envvar.string('SEGMENT_WRITEKEY'),
  }),
  debug: true,
})

afterEach(async () => {
  expect.hasAssertions()
})

const userId = 'analytics-test-user-id'
const anonId = 'analytics-test-anon-id'

it('tracks event to segment', async () => {
  analytics.user(userId).track('Workspace Created', {
    workspaceId: '1234',
  })
  analytics.anon(anonId).track('Bug Reported', {})

  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('identifies event to segment', async () => {
  analytics.user(userId).identify({
    email: 'test@test.com',
    createdAt: new Date(),
  })
  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('passes context', async () => {
  analytics
    .user(userId, {
      uniqueSession: 'session-unique-123',
    })
    .track('Event w/ Context', {})
  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('passes context and integrations per call', async () => {
  analytics.user(userId).track(
    'Event w/ Context In Call',
    {
      tranId: 'tran-1234',
    },
    {
      context: {
        callContext: 'call-context-333',
      },
      integrations: {
        mixpanel: false,
      },
    },
  )
  await expect(analytics.flush()).resolves.toBeTruthy()
})
