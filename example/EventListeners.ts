/* eslint-disable prettier/prettier */
import {
  requireNativeModule,
  EventEmitter,
  Subscription,
} from 'expo-modules-core';

const ExpoPusherBeamsModule = requireNativeModule('ExpoPusherBeams');
const emitter = new EventEmitter(ExpoPusherBeamsModule);

export function addDebugListener(listener: (event: any) => void): Subscription {
  return emitter.addListener('debug', listener);
}
