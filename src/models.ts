export interface IDs {
  userId?: string
  anonymousId?: string
}

/** Mainly used in client side to collect additional info about user */
export interface Context {
  [k: string]: any
}

/** Enable / disable specifci segment integrations */
export interface Integrations {
  [name: string]: any
}

export interface OptionalFields {
  // Following fields would be auto-populated by analytics-node
  // if they don't exist
  context?: Context
  timestamp?: Date
  messageId?: string
  integrations?: Integrations
}

export interface BaseMessage extends IDs, OptionalFields {
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

export type Message = TrackMessage | IdentifyMessage

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
 * implement - and the only one that `Analytics` class at runtime actually cares about.
 * IF you are using TypeScript though, check out TrackingPlan
 */
export interface SchemaValidator {
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
