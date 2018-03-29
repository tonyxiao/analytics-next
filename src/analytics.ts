import { AnalyticsUser } from './analytics-user';
import { AnalyticsProvider, Events, Properties, TrackingPlan } from './models';
import { NodeProvider } from './providers';

export interface Config<TP extends TrackingPlan<Events, Properties>> {
  segmentWriteKey: string
  trackingPlan?: TP
  debug?: boolean
}

export class Analytics<E extends Events, T extends Properties> {
  private provider: AnalyticsProvider

  constructor(private config: Config<TrackingPlan<E, T>>) {
    // TODO: Validate config here...
    // TODO: Switch provider impl. depending on whether we are on mobile, web or server
    this.provider = new NodeProvider(config)
  }

  public user(userId: string) {
    return new AnalyticsUser<E, T>(this.provider, { userId })
  }

  public anon(anonymousId: string) {
      return new AnalyticsUser<E, T>(this.provider, { anonymousId })
  }

  // TODO: Add some tests
  public async flush() {
    return this.provider.onFlush()
  }
}
