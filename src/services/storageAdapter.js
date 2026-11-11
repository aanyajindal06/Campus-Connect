/**
 * LocalStorage adapter providing safe serialization and error tolerance.
 */
export const storageAdapter = {
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[storageAdapter] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[storageAdapter] Error writing key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[storageAdapter] Error removing key "${key}":`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('[storageAdapter] Error clearing localStorage:', error);
      return false;
    }
  }
};
