import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoPusherBeamsViewProps } from './ExpoPusherBeams.types';

const NativeView: React.ComponentType<ExpoPusherBeamsViewProps> =
  requireNativeViewManager('ExpoPusherBeams');

export default function ExpoPusherBeamsView(props: ExpoPusherBeamsViewProps) {
  return <NativeView {...props} />;
}
