export type NotificationEventPayload<T = any> = {
  userInfo: {
    notification: {
      title?: string;
      body?: string;
    };
    data: T;
  };
  appState: 'active' | 'background';
};

export type WebOptions = {
  serviceWorkerFileName?: string;
  webBroadcastChannelName?: string;
};
