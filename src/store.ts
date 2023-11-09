import { compareVersions } from 'compare-versions';
import { getDeviceInfo } from './device';
import { safeLocalStorage, safeSessionStorage } from './storage';
import { generateNumId, generateStrId } from './utils';
import migrations from './storeMigrations';
import packageInfo from '../package.json';
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

function performMigrations(storedVersion: string) {
  // Initialize an empty object to hold the migrated store
  let migratedStore: { [key: string]: any } = {};

  // Assuming safeLocalStorage has a method to get all keys
  // If not, you'll need to define a method or have a predefined list of keys
  const keys = safeLocalStorage.getAllKeys();

  // Iterate over the keys and get their values from safeLocalStorage
  keys.forEach((key: string) => {
    const value = safeLocalStorage.getItem(key);
    if (value !== null) {
      migratedStore[key] = value;
    }
  });

  // Perform the migrations
  Object.keys(migrations).forEach((version) => {
    if (compareVersions(version, storedVersion) > 0) {
      migratedStore = migrations[version](migratedStore);
    }
  });

  // Update safeLocalStorage with the migrated values
  Object.keys(migratedStore).forEach((key) => {
    const value = migratedStore[key];
    if (value === null) {
      safeLocalStorage.removeItem(key);
    } else {
      safeLocalStorage.setItem(key, value);
    }
  });
}

export function checkAndUpdateStorageForNewVersion() {
  const storedVersion = safeLocalStorage.getItem('astrolytics-sdk-version') as string || '1.0.0';
  if (storedVersion !== packageInfo.version) {
    performMigrations(storedVersion);
    safeLocalStorage.setItem('astrolytics-sdk-version', packageInfo.version);
  }
}

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
      queue: safeLocalStorage.getItem('astrolytics-queue') || [],
      props: safeLocalStorage.getItem('astrolytics-props') || {},
      userId: safeLocalStorage.getItem('astrolytics-userId') ?? null,
      anonId: safeLocalStorage.getItem('astrolytics-anonId') ?? generateStrId(12),
      device: safeLocalStorage.getItem('astrolytics-device') ?? getDeviceInfo(),
      sessionId: safeLocalStorage.getItem('astrolytics-sessionId') ?? generateNumId(8),
      lastActive: safeLocalStorage.getItem('astrolytics-lastActive') ?? Date.now(),
      initialized: safeLocalStorage.getItem('astrolytics-initialized') || false,
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
      storage.setItem(`astrolytics-${String(prop)}`, value);
      return true;
    },
  });

  return store;
}
