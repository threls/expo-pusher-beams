import { StyleSheet, Text, View } from 'react-native';

import * as ExpoPusherBeams from '@threls/expo-pusher-beams';

export default function App() {
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
