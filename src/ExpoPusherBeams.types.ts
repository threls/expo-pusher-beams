export type NotificationEventPayload<T = any> = {
  userInfo: {
    notification: {
      title?: string;
      body?: string;
      icon?: string;
      image_url?: string;
      tag?: string;
      color?: string;
      click_action?: string;
      link?: string;
    };
    data: T;
  };
  appState: 'active' | 'background';
};

export type NotificationEventPayloadAndroid = {
  userInfo: string;
  appState: 'active' | 'background';
};

export type WebOptions = {
  serviceWorkerFileName?: string;
  webBroadcastChannelName?: string;
};
