import { ClientJS } from 'clientjs';
import { safeLocalStorage } from './storage';
import type { DeviceInfo } from './types';

// eslint-disable-next-line import/prefer-default-export
function getOS(userAgent: string): { osName: string; osVersion: string } {
  if (/Windows/i.test(userAgent)) {
    if (/Phone/.test(userAgent) || /WPDesktop/.test(userAgent)) {
      return { osName: 'Windows Phone', osVersion: '' };
    }
    const match = /Windows NT ([0-9.]+)/i.exec(userAgent);
    if (match && match[1]) {
      const version = match[1];
      return { osName: 'Windows', osVersion: version };
    }
    return { osName: 'Windows', osVersion: '' };
  } if (/(iPhone|iPad|iPod)/.test(userAgent)) {
    const match = /OS (\d+)_(\d+)_?(\d+)?/i.exec(userAgent);
    if (match && match[1]) {
      const versionParts = [match[1], match[2], match[3] || '0'];
      return { osName: 'iOS', osVersion: versionParts.join('.') };
    }
    return { osName: 'iOS', osVersion: '' };
  } if (/Android/.test(userAgent)) {
    const match = /Android (\d+)\.(\d+)\.?(\d+)?/i.exec(userAgent);
    if (match && match[1]) {
      const versionParts = [match[1], match[2], match[3] || '0'];
      return { osName: 'Android', osVersion: versionParts.join('.') };
    }
    return { osName: 'Android', osVersion: '' };
  } if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
    return { osName: 'BlackBerry', osVersion: '' };
  } if (/Mac/i.test(userAgent)) {
    const match = /Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i.exec(userAgent);
    if (match && match[1]) {
      const versionParts = [match[1], match[2], match[3] || '0'];
      return { osName: 'Mac OS X', osVersion: versionParts.join('.') };
    }
    return { osName: 'Mac OS X', osVersion: '' };
  } if (/Linux/.test(userAgent)) {
    return { osName: 'Linux', osVersion: '' };
  } if (/CrOS/.test(userAgent)) {
    return { osName: 'Chrome OS', osVersion: '' };
  }
  return { osName: '', osVersion: '' };
}

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

  const { osName, osVersion } = getOS(window.navigator.userAgent);
  data.platform = `${osName} ${osVersion}`;

  return data;
}
