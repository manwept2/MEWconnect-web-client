import {
  version,
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  stages,
  rtc,
  iceConnectionState,
  RTCSignalingState,
  RTCIceGatheringState,
  lifeCycle,
  communicationTypes,
  loggerLevels
} from './constants';

import { signalV1, signalV2 } from './signals';

const signalUrl = {
  V1: 'https://connect.mewapi.io',
  V2: 'wss://connect2.mewapi.io/staging'
};

const signals = {
  V1: signalV1,
  V2: signalV2
};

const versionIdentify = ver => {
  const parts = ver.toString().split('.');
  if (parts.length > 0) {
    ver = parts[0];
  }
  switch (ver) {
    case 1:
    case '1':
    case 'V1':
      return 'V1';
    case 2:
    case '2':
    case 'V2':
      return 'V2';
    default:
      return 'V2';
  }
};

const signalServer = ver => {
  return signalUrl[versionIdentify(ver)];
};

const signal = ver => {
  return signals[versionIdentify(ver)];
};

export {
  version,
  versions,
  signalServer,
  connectionCodeSchemas,
  connectionCodeSeparator,
  signals,
  signal,
  stages,
  rtc,
  iceConnectionState,
  RTCSignalingState,
  RTCIceGatheringState,
  lifeCycle,
  communicationTypes,
  loggerLevels
};
