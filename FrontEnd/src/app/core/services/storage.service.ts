import { Injectable } from '@angular/core';

/**
 * Service to manage browser storage (sessionStorage and localStorage)
 * Provides a centralized way to store and retrieve authentication data
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';
  private readonly REMEMBER_ME_KEY = 'remember_me';

  /**
   * Get the appropriate storage based on remember me preference
   */
  private getStorage(): Storage {
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  /**
   * Set remember me preference
   */
  setRememberMe(remember: boolean): void {
    if (remember) {
      localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
    } else {
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    }
  }

  /**
   * Get remember me preference
   */
  getRememberMe(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }

  /**
   * Save authentication token
   */
  setToken(token: string): void {
    this.getStorage().setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    // Check both storages to support session migration
    return sessionStorage.getItem(this.TOKEN_KEY) ||
           localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove authentication token
   */
  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Save user data
   */
  setUser(user: any): void {
    this.getStorage().setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user data
   */
  getUser<T>(): T | null {
    // Check both storages
    const userStr = sessionStorage.getItem(this.USER_KEY) ||
                    localStorage.getItem(this.USER_KEY);

    if (userStr) {
      try {
        return JSON.parse(userStr) as T;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Remove user data
   */
  removeUser(): void {
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
    // Keep remember me preference
  }

  /**
   * Clear all storage including preferences
   */
  clearAll(): void {
    this.clearAuth();
    localStorage.removeItem(this.REMEMBER_ME_KEY);
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Store custom data
   */
  setItem(key: string, value: string, usePersistent: boolean = false): void {
    const storage = usePersistent ? localStorage : sessionStorage;
    storage.setItem(key, value);
  }

  /**
   * Get custom data
   */
  getItem(key: string): string | null {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  /**
   * Remove custom data
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
}
