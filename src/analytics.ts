import { AnalyticsUser } from './analytics-user';
import { AnalyticsProvider } from './models';
import { NodeProvider } from './providers';
import { TrackingPlan } from './tracking-plan';

export interface Config<T extends TrackingPlan> {
  segmentWriteKey: string
  trackingPlan?: T
  debug?: boolean
}

export class Analytics<T extends TrackingPlan> {
  private provider: AnalyticsProvider
  private trackingPlan?: T

  constructor(private config: Config<T>) {
    // TODO: Validate config here...
    // TODO: Switch provider impl. depending on whether we are on mobile, web or server
    this.provider = new NodeProvider(config)
    this.trackingPlan = config.trackingPlan
    if (config.debug && this.trackingPlan) {
      this.trackingPlan.debug = config.debug
    }
  }

  public user(userId: string) {
    return new AnalyticsUser(this.provider, { userId }, this.trackingPlan)
  }

  public anon(anonymousId: string) {
      return new AnalyticsUser(this.provider, { anonymousId }, this.trackingPlan)
  }

  // TODO: Add some tests
  public async flush() {
    return this.provider.onFlush()
  }
}
