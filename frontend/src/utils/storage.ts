type StorageType = 'localStorage' | 'sessionStorage';

const TOKEN_KEY = 'authToken';

const getStorage = (type: StorageType = 'localStorage'): Storage => {
  return type === 'localStorage' ? localStorage : sessionStorage;
};

export const storage = {
  setToken: (token: string, type: StorageType = 'localStorage'): void => {
    try {
      const storageInstance = getStorage(type);
      storageInstance.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  getToken: (type: StorageType = 'localStorage'): string | null => {
    try {
      const storageInstance = getStorage(type);
      return storageInstance.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  removeToken: (type: StorageType = 'localStorage'): void => {
    try {
      const storageInstance = getStorage(type);
      storageInstance.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  hasToken: (type: StorageType = 'localStorage'): boolean => {
    try {
      const storageInstance = getStorage(type);
      return storageInstance.getItem(TOKEN_KEY) !== null;
    } catch (error) {
      console.error('Failed to check token:', error);
      return false;
    }
  },
};

