import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <Text>TypeScript App</Text>
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
