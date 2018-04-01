import { AnalyticsProvider, IDs } from './models'
import { TrackingPlan, TypeOfProps } from './tracking-plan'

export class AnalyticsUser<T extends TrackingPlan> {
  constructor(
    private provider: AnalyticsProvider,
    public ids: IDs,
    private trackingPlan?: T,
  ) {}

  public identify(traits: TypeOfProps<T['traits']>) {
    if (this.trackingPlan) {
      traits = this.trackingPlan.validateTraits(traits) as any
      if (!traits) {
        return
      }
    }
    this.provider.onIdentify({
      traits,
      ...this.ids,
      type: 'identify',
    })
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
    let message = { event, properties }
    if (this.trackingPlan) {
      message = this.trackingPlan.validateEvent(message) as any
      if (!message) {
        return
      }
    }
    this.provider.onTrack({
      ...message,
      ...this.ids,
      type: 'track',
    })
    return this
  }
}
