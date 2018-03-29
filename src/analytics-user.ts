import {
  AnalyticsProvider,
  Event,
  Events,
  IDs,
  Properties,
  TrackingPlan,
  TrackMessage,
} from './models'

export class AnalyticsUser<E extends Events, T extends Properties> {
  public readonly ids: IDs
  public readonly anonymousId?: string
  private analytics: AnalyticsProvider

  constructor(analytics: AnalyticsProvider, ids: IDs) {
    this.analytics = analytics
    this.ids = ids
  }

  public track(event: E) {
    const eventObject = typeof event === 'string' ? { event } : event
    this.analytics.onTrack({
      ...this.ids,
      type: 'track',
      event: (eventObject as Event<string, {}>).event,
      properties: (eventObject as Event<string, {}>).properties || {},
    })
    return this
  }

  public identify(traits: T) {
    this.analytics.onIdentify({
      ...this.ids,
      traits,
      type: 'identify',
    })
    return this
  }
}
