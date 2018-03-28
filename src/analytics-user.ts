import { AnalyticsProvider, Properties } from './models';

export interface AllowedTraits {
  createdAt?: Date
  email?: string
}

export class AnalyticsUser {
  public readonly userId: string
  private analytics: AnalyticsProvider

  constructor(analytics: AnalyticsProvider, userId: string) {
    this.analytics = analytics
    this.userId = userId
  }

  // TODO: Consider making identify private and only calling them from tracking plan events?
  public identify(traits: AllowedTraits) {
    this.analytics.identify(this.userId, traits)
    return this
  }

  public track(event: string, properties: Properties) {
    this.analytics.track(this.userId, event, properties)
    return this
  }
}
