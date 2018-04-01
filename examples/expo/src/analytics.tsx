// tslint:disable no-submodule-imports
import { Analytics, NoProps, t, TrackingPlan } from 'analytics-next/build'
import { ReactNativeAdapter } from "analytics-next/build/platform-adapters/react-native-adapter";

const trackingPlan = new TrackingPlan({
  traits: {
    // username: t.string,
    age: t.number,
    email: t.string,
  },
  events: {
    'App Launched': {
      sessionId: t.string,
    },
    'Expo Test Event': NoProps,
    'User Signed Up': {
      channel: t.string,
    },
    'Screen Viewed': {
      name: t.string,
    },
  },
})

export const analytics = new Analytics({
  adapter: new ReactNativeAdapter({
    segmentWriteKey: 'gvGMrg2HyyKPqOL0i6CLAH8tdnfb52uC',
  }),
  validator: trackingPlan,
})
