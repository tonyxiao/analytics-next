import * as t from 'io-ts';

export { t }

interface NoPropsType {
  [key: string]: t.Type<never>
}

type AnyOrNoProps = NoPropsType | t.AnyProps
export type TypeOfProps<P extends AnyOrNoProps> = { [K in keyof P]: P[K]['_A'] }

interface PropertiesValue {
  [k: string]: any
}
interface EventValue {
  event: string
  properties: PropertiesValue
}

/** Runtype type for  */
export type Traits = AnyOrNoProps
export interface Events {
  [eventName: string]: AnyOrNoProps
}

/**
 * If you were to use JavaScript rather than TypeScript, or otherwise don't
 * care about compile-time type safety, this is the only interface you will need to
 * impelement
 */
interface SchemaValidator {
  /**
   * Validates and cleans a set of traits
   */
  validateTraits(traits: PropertiesValue): PropertiesValue | null
  /**
   * Validate and cleans the event
   * @returns
   *  - `null` to swallow the event and prevent it from sending
   *  - `EventValue` with a a possibly modified version of the event to allow it to send
   */
  validateEvent(event: EventValue): EventValue | null
}

export const NoProps: NoPropsType = {}

/**
 * This is a TypeScript implementation of `SchemaValidator` which allows for both
 * compile time and runtime type validation
 */
export class TrackingPlan<T extends Traits = Traits, E extends Events = Events>
  implements SchemaValidator {
  public debug = false

  constructor(public traits: T, public events: E) {}

  public validateTraits(traits: PropertiesValue) {
    // TODO: Pre-compile validators once so we dont' need to re-run every time
    const res = t.type(this.traits as any).decode(traits)
    if (res.isLeft()) {
      // TODO: Add io-ts reporters to say exactly what's not valid
      return this.error(`Traits are not valid`)
    }
    return res.value
  }

  public validateEvent({ event, properties }: EventValue) {
    if (event in this.events === false) {
      return this.error(`'${event}' not found in tracking plan`)
    }
    // TODO: Make sure to handle NoProps case
    const res = t.type(this.events[event] as any).decode(properties)
    if (res.isLeft()) {
      // TODO: Add io-ts reporters to say exactly what's not valid
      return this.error(`${event} properties are not valid`)
    }
    return { event, properties: res.value }
  }

  private error(msg: string) {
    if (this.debug) {
      throw new TrackingPlanError(msg)
    }
    return null
  }
}

// tslint:disable-next-line
class TrackingPlanError extends Error {}
