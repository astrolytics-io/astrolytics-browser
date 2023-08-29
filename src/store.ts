import { getDeviceInfo } from './device';
import { safeLocalStorage, safeSessionStorage } from './storage';
import { generateNumId, generateStrId } from './utils';
import type { Store } from './types';

const storageKeys = {
  appId: 'local',
  queue: 'local',
  props: 'local',
  userId: 'local',
  anonId: 'local',
  device: 'local',
  sessionId: 'session',
  lastActive: 'local',
  initialized: 'local',
};

function getInitialStore(): Store {
  let storeValues: Store = {
    appId: null,
    queue: [],
    props: {},
    userId: null,
    anonId: generateStrId(12),
    device: getDeviceInfo(),
    sessionId: generateNumId(8),
    lastActive: Date.now(),
    initialized: false,
  };

  try {
    storeValues = {
      appId: safeLocalStorage.getItem('astrolytics-appId') ?? null,
      queue: JSON.parse(safeLocalStorage.getItem('astrolytics-queue') || '[]'),
      props: JSON.parse(safeLocalStorage.getItem('astrolytics-props') || '{}'),
      userId: safeLocalStorage.getItem('astrolytics-userId') ?? null,
      anonId: safeLocalStorage.getItem('astrolytics-anonId') ?? generateStrId(12),
      device: JSON.parse(safeLocalStorage.getItem('astrolytics-device') || 'null') ?? getDeviceInfo(),
      sessionId: safeLocalStorage.getItem('astrolytics-sessionId') ?? generateNumId(8),
      lastActive: JSON.parse(safeLocalStorage.getItem('astrolytics-lastActive') || 'null') ?? Date.now(),
      initialized: JSON.parse(safeLocalStorage.getItem('astrolytics-initialized') || 'false'),
    };
  } catch (err) {
    // do nothing
  }

  return storeValues;
}

export default function getStore(): Store {
  const stored: Store = getInitialStore();

  const store = new Proxy(stored, {
    get(target: Store, prop: keyof Store) {
      const value = Reflect.get(target, prop);
      if (value != null) return value; // value in memory

      const storageType = storageKeys[prop];
      const storage = storageType === 'session' ? safeSessionStorage : safeLocalStorage;

      const storageValue = storage.getItem(`astrolytics-${String(prop)}`);
      if (storageValue !== null && typeof storageValue === 'string') {
        try {
          const parsedValue = JSON.parse(storageValue);
          // @ts-expect-error: this is fine
          target[prop] = parsedValue;
          return parsedValue;
        } catch (err) {
          return storageValue;
        }
      }

      return getInitialStore()[prop];
    },
    set(target: Store, prop: keyof Store, value: unknown) {
      const storageType = storageKeys[prop];
      const storage = storageType === 'session' ? safeSessionStorage : safeLocalStorage;

      // @ts-expect-error: this is fine
      target[prop] = value;
      storage.setItem(`astrolytics-${String(prop)}`, JSON.stringify(value));
      return true;
    },
  });

  return store;
}
