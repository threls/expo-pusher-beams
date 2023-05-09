import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoPusherBeams.web.ts
// and on native platforms to ExpoPusherBeams.ts
import {
  NotificationEventPayload,
  NotificationEventPayloadAndroid,
  WebOptions,
} from './ExpoPusherBeams.types';
import ExpoPusherBeamsModule from './ExpoPusherBeamsModule';
import { Platform } from 'react-native';

export async function setInstanceId(id: string, webOptions?: WebOptions) {
  if (Platform.OS === 'web')
    return await ExpoPusherBeamsModule.setInstanceId(id, webOptions);
  else return await ExpoPusherBeamsModule.setInstanceId(id);
}

export async function subscribe(interest: string) {
  return await ExpoPusherBeamsModule.subscribe(interest);
}

export async function unsubscribe(interest: string) {
  return await ExpoPusherBeamsModule.unsubscribe(interest);
}

export async function clearAllState() {
  return await ExpoPusherBeamsModule.clearAllState();
}

export async function setUserId(userId: string, token: string) {
  return await ExpoPusherBeamsModule.setUserId(userId, token);
}

const emitter = new EventEmitter(
  ExpoPusherBeamsModule || NativeModulesProxy.ExpoPusherBeams
);

const isParsedEventPayload = (
  event: NotificationEventPayload | NotificationEventPayloadAndroid
): event is NotificationEventPayload => typeof event.userInfo !== 'string';

export function addNotificationListener(
  listener: (event: NotificationEventPayload) => void
): Subscription {
  return emitter.addListener<
    NotificationEventPayload | NotificationEventPayloadAndroid
  >('onNotification', (event) => {
    // Issue returning a nested object with Android. Therefore we are parsing the returned string into an object before calling any listeners
    if (!isParsedEventPayload(event)) {
      listener({
        ...event,
        userInfo: JSON.parse(
          event.userInfo
        ) as NotificationEventPayload['userInfo'],
      });
    } else {
      listener(event);
    }
  });
}

export function clearNotificationListeners() {
  emitter.removeAllListeners('onNotification');
}

export { NotificationEventPayload };
