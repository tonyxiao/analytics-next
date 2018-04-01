import * as React from 'react'
import { Button, Text, View } from 'react-native'
import { NavigationScreenProps, StackNavigator } from 'react-navigation'

import { DebugScreen } from './debug-screen'

class Screen extends React.Component<NavigationScreenProps> {
  public render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Showing screen: {this.props.navigation.state.routeName}</Text>
        <Button
          title="Next"
          onPress={() => {
            this.props.navigation.navigate('second')
          }}
        />
        <DebugScreen />
      </View>
    )
  }
}

export const StackNav = StackNavigator({
  first: {
    screen: Screen,
  },
  second: {
    screen: Screen,
  },
})
