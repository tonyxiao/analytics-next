import {
  Context,
  IdentifyMessage,
  IDs,
  Message,
  OptionalFields,
  TrackMessage,
} from './models'
import { TrackingPlan, TypeOfProps } from './tracking-plan'

export class AnalyticsUser<T extends TrackingPlan> {
  constructor(
    public ids: IDs,
    private enqueueMessage: (message: Message) => void,
    private validator?: T,
    private context: Context = {},
  ) {
    // TODO: Validate either userId or anonymousId exists
  }

  public identify(
    traits: Partial<TypeOfProps<T['traits']>>,
    opts: OptionalFields = {},
  ) {
    let message: IdentifyMessage | null = {
      ...opts,
      ...this.ids,
      context: {
        ...this.context,
        ...opts.context,
      },
      traits,
      type: 'identify',
    }
    if (this.validator) {
      message = this.validator.validateIdentify(message)
      if (!message) {
        return this
      }
    }
    this.enqueueMessage(message)
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
    opts: OptionalFields = {},
  ) {
    let message: TrackMessage | null = {
      ...opts,
      ...this.ids,
      context: {
        ...this.context,
        ...opts.context,
      },
      event: event as any,
      properties: properties as any,
      type: 'track',
    }
    if (this.validator) {
      message = this.validator.validateTrack(message!)
    }
    if (!message) {
      return this
    }
    this.enqueueMessage(message)
    return this
  }
}
