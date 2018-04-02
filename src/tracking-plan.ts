import * as t from 'io-ts'
// tslint:disable-next-line no-submodule-imports
import { PathReporter } from 'io-ts/lib/PathReporter'
import { inspect } from 'util'

import {
  Context,
  IdentifyMessage,
  Integrations,
  SchemaValidator,
  TrackMessage,
} from './models'

export { t }
export interface NeverProps {
  [key: string]: t.Type<never>
}
/** We need this to as a workaround to accomodate `NeverProps` type */
export type AnyOrNeverProps = NeverProps | t.AnyProps
export type TypeOfProps<P extends AnyOrNeverProps> = {
  [K in keyof P]: P[K]['_A']
}

/** Runtype type for traits */
export type Traits = AnyOrNeverProps

/** Runtime type for events */
export interface Events {
  [eventName: string]: AnyOrNeverProps
}

export const NoProps: NeverProps = {}

/**
 * This is a TypeScript implementation of `SchemaValidator` which allows for both
 * compile time and runtime type validation
 */
export class TrackingPlan<T extends Traits = Traits, E extends Events = Events>
  implements SchemaValidator {
  public debug = false
  public traits: T
  public events: E

  constructor(options: { traits: T; events: E }) {
    this.traits = options.traits
    this.events = options.events
  }

  public validateIdentify(message: IdentifyMessage) {
    // TODO: Figure out how to handle this directly in io-ts
    // via properly understanding strict type
    for (const name of Object.keys(message.traits)) {
      if (name in this.traits === false) {
        return this.error(`Trait not allowed: '${name}'`)
      }
      if (message.traits[name] === undefined) {
        delete message.traits[name]
      }
    }
    // TODO: Pre-compile validators once so we dont' need to re-run every time
    const res = t.partial(this.traits as any).decode(message.traits)
    if (res.isLeft()) {
      // TODO: Add io-ts reporters to say exactly what's not valid
      return this.error(`Traits are not valid ${inspect(message.traits)}`, res)
    }
    return {
      ...message,
      traits: res.value,
    }
  }

  public validateTrack(message: TrackMessage) {
    const { event, properties } = message
    if (event in this.events === false) {
      return this.error(`'${event}' not found in tracking plan`)
    }
    for (const name of Object.keys(message.properties)) {
      if (name in this.events[event] === false) {
        return this.error(`Event '${event}' property not allowed: '${name}'`)
      }
      if (message.properties[name] === undefined) {
        delete message.properties[name]
      }
    }
    // TODO: Make sure to handle NoProps case
    const res = t.type(this.events[event] as any).decode(properties)
    if (res.isLeft()) {
      // TODO: Add io-ts reporters to say exactly what's not valid
      return this.error(
        `'${event}' properties are not valid ${inspect(message.properties)}`,
        res,
      )
    }
    return {
      ...message,
      properties: res.value,
    }
  }

  private error(msg: string, validation?: t.Validation<any>) {
    if (this.debug) {
      throw new TrackingPlanError(msg, validation)
    }
    // tslint:disable-next-line no-console
    console.warn('[analytics]', msg)
    return null
  }
}

// tslint:disable-next-line max-classes-per-file
export class TrackingPlanError extends Error {
  constructor(message: string, validation?: t.Validation<any>) {
    if (!validation) {
      super(message)
      return
    }
    const errorMsg = PathReporter.report(validation).join('\n')
    super(`${message}:\n\t${errorMsg}`)
  }
}
