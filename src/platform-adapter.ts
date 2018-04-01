import { IdentifyMessage, TrackMessage } from './models'

export interface PlatformAdatper {
  onTrack(message: TrackMessage): void
  onIdentify(message: IdentifyMessage): void
  /** Return type not defined yet */
  onFlush(): Promise<any>
}
