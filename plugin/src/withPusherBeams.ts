import {
  ConfigPlugin,
  withAppBuildGradle,
  withDangerousMod,
} from '@expo/config-plugins';
import { readFile } from './utils/file';

const {
  mergeContents,
  removeGeneratedContents,
  createGeneratedHeaderComment,
} = require('@expo/config-plugins/build/utils/generateCode');

const androidAppDependencies = [
  `dependencies {`,
  `\timplementation platform('com.google.firebase:firebase-bom:32.0.0')`,
  `\timplementation 'com.google.firebase:firebase-messaging-ktx'`,
  `\timplementation 'com.google.firebase:firebase-analytics-ktx'`,
  `\timplementation 'com.google.firebase:firebase-installations-ktx'`,
  `\timplementation 'com.google.firebase:firebase-iid:21.1.0'`,
  `\timplementation 'com.pusher:push-notifications-android:1.9.2'`,
  `}`,
];

const iosPodDependencies = [`\tpod 'PushNotifications'`];

const withAndroidPusherBeams: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    const tag = 'pusher-beams';
    const comment = '//';
    const newSrc = androidAppDependencies.join('\n');

    const header = createGeneratedHeaderComment(newSrc, tag, comment);

    if (!config.modResults.contents.includes(header)) {
      const footer = `${comment} @generated end ${tag}\n\n`;
      // Remove any old generated code
      const src = config.modResults.contents;
      const sanitizedTarget = removeGeneratedContents(src, tag) || src;
      const contentToAdd = `\n${header}\n${newSrc}\n${footer}`;

      config.modResults.contents = sanitizedTarget + contentToAdd;
    }

    return config;
  });
};

const withIosPusherBeams: ConfigPlugin = (config) => {
  config = withDangerousMod(config, [
    'ios',
    (iosConfig) => {
      const { platformProjectRoot } = iosConfig.modRequest;
      const file = readFile(platformProjectRoot, 'Podfile');

      const resSources = mergeContents({
        src: file.content,
        newSrc: iosPodDependencies.join('\n'),
        tag: 'pusher-beams',
        anchor: 'target',
        offset: 1,
        comment: '#',
      });

      file.write(resSources.contents);

      return iosConfig;
    },
  ]);

  return config;
};

const withPusherBeams: ConfigPlugin = (config) => {
  config = withAndroidPusherBeams(config);
  config = withIosPusherBeams(config);
  return config;
};

export default withPusherBeams;
