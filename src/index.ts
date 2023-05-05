import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoPusherBeams.web.ts
// and on native platforms to ExpoPusherBeams.ts
import { NotificationEventPayload } from './ExpoPusherBeams.types';
import ExpoPusherBeamsModule from './ExpoPusherBeamsModule';

export async function setInstanceId(id: string) {
  return await ExpoPusherBeamsModule.setInstanceId(id);
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

export function addNotificationListener(
  listener: (event: NotificationEventPayload) => void
): Subscription {
  return emitter.addListener<NotificationEventPayload>(
    'onNotification',
    listener
  );
}

export { NotificationEventPayload };
