/**
 * This is an example file of a service worker.
 * Most of it is suggested by Pusher Beams themselves, we just added a broadcast for the website to receive a notification
 */

importScripts('https://js.pusher.com/beams/service-worker.js');

const broadcast = new BroadcastChannel('expo-pusher-beams');

PusherPushNotifications.onNotificationReceived = ({ pushEvent, payload }) => {
  // NOTE: Overriding this method will disable the default notification
  // handling logic offered by Pusher Beams. You MUST display a notification
  // in this callback unless your site is currently in focus
  // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options

  // Your custom notification handling logic here 🛠️
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  pushEvent.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(
        (clientList) =>
          new Promise((resolve) => {
            // Check if any of our host url sites are actively visible
            for (const client of clientList) {
              if (client.visibilityState === 'visible') {
                return resolve('active');
              }
            }
            resolve('background');
          })
      )
      .then((appState) => {
        // Publish notification on the desktop if not active
        if (appState !== 'active') {
          self.registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon,
            data: payload.data,
          });
        }

        // Broadcast the notification to @threls/expo-pusher-beams package
        broadcast.postMessage({ userInfo: payload, appState });
      })
  );
};
