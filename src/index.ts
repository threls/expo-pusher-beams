import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoPusherBeams.web.ts
// and on native platforms to ExpoPusherBeams.ts
import { DebugEventPayload } from './ExpoPusherBeams.types';
import ExpoPusherBeamsModule from './ExpoPusherBeamsModule';

// Get the native constant value.
export const PI = ExpoPusherBeamsModule.PI;

export function hello(): string {
  return ExpoPusherBeamsModule.hello();
}

export function setInstanceId(id: string): void {
  ExpoPusherBeamsModule.setInstanceId(id);
}

export async function setValueAsync(value: string) {
  return await ExpoPusherBeamsModule.setValueAsync(value);
}

export async function subscribe(interest: string) {
  return await ExpoPusherBeamsModule.subscribe(interest);
}

const emitter = new EventEmitter(
  ExpoPusherBeamsModule ?? NativeModulesProxy.ExpoPusherBeams
);

export function addDebugListener(
  listener: (event: DebugEventPayload) => void
): Subscription {
  return emitter.addListener<DebugEventPayload>('debug', listener);
}

export { DebugEventPayload };
