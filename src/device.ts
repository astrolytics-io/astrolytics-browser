import { ClientJS } from 'clientjs';
import { safeLocalStorage } from './storage';
import type { DeviceInfo } from './types';

// eslint-disable-next-line import/prefer-default-export
export function getDeviceInfo(): DeviceInfo {
  const client = new ClientJS();

  const defaultDeviceInfo = {
    deviceId: null,
    locale: null,
    platform: null,
  };

  const data: DeviceInfo = {
    ...defaultDeviceInfo,
    locale: client.getLanguage(),
  };

  if (safeLocalStorage.getItem('astrolytics-dId')) {
    data.deviceId = safeLocalStorage.getItem('astrolytics-dId');
  } else {
    data.deviceId = client.getFingerprint().toString();
    safeLocalStorage.setItem('astrolytics-dId', data.deviceId);
  }

  let isIpad: boolean;

  try {
    // in some cases navigator might not be available, e.g. Next.js apps using SSR,
    // so to avoid errors at compile time we try/catch it
    isIpad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0)
        || navigator.platform === 'iPad';
  } catch (e) {
    isIpad = false;
  }

  data.platform = isIpad ? 'iPadOS' : client.getOS();

  return data;
}
