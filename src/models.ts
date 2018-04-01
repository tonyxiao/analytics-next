export interface IDs {
  userId?: string
  anonymousId?: string
}

export interface BaseMessage extends IDs {
  type: 'track' | 'identify'
}

export interface TrackMessage extends BaseMessage {
  type: 'track'
  event: string
  properties: Properties
}

export interface IdentifyMessage extends BaseMessage {
  type: 'identify'
  traits: Properties
}

export interface Properties {
  [k: string]: any
}

export interface PlatformAdatper {
  onTrack(message: TrackMessage): void
  onIdentify(message: IdentifyMessage): void
  /** Return type not defined yet */
  onFlush(): Promise<any>
}

/**
 * If you were to use JavaScript rather than TypeScript, or otherwise don't
 * care about compile-time type safety, this is the only interface you will need to
 * implement - and the only one that `Analytics` class at runtime actually cares about
 */
export interface UntypedTrackingPlan {
  /**
   * Validates and cleans a set of traits
   */
  validateIdentify(message: IdentifyMessage): IdentifyMessage | null
  /**
   * Validate and cleans the event
   * @returns
   *  - `null` to swallow the event and prevent it from sending
   *  - `EventValue` with a a possibly modified version of the event to allow it to send
   */
  validateTrack(message: TrackMessage): TrackMessage | null
}
