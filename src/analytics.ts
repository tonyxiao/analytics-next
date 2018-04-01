import { AnalyticsUser } from './analytics-user'
import { PlatformAdatper } from './platform-adapter'
import { NodeAdapter } from './platform-adapters'
import { TrackingPlan } from './tracking-plan'

export interface Config<T extends TrackingPlan> {
  segmentWriteKey: string
  trackingPlan?: T
  debug?: boolean
}

export class Analytics<T extends TrackingPlan> {
  private adapter: PlatformAdatper
  private trackingPlan?: T

  constructor(private config: Config<T>) {
    // TODO: Validate config here...
    // TODO: Switch provider impl. depending on whether we are on mobile, web or server
    // TODO: Make the interface slightly more generic and not depend on segment
    this.adapter = new NodeAdapter(config)
    this.trackingPlan = config.trackingPlan
    if (config.debug && this.trackingPlan) {
      this.trackingPlan.debug = config.debug
    }
  }

  public user(userId: string) {
    return new AnalyticsUser({ userId }, this.adapter, this.trackingPlan)
  }

  public anon(anonymousId: string) {
    return new AnalyticsUser({ anonymousId }, this.adapter, this.trackingPlan)
  }

  // TODO: Add some tests
  public async flush() {
    return this.adapter.onFlush()
  }
}
