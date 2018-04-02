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
  context?: Context
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

  public user(userId: string | IDs, context: Context = {}) {
    const ids = typeof userId === 'string' ? { userId } : userId
    const ctx = this.config.context
      ? { ...this.config.context, ...context }
      : context
    return new AnalyticsUser(ids, this.adapter, this.validator, ctx)
  }

  // TODO: Add some tests
  public async flush() {
    return this.adapter.onFlush()
  }
}
