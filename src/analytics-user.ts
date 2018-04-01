import { IdentifyMessage, IDs, PlatformAdatper, TrackMessage } from './models'
import { TrackingPlan, TypeOfProps } from './tracking-plan'

export class AnalyticsUser<T extends TrackingPlan> {
  constructor(
    public ids: IDs,
    private adapter: PlatformAdatper,
    private trackingPlan?: T,
  ) {}

  public identify(traits: TypeOfProps<T['traits']>) {
    let message: IdentifyMessage | null = {
      traits,
      ...this.ids,
      type: 'identify',
    }
    if (this.trackingPlan) {
      message = this.trackingPlan.validateIdentify(message)
      if (!message) {
        return
      }
    }
    this.adapter.onIdentify(message)
    return this
  }

  /**
   * Tracks event on the currently identified user
   * The second argument is optional, however we are not able to add `?` to it
   * due to type-safety and language constraints - optional 2nd argument opens up the backdoor
   * that one could miss passing props to events which actually require props
   */
  public track<E extends keyof T['events']>(
    event: E,
    properties: TypeOfProps<T['events'][E]>,
  ) {
    let message: TrackMessage | null = {
      ...this.ids,
      event,
      properties,
      type: 'track',
    }
    if (this.trackingPlan) {
      message = this.trackingPlan.validateTrack(message)
      if (!message) {
        return
      }
    }
    this.adapter.onTrack(message)
    return this
  }
}
