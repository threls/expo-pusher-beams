import * as ExpoPusherBeams from '@threls/expo-pusher-beams';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  useEffect(() => {
    console.log('Register debug listener');
    ExpoPusherBeams.addDebugListener((event) => {
      console.log('We got an event', event);
    });
  }, []);

  useEffect(() => {
    ExpoPusherBeams.setInstanceId('faec7487-fb5a-4e94-a93d-62c7f0d5c605');

    ExpoPusherBeams.subscribe('hello')
      .then(() => {
        console.log('Groot', 'Subscribed');
      })
      .catch((reason) => {
        console.error('Error subscribing', reason);
      });

    ExpoPusherBeams.addNotificationListener((ev) => {
      console.log('Notification', JSON.stringify(ev));
    });
  });

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
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
