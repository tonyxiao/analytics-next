import AnalyticsNode = require('analytics-node')
import { promisify } from 'util'

import { AnalyticsProvider, Config, Properties } from '../models'

export class NodeProvider implements AnalyticsProvider {
  private segment: AnalyticsNode

  constructor(config: Config) {
    this.segment = new AnalyticsNode(config.segmentWriteKey, {
      flushAt: config.debug ? 0 : 20, // After 20 events
      flushAfter: 30, // After 30 seconds
    })
  }

  public track(userId: string, event: string, properties: Properties) {
    this.segment.track({
      userId,
      event,
      properties,
    })
    return this
  }

  public identify(userId: string, traits: Properties) {
    this.segment.identify({
      userId,
      traits,
    })
    return this
  }

  // TODO: Add some tests
  public async flush() {
    return promisify(this.segment.flush)
  }
}
