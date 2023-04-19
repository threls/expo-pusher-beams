import { EventEmitter } from 'expo-modules-core';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

const emitter = new EventEmitter({} as any);

let beamsClient: PusherPushNotifications.Client;

const checkBeamsClient = () => {
  if (!beamsClient)
    throw new Error(
      'Pusher Beams Client needs to be initialised first. Try calling setInstanceId(:instanceId)'
    );
};

const setInstanceId = (id: string) => {
  beamsClient = new PusherPushNotifications.Client({ instanceId: id });
  beamsClient.start();
};

const clearAllState = () => {
  checkBeamsClient();
  beamsClient.clearAllState();
};

const subscribe = async (interest: string) => {
  checkBeamsClient();
  return beamsClient.addDeviceInterest(interest);
};

const unsubscribe = async (interest: string) => {
  checkBeamsClient();
  return beamsClient.removeDeviceInterest(interest);
};

export default {
  setInstanceId,
  subscribe,
  unsubscribe,
  clearAllState,
};
