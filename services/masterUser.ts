import { SecureStorageService, MockEncryptionService, PasswordDataService } from './storage';
import { STORAGE_KEYS } from '@/constants';
import { UserSettings } from '@/types';

/**
 * Master User Service
 * Handles master user authentication and cross-device sync via mockData
 */
export class MasterUserService {
  private static readonly MASTER_USER_CONFIG_PATH = '@/config/masterUser.json';

  /**
   * Check if a username is the master user
   */
  static async isMasterUser(username: string): Promise<boolean> {
    try {
      const config = await this.getMasterUserConfig();
      return config.username.toLowerCase() === username.toLowerCase();
    } catch (error) {
      console.error('Error checking master user:', error);
      return false;
    }
  }

  /**
   * Get master user configuration
   */
  static async getMasterUserConfig(): Promise<{ username: string; passwordHash: string; userType: string }> {
    try {
      // Load from config file
      const masterUserConfig = require('@/config/masterUser.json');
      return masterUserConfig;
    } catch (error) {
      console.error('Error loading master user config:', error);
      throw new Error('Failed to load master user configuration');
    }
  }

  /**
   * Verify master user password
   */
  static async verifyMasterUserPassword(password: string): Promise<boolean> {
    try {
      const config = await this.getMasterUserConfig();
      return await MockEncryptionService.verifyPassword(password, config.passwordHash);
    } catch (error) {
      console.error('Error verifying master user password:', error);
      return false;
    }
  }

  /**
   * Initialize master user on first setup
   */
  static async initializeMasterUser(username: string, password: string): Promise<void> {
    try {
      const config = await this.getMasterUserConfig();
      
      // Verify this is the master user
      if (config.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error('Invalid master user credentials');
      }

      // Verify password
      const isValidPassword = await this.verifyMasterUserPassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid master user password');
      }

      // Store master user data locally
      await SecureStorageService.setItem(STORAGE_KEYS.USERNAME, username);
      await SecureStorageService.setItem(STORAGE_KEYS.USER_TYPE, 'master');
      await SecureStorageService.setItem(STORAGE_KEYS.MASTER_PASSWORD_HASH, config.passwordHash);

      // Set default settings for master user
      await this.updateMasterUserSettings({
        username,
        userType: 'master',
        biometricEnabled: false,
        autoLockMinutes: 5,
        theme: 'light',
      });

      console.log('Master user initialized successfully');
    } catch (error) {
      console.error('Error initializing master user:', error);
      throw new Error('Failed to initialize master user');
    }
  }

  /**
   * Update master user settings
   */
  static async updateMasterUserSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      if (settings.username !== undefined) {
        await SecureStorageService.setItem(STORAGE_KEYS.USERNAME, settings.username);
      }

      if (settings.userType !== undefined) {
        await SecureStorageService.setItem(STORAGE_KEYS.USER_TYPE, settings.userType);
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
      console.error('Error updating master user settings:', error);
      throw new Error('Failed to update master user settings');
    }
  }

  /**
   * Sync passwords to mockData (simulating cloud sync)
   */
  static async syncToMockData(): Promise<void> {
    try {
      const passwords = await PasswordDataService.loadPasswords();
      const settings = await this.getMasterUserSettings();
      
      // In a real implementation, this would sync to cloud storage
      // For now, we'll just log the sync operation
      console.log('Syncing passwords to mockData:', {
        passwordCount: passwords.length,
        lastSync: new Date().toISOString(),
        username: settings.username
      });

      // Store last sync time
      await SecureStorageService.setItem('last_sync_time', new Date().toISOString());
    } catch (error) {
      console.error('Error syncing to mockData:', error);
      throw new Error('Failed to sync passwords to mockData');
    }
  }

  /**
   * Sync passwords from mockData (simulating cloud sync)
   */
  static async syncFromMockData(): Promise<void> {
    try {
      // In a real implementation, this would fetch from cloud storage
      // For now, we'll load from the mockData file
      const mockData = require('@/mockData/passwords.json');
      
      // Import passwords from mockData
      await PasswordDataService.savePasswords(mockData.passwords);
      
      console.log('Synced passwords from mockData:', {
        passwordCount: mockData.passwords.length,
        lastSync: new Date().toISOString()
      });

      // Store last sync time
      await SecureStorageService.setItem('last_sync_time', new Date().toISOString());
    } catch (error) {
      console.error('Error syncing from mockData:', error);
      throw new Error('Failed to sync passwords from mockData');
    }
  }

  /**
   * Get master user settings
   */
  static async getMasterUserSettings(): Promise<UserSettings> {
    try {
      const username = await SecureStorageService.getItem(STORAGE_KEYS.USERNAME);
      const userType = await SecureStorageService.getItem(STORAGE_KEYS.USER_TYPE);
      const biometricEnabled = await SecureStorageService.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      const autoLockMinutes = await SecureStorageService.getItem(STORAGE_KEYS.AUTO_LOCK_MINUTES);
      const theme = await SecureStorageService.getItem(STORAGE_KEYS.THEME);

      return {
        username: username || undefined,
        userType: (userType as 'master' | 'local') || 'local',
        biometricEnabled: biometricEnabled === 'true',
        autoLockMinutes: autoLockMinutes ? parseInt(autoLockMinutes) : 5,
        theme: (theme as 'light' | 'dark' | 'system') || 'light',
      };
    } catch (error) {
      console.error('Error getting master user settings:', error);
      return {
        username: undefined,
        userType: 'local',
        biometricEnabled: false,
        autoLockMinutes: 5,
        theme: 'light',
      };
    }
  }

  /**
   * Get last sync time
   */
  static async getLastSyncTime(): Promise<Date | null> {
    try {
      const timeString = await SecureStorageService.getItem('last_sync_time');
      return timeString ? new Date(timeString) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  /**
   * Check if current user is master user
   */
  static async isCurrentUserMaster(): Promise<boolean> {
    try {
      const settings = await this.getMasterUserSettings();
      return settings.userType === 'master';
    } catch (error) {
      console.error('Error checking if current user is master:', error);
      return false;
    }
  }
}
