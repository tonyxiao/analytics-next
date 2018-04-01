import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import { analytics } from './analytics'
import { StackNav } from './navigation'

export class App extends React.Component {
  public componentDidMount() {
    analytics.user('expo').track('App Launched', {
      sessionId: '1234567',
    })
  }
  public render() {
    return (
      <StackNav
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getCurrentRouteName(currentState)
          const prevScreen = getCurrentRouteName(prevState)

          if (prevScreen !== currentScreen) {
            // the line below uses the Google Analytics tracker
            // change the tracker here to use other Mobile analytics SDK.
            analytics.user('expo').track('Screen Viewed', {
              name: currentScreen,
            })
          }
        }}
      />
    )
  }
}

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route)
  }
  return route.routeName
}
