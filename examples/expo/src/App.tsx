// tslint:disable no-submodule-imports
import { Analytics } from 'analytics-next/build'
import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const analytics = new Analytics({
  segmentWriteKey: 'gvGMrg2HyyKPqOL0i6CLAH8tdnfb52uC',
})

export class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <Text>TypeScript App Actually working</Text>

        <Button
          title="track"
          onPress={() => {
            analytics.user('expo').track('my event', {})
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
