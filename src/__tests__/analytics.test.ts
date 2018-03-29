import { Analytics } from '../analytics';
import { envvar } from '../utils';
import { trackingPlan } from './test-tracking-plan';

const analytics = new Analytics({
  segmentWriteKey: envvar.string('SEGMENT_WRITEKEY'),
  debug: true,
  trackingPlan,
})

afterEach(async () => {
  expect.hasAssertions()
})

const userId = 'analytics-test-user-id'
const anonId = 'analytics-test-anon-id'

it('tracks event to segment', async () => {
  analytics.user(userId).track({
    event: 'Workspace Created',
    properties: { workspaceId: '1234' },
  })
  analytics.anon(anonId).track('Bug Reported')

  await expect(analytics.flush()).resolves.toBeTruthy()
})

it('identifies event to segment', async () => {
  analytics.user(userId).identify({
    email: 'test@test.com',
    createdAt: new Date(),
  })
  await expect(analytics.flush()).resolves.toBeTruthy()
})
