import { AnalyticsUser } from './analytics-user'
import { PlatformAdatper } from './models'
import { NodeAdapter } from './platform-adapters'
import { TrackingPlan } from './tracking-plan'

/**
 * We use `TrackingPlan` instead of Validator here for best compile
 * time error checking in TypeScript. All the type information goes away
 * in JavaScript so has no impact on JS code
 */
export interface Config<T extends TrackingPlan> {
  segmentWriteKey: string
  validator?: T
  debug?: boolean
}

export class Analytics<T extends TrackingPlan> {
  private adapter: PlatformAdatper
  private validator?: T

  constructor(private config: Config<T>) {
    // TODO: Validate config here...
    // TODO: Switch provider impl. depending on whether we are on mobile, web or server
    // TODO: Make the interface slightly more generic and not depend on segment
    this.adapter = new NodeAdapter(config)
    this.validator = config.validator
    if (config.debug && this.validator) {
      this.validator.debug = config.debug
    }
  }

  public user(userId: string) {
    return new AnalyticsUser({ userId }, this.adapter, this.validator)
  }

  public anon(anonymousId: string) {
    return new AnalyticsUser({ anonymousId }, this.adapter, this.validator)
  }

  // TODO: Add some tests
  public async flush() {
    return this.adapter.onFlush()
  }
}
