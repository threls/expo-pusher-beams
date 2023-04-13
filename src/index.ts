import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoPusherBeams.web.ts
// and on native platforms to ExpoPusherBeams.ts
import ExpoPusherBeamsModule from './ExpoPusherBeamsModule';
import ExpoPusherBeamsView from './ExpoPusherBeamsView';
import { ChangeEventPayload, ExpoPusherBeamsViewProps } from './ExpoPusherBeams.types';

// Get the native constant value.
export const PI = ExpoPusherBeamsModule.PI;

export function hello(): string {
  return ExpoPusherBeamsModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoPusherBeamsModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoPusherBeamsModule ?? NativeModulesProxy.ExpoPusherBeams);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoPusherBeamsView, ExpoPusherBeamsViewProps, ChangeEventPayload };
