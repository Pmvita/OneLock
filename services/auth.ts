import * as LocalAuthentication from 'expo-local-authentication';
import { SecureStorageService, MockEncryptionService } from './storage';
import { STORAGE_KEYS } from '@/constants';
import { AuthState, UserSettings } from '@/types';

/**
 * Authentication Service
 * Handles master password and biometric authentication
 */
export class AuthenticationService {
  /**
   * Check if biometric authentication is available on the device
   */
  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get available biometric types
   */
  static async getBiometricTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting biometric types:', error);
      return [];
    }
  }

  /**
   * Authenticate using biometrics
   */
  static async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access OneLock',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Error with biometric authentication:', error);
      return false;
    }
  }

  /**
   * Set up master password (first time setup)
   */
  static async setupMasterPassword(username: string, password: string): Promise<void> {
    try {
      const hash = await MockEncryptionService.hashPassword(password);
      await SecureStorageService.setItem(STORAGE_KEYS.MASTER_PASSWORD_HASH, hash);
      await SecureStorageService.setItem(STORAGE_KEYS.USERNAME, username);
      
      // Set default settings
      await this.updateSettings({
        username,
        biometricEnabled: false,
        autoLockMinutes: 5,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error setting up master password:', error);
      throw new Error('Failed to set up master password');
    }
  }

  /**
   * Verify master password
   */
  static async verifyMasterPassword(password: string): Promise<boolean> {
    try {
      const storedHash = await SecureStorageService.getItem(STORAGE_KEYS.MASTER_PASSWORD_HASH);
      
      if (!storedHash) {
        return false;
      }

      return await MockEncryptionService.verifyPassword(password, storedHash);
    } catch (error) {
      console.error('Error verifying master password:', error);
      return false;
    }
  }

  /**
   * Check if master password is set up
   */
  static async isMasterPasswordSet(): Promise<boolean> {
    try {
      const hash = await SecureStorageService.getItem(STORAGE_KEYS.MASTER_PASSWORD_HASH);
      return hash !== null;
    } catch (error) {
      console.error('Error checking master password:', error);
      return false;
    }
  }

  /**
   * Change master password
   */
  static async changeMasterPassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Verify current password
      const isValid = await this.verifyMasterPassword(currentPassword);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Set new password
      const newHash = await MockEncryptionService.hashPassword(newPassword);
      await SecureStorageService.setItem(STORAGE_KEYS.MASTER_PASSWORD_HASH, newHash);
    } catch (error) {
      console.error('Error changing master password:', error);
      throw error;
    }
  }

  /**
   * Get user settings
   */
  static async getSettings(): Promise<UserSettings> {
    try {
      const username = await SecureStorageService.getItem(STORAGE_KEYS.USERNAME);
      const biometricEnabled = await SecureStorageService.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      const autoLockMinutes = await SecureStorageService.getItem(STORAGE_KEYS.AUTO_LOCK_MINUTES);
      const theme = await SecureStorageService.getItem(STORAGE_KEYS.THEME);

      return {
        username: username || undefined,
        biometricEnabled: biometricEnabled === 'true',
        autoLockMinutes: autoLockMinutes ? parseInt(autoLockMinutes) : 5,
        theme: (theme as 'light' | 'dark' | 'system') || 'light',
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        username: undefined,
        biometricEnabled: false,
        autoLockMinutes: 5,
        theme: 'light',
      };
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      if (settings.username !== undefined) {
        await SecureStorageService.setItem(STORAGE_KEYS.USERNAME, settings.username);
      }

      if (settings.biometricEnabled !== undefined) {
        await SecureStorageService.setItem(
          STORAGE_KEYS.BIOMETRIC_ENABLED,
          settings.biometricEnabled.toString()
        );
      }

      if (settings.autoLockMinutes !== undefined) {
        await SecureStorageService.setItem(
          STORAGE_KEYS.AUTO_LOCK_MINUTES,
          settings.autoLockMinutes.toString()
        );
      }

      if (settings.theme !== undefined) {
        await SecureStorageService.setItem(STORAGE_KEYS.THEME, settings.theme);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }

  /**
   * Get authentication state
   */
  static async getAuthState(): Promise<AuthState> {
    try {
      const isMasterPasswordSet = await this.isMasterPasswordSet();
      const biometricAvailable = await this.isBiometricAvailable();
      const settings = await this.getSettings();

      return {
        isAuthenticated: false, // Will be set by the app state
        isFirstLaunch: !isMasterPasswordSet,
        username: settings.username,
        biometricAvailable,
        biometricEnabled: settings.biometricEnabled,
      };
    } catch (error) {
      console.error('Error getting auth state:', error);
      return {
        isAuthenticated: false,
        isFirstLaunch: true,
        username: undefined,
        biometricAvailable: false,
        biometricEnabled: false,
      };
    }
  }

  /**
   * Set last unlock time
   */
  static async setLastUnlockTime(): Promise<void> {
    try {
      const now = new Date().toISOString();
      await SecureStorageService.setItem(STORAGE_KEYS.LAST_UNLOCK_TIME, now);
    } catch (error) {
      console.error('Error setting last unlock time:', error);
    }
  }

  /**
   * Get last unlock time
   */
  static async getLastUnlockTime(): Promise<Date | null> {
    try {
      const timeString = await SecureStorageService.getItem(STORAGE_KEYS.LAST_UNLOCK_TIME);
      return timeString ? new Date(timeString) : null;
    } catch (error) {
      console.error('Error getting last unlock time:', error);
      return null;
    }
  }

  /**
   * Check if app should auto-lock
   */
  static async shouldAutoLock(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const lastUnlockTime = await this.getLastUnlockTime();

      if (settings.autoLockMinutes === -1) {
        return false; // Never auto-lock
      }

      if (!lastUnlockTime) {
        return true; // No unlock time recorded, should lock
      }

      const now = new Date();
      const timeDiff = now.getTime() - lastUnlockTime.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      return minutesDiff >= settings.autoLockMinutes;
    } catch (error) {
      console.error('Error checking auto-lock:', error);
      return true; // Default to locking on error
    }
  }

  /**
   * Set username
   */
  static async setUsername(username: string): Promise<void> {
    try {
      await SecureStorageService.setItem(STORAGE_KEYS.USERNAME, username);
    } catch (error) {
      console.error('Error setting username:', error);
      throw new Error('Failed to set username');
    }
  }

  /**
   * Get username
   */
  static async getUsername(): Promise<string | null> {
    try {
      return await SecureStorageService.getItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  }

  /**
   * Reset all authentication data (for testing/debugging)
   */
  static async resetAuthData(): Promise<void> {
    try {
      await SecureStorageService.clearAll();
    } catch (error) {
      console.error('Error resetting auth data:', error);
      throw new Error('Failed to reset authentication data');
    }
  }
}
