const PREFIX = 'fil_';

export const Storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key: string, value: unknown): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch { /* noop */ }
  },
  remove(key: string): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch { /* noop */ }
  },
  clear(key: string): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch { /* noop */ }
  },
};

export const DATA_VERSION = 7;

export const checkAndClearOldData = (): void => {
  const storedVersion = Storage.get<number>('version', 0);
  if (storedVersion < DATA_VERSION) {
    Storage.clear('sheets');
    Storage.clear('user');
    Storage.set('version', DATA_VERSION);
  }
};

export default Storage;
