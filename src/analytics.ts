import { AnalyticsUser } from './analytics-user'
import { Context, IDs, Message, PlatformAdatper } from './models'
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
  onMessage?: (message: Message) => void
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
    return new AnalyticsUser(
      ids,
      msg => this.enqueueMessage(msg),
      this.validator,
      ctx,
    )
  }

  public enqueueMessage(message: Message) {
    switch (message.type) {
      case 'track':
        this.adapter.onTrack(message)
        break
      case 'identify':
        this.adapter.onIdentify(message)
        break
      default:
        // Should not happen in theory, but JS is dynamic...
        return this.error(
          `Unexpected analytics message type="${message &&
            (message as any).type}"`,
        )
    }
    if (this.config.onMessage) {
      this.config.onMessage(message)
    }
  }

  // TODO: Add some tests
  public async flush() {
    return this.adapter.onFlush()
  }

  private error(msg: string) {
    if (this.config.debug) {
      throw new AnalyticsError(msg)
    }
    // tslint:disable-next-line no-console
    console.warn('[analytics]', msg)
  }
}

// tslint:disable-next-line max-classes-per-file
export class AnalyticsError extends Error {}
