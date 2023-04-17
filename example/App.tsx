import * as ExpoPusherBeams from '@threls/expo-pusher-beams';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useEffect(() => {
    console.log('Register debug listener', ExpoPusherBeams.hello());
    ExpoPusherBeams.addDebugListener((event) => {
      console.log('We got an event', event);
    });

    ExpoPusherBeams.setValueAsync('Groot').then(() =>
      console.log('Resolved groot')
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>{ExpoPusherBeams.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
