/* eslint-disable max-classes-per-file */
interface JSONStorage {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

class InMemoryJSONStorage implements JSONStorage {
  private storage: Record<string, any>;

  constructor() {
    this.storage = {};
  }

  getItem<T>(key: string): T | null {
    const stored = this.storage[key];
    return stored !== undefined ? stored : null;
  }

  setItem<T>(key: string, value: T): void {
    this.storage[key] = JSON.stringify(value);
  }

  removeItem(key: string): void {
    delete this.storage[key];
  }

  clear(): void {
    this.storage = {};
  }
}

class JSONWrapper implements JSONStorage {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  getItem<T>(key: string): T | null {
    const stored = this.storage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
    return null;
  }

  setItem<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

// in some cases the browser might throw an error just for accessing localStorage, so we
// use try/catch to handle it
function initializeStorage() {
  let safeLocalStorage: JSONStorage;
  let safeSessionStorage: JSONStorage;

  try {
    safeLocalStorage = typeof localStorage !== 'undefined' ? new JSONWrapper(localStorage) : new InMemoryJSONStorage();
    safeSessionStorage = typeof sessionStorage !== 'undefined' ? new JSONWrapper(sessionStorage) : new InMemoryJSONStorage();
  } catch (err) {
    safeLocalStorage = new InMemoryJSONStorage();
    safeSessionStorage = new InMemoryJSONStorage();
  }

  return { safeLocalStorage, safeSessionStorage };
}

const { safeLocalStorage, safeSessionStorage } = initializeStorage();

export { safeLocalStorage, safeSessionStorage };
