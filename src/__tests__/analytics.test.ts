import { Analytics } from '../analytics'
import { envvar } from '../utils'

const analytics = new Analytics({
  segmentWriteKey: envvar.string('SEGMENT_WRITEKEY'),
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