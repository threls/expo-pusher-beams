import { EventEmitter } from 'expo-modules-core';

const emitter = new EventEmitter({} as any);

export default {
  async setValueAsync(value: string): Promise<void> {
    emitter.emit('debug', { value });
  },
  hello() {
    return 'Hello world! 👋';
  },
  setInstanceId(id: string) {
    console.log('Set instance id:', id);
  },
  async subscribe(interest: string): Promise<void> {
    return new Promise<void>((resolve) => resolve());
  },
};
