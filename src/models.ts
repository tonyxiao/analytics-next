// ----- Tracking Plan models -----

export interface TrackingPlan<E extends Events, T extends Properties> {
  validateEvent?(event: E): boolean
  validateTraits?(traits: T): boolean
}

/** Typedef for a ngle, optional property */
export type Property<K extends string, V> = { [k in K]?: V }

/** Basically same as { [k: string]: any } */
export type Properties = Property<string, any>

/** Typdef for a single event */
export interface Event<E extends string, P extends Properties> {
  event: E
  properties: P
}

/** Space of all events */
export type Events = Event<string, {}> | string


// ---- Provider Models -----


export interface AnalyticsProvider {
  onTrack(message: TrackMessage): void
  onIdentify(message: IdentifyMessage): void
  /** Return type not defined yet */
  onFlush(): Promise<any>
}

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
  properties: JSONObject
}

export interface IdentifyMessage extends BaseMessage {
  type: 'identify'
  traits: JSONObject
}

interface JSONObject {
  [k: string]: any
}
