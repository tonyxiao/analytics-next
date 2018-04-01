// Polyfill for variables that do not exist on RN
// TODO: PR upstream to remove hard dependency on these
import 'assert'

import { Buffer } from 'buffer'

import { PlatformAdatper } from '../models'

global.Buffer = Buffer
global.process = {
  versions: {
    node: 'react-native',
  },
  env: {},
} as any

export interface SegmentConfig {
  segmentWriteKey: string
  debug?: boolean
}

export interface ReactNativeAdapter extends PlatformAdatper {
  new (config: SegmentConfig): this
}

// We use explicit require here to prevent babel (and its friends)
// from hoisting the statement
// tslint:disable-next-line no-var-requires
export const ReactNativeAdapter: ReactNativeAdapter = require('./node-adapter')
  .NodeAdapter
