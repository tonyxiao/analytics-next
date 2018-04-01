import AnalyticsNode = require('analytics-node')
import { promisify } from 'es6-promisify'

import { SegmentConfig } from '.'
import { IdentifyMessage, PlatformAdatper, TrackMessage } from '../models'

export class NodeAdapter implements PlatformAdatper {
  private segment: AnalyticsNode
  private context = {
    library: {
      name: 'analytics-next',
      version: require('../../package.json').version,
    },
  }

  constructor(config: SegmentConfig) {
    const { segmentWriteKey, ...options } = config
    this.segment = new AnalyticsNode(segmentWriteKey, options)
  }

  public onTrack(message: TrackMessage) {
    this.segment.track({
      userId: message.userId!,
      anonymousId: message.anonymousId!,
      event: message.event,
      properties: message.properties,
      context: {
        ...this.context,
        ...message.context,
      },
      integrations: message.integrations,
    } as any)
    return this
  }

  public onIdentify(message: IdentifyMessage) {
    this.segment.identify({
      userId: message.userId!,
      traits: message.traits,
      context: {
        ...this.context,
        ...message.context,
      },
      integrations: message.integrations,
    })
    return this
  }

  // TODO: Add some tests
  public async onFlush() {
    return promisify(this.segment.flush)
  }
}
