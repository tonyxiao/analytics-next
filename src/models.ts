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
