import { EventEmitter } from 'expo-modules-core';
import * as PusherPushNotifications from '@pusher/push-notifications-web';
import { LocalTokenProvider } from './LocalTokenProvider';

const emitter = new EventEmitter({} as any);

let beamsClient: PusherPushNotifications.Client;

const checkBeamsClient = () => {
  if (!beamsClient)
    throw new Error(
      'Pusher Beams Client needs to be initialised first. Try calling setInstanceId(:instanceId)'
    );
};

const setInstanceId = async (id: string) => {
  beamsClient = new PusherPushNotifications.Client({ instanceId: id });
  beamsClient.start();
};

const clearAllState = async () => {
  checkBeamsClient();
  await beamsClient.clearAllState();
};

const subscribe = async (interest: string) => {
  checkBeamsClient();
  await beamsClient.addDeviceInterest(interest);
};

const unsubscribe = async (interest: string) => {
  checkBeamsClient();
  await beamsClient.removeDeviceInterest(interest);
};

const setUserId = async (userId: string, token: string) => {
  checkBeamsClient();
  await beamsClient.setUserId(userId, new LocalTokenProvider(token));
};

export default {
  setInstanceId,
  subscribe,
  unsubscribe,
  clearAllState,
  setUserId,
};
