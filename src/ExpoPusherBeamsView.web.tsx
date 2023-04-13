import * as React from 'react';

import { ExpoPusherBeamsViewProps } from './ExpoPusherBeams.types';

export default function ExpoPusherBeamsView(props: ExpoPusherBeamsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
