import { AnalyticsUser } from './analytics-user'
import { Context, PlatformAdatper, IDs } from './models'
import { TrackingPlan } from './tracking-plan'

/**
 * We use `TrackingPlan` instead of Validator here for best compile
 * time error checking in TypeScript. All the type information goes away
 * in JavaScript so has no impact on JS code
 */
export interface Config<T extends TrackingPlan> {
  adapter: PlatformAdatper
  validator?: T
  debug?: boolean
}

export class Analytics<T extends TrackingPlan> {
  private adapter: PlatformAdatper
  private validator?: T

  constructor(private config: Config<T>) {
    // TODO: Validate config here...
    this.adapter = config.adapter
    this.validator = config.validator
    if (config.debug && this.validator) {
      this.validator.debug = config.debug
    }
  }

  public user(userId: string | IDs, context?: Context) {
    const ids = typeof userId === 'string' ? { userId } : userId
    return new AnalyticsUser(ids, this.adapter, this.validator, context)
  }

  // TODO: Add some tests
  public async flush() {
    return this.adapter.onFlush()
  }
}
