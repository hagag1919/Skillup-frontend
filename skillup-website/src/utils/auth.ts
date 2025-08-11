import type { User } from '../types/index.js';

// Authentication utilities
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

export const tokenUtils = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  getUserFromToken: (token: string): Record<string, unknown> | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },
};

export const userUtils = {
  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  hasRole: (user: User | null, role: string): boolean => {
    return user?.role === role;
  },

  isStudent: (user: User | null): boolean => {
    return user?.role === 'STUDENT';
  },

  isInstructor: (user: User | null): boolean => {
    return user?.role === 'INSTRUCTOR';
  },

  isAdmin: (user: User | null): boolean => {
    return user?.role === 'ADMIN';
  },
};

// Session management
export const sessionUtils = {
  clearSession: (): void => {
    tokenUtils.removeToken();
    userUtils.removeUser();
  },

  isValidSession: (): boolean => {
    const token = tokenUtils.getToken();
    const user = userUtils.getUser();
    
    if (!token || !user) {
      return false;
    }

    if (tokenUtils.isTokenExpired(token)) {
      sessionUtils.clearSession();
      return false;
    }

    return true;
  },

  initializeSession: (token: string, user: User): void => {
    tokenUtils.setToken(token);
    userUtils.setUser(user);
  },
};
