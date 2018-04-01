import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import { analytics } from './analytics'

export const DebugScreen: React.SFC = () => (
  <View style={styles.container}>
    <Text>TypeScript App Actually working</Text>

    <Button
      title="Expo Test Event"
      onPress={() => {
        analytics.user('expo').track('Expo Test Event', {})
      }}
    />

    <Button
      title="User Signed Up"
      onPress={() => {
        analytics.user('expo').track('User Signed Up', {
          channel: 'Facebook',
        })
      }}
    />

    <Button
      title="Identify"
      onPress={() => {
        analytics.user('expo').identify({
          email: 'test@test.com',
          age: 28,
        })
      }}
    />

    <Button
      title="Flush"
      onPress={() => {
        analytics.flush()
      }}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
