import { EventEmitter } from 'expo-modules-core';

const emitter = new EventEmitter({} as any);

export default {
  setInstanceId(id: string) {
    console.log('Set instance id:', id);
  },
  async subscribe(interest: string): Promise<void> {
    return new Promise<void>((resolve) => resolve());
  },
};
