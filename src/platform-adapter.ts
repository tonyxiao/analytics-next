export interface PlatformAdatper {
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
