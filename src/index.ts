import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoPusherBeams.web.ts
// and on native platforms to ExpoPusherBeams.ts
import {
  DebugEventPayload,
  NotificationEventPayload,
} from './ExpoPusherBeams.types';
import ExpoPusherBeamsModule from './ExpoPusherBeamsModule';

export function setInstanceId(id: string): void {
  ExpoPusherBeamsModule.setInstanceId(id);
}

export async function subscribe(interest: string) {
  return await ExpoPusherBeamsModule.subscribe(interest);
}

export async function unsubscribe(interest: string) {
  return await ExpoPusherBeamsModule.unsubscribe(interest);
}

const emitter = new EventEmitter(
  ExpoPusherBeamsModule ?? NativeModulesProxy.ExpoPusherBeams
);

export function addDebugListener(
  listener: (event: DebugEventPayload) => void
): Subscription {
  return emitter.addListener<DebugEventPayload>('debug', listener);
}

export function addNotificationListener(
  listener: (event: NotificationEventPayload) => void
): Subscription {
  return emitter.addListener<NotificationEventPayload>(
    'onNotification',
    listener
  );
}

export { DebugEventPayload, NotificationEventPayload };
