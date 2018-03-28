export interface Config {
  segmentWriteKey: string
  debug?: boolean
}

export interface Properties {
  [key: string]: any
}

export interface AnalyticsProvider {
  track(userId: string, event: string, properties: Properties): this
  identify(userId: string, traits: Properties): this
  /** Return type not defined yet */
  flush(): Promise<any>
}
