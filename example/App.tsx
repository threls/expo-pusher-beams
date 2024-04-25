import * as ExpoPusherBeams from '@threls/expo-pusher-beams';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [value, setValue] = useState(Date.now());
  const initialised = useRef<boolean>(false);

  const init = async () => {
    console.log('INIT', initialised.current);
    if (!initialised.current) {
      try {
        console.log('Trying to set instance');
        // Android - awaiting this results in blocking
        await ExpoPusherBeams.setInstanceId(
          '8f16b43e-3f47-4bf8-99b0-cd09c8514327'
        );
        console.log('Instance is set');
        initialised.current = true;

        await ExpoPusherBeams.addNotificationListener((ev) => {
          console.log('Notification', typeof ev, ev);
        });

        console.log('Subscribing');
        await ExpoPusherBeams.subscribe('debug-hello')
          .then(() => {
            console.log('Subscribed');
          })
          .catch((reason) => {
            console.error('Error subscribing', reason);
          });
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    setInterval(() => {
      setValue(Date.now());
    }, 1000);
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
      <Text>{value}</Text>
      <Text>cd09c8514327</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f00',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
