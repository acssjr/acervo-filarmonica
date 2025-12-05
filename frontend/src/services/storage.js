// ===== LOCAL STORAGE SERVICE =====
// Wrapper para localStorage com prefixo e tratamento de erros

const PREFIX = 'fil_';

export const Storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch {
      // Silent fail
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch {
      // Silent fail
    }
  },

  clear: (key) => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch {
      // Silent fail
    }
  }
};

// Data version control
export const DATA_VERSION = 7;

export const checkAndClearOldData = () => {
  const storedVersion = Storage.get('version', 0);
  if (storedVersion < DATA_VERSION) {
    Storage.clear('sheets');
    Storage.clear('user');
    Storage.set('version', DATA_VERSION);
  }
};

export default Storage;
