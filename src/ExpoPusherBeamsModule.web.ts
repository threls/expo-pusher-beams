import { EventEmitter } from 'expo-modules-core';
import * as PusherPushNotifications from '@pusher/push-notifications-web';
import { LocalTokenProvider } from './LocalTokenProvider';
import { NotificationEventPayload, WebOptions } from './ExpoPusherBeams.types';
import { getServiceWorkerRegistration } from './serviceWorker/helper';
const emitter = new EventEmitter({} as any);

let beamsClient: PusherPushNotifications.Client;
let swBroadcast: BroadcastChannel;

const checkBeamsClient = () => {
  if (!beamsClient)
    throw new Error(
      'Pusher Beams Client needs to be initialised first. Try calling setInstanceId(:instanceId)'
    );
};

const setInstanceId = async (id: string, webOptions?: WebOptions) => {
  let serviceWorkerRegistration = await registerServiceWorker(webOptions);

  beamsClient = new PusherPushNotifications.Client({
    instanceId: id,
    serviceWorkerRegistration,
  });

  handleServiceWorkerNotifications();

  await beamsClient.start();
};

const registerServiceWorker = async (
  webOptions?: WebOptions
): Promise<ServiceWorkerRegistration | undefined> => {
  const serviceWorkerFileName =
    webOptions?.serviceWorkerFileName ?? 'service-worker';

  if (serviceWorkerFileName && 'serviceWorker' in window.navigator) {
    return await getServiceWorkerRegistration(serviceWorkerFileName);
  }
  return undefined;
};

const handleServiceWorkerNotifications = (webOptions?: WebOptions) => {
  if (!swBroadcast) {
    swBroadcast = new BroadcastChannel(
      webOptions?.webBroadcastChannelName ?? 'expo-pusher-beams'
    );

    swBroadcast.onmessage = (event: MessageEvent<NotificationEventPayload>) => {
      emitter.emit('onNotification', event.data);
    };
  }
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

const stop = async () => {
  checkBeamsClient();
  await beamsClient.stop();
};

export default {
  setInstanceId,
  subscribe,
  unsubscribe,
  clearAllState,
  setUserId,
  stop,
};
