import { promisify } from 'util'

import { AnalyticsProvider, IdentifyMessage, TrackMessage } from '../models'

import AnalyticsNode = require('analytics-node')
export interface SegmentConfig {
  segmentWriteKey: string
  debug?: boolean
}

export class NodeProvider implements AnalyticsProvider {
  private segment: AnalyticsNode

  constructor(config: SegmentConfig) {
    this.segment = new AnalyticsNode(config.segmentWriteKey, {
      flushAt: config.debug ? 0 : 20, // After 20 events
      flushAfter: 30, // After 30 seconds
    })
  }

  public onTrack(message: TrackMessage) {
    this.segment.track({
      userId: message.userId!,
      anonymousId: message.anonymousId!,
      event: message.event,
      properties: message.properties,
    } as any)
    return this
  }

  public onIdentify(message: IdentifyMessage) {
    this.segment.identify({
      userId: message.userId!,
      traits: message.traits,
    })
    return this
  }

  // TODO: Add some tests
  public async onFlush() {
    return promisify(this.segment.flush)
  }
}
