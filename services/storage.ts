import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants';

/**
 * Mock Encryption Service
 * 
 * NOTE: This is a demonstration implementation. In a real-world application,
 * you would use proper encryption libraries like:
 * - react-native-crypto-js
 * - expo-crypto
 * - react-native-keychain
 * 
 * This mock service simulates encryption/decryption for educational purposes.
 */

export class MockEncryptionService {
  private static readonly MOCK_KEY = 'mock-encryption-key-2024';

  /**
   * Mock encryption function
   * In production, use proper AES encryption with a secure key derivation function
   */
  static async encrypt(text: string): Promise<string> {
    // Simulate encryption delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock encryption: Simple string transformation
    const encoded = btoa(text); // Use btoa instead of Buffer
    const transformed = encoded.split('').reverse().join('');
    
    return `encrypted_${transformed}`;
  }

  /**
   * Mock decryption function
   * In production, use proper AES decryption
   */
  static async decrypt(encryptedText: string): Promise<string> {
    // Simulate decryption delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!encryptedText.startsWith('encrypted_')) {
      throw new Error('Invalid encrypted format');
    }
    
    const transformed = encryptedText.replace('encrypted_', '');
    const encoded = transformed.split('').reverse().join('');
    const decoded = atob(encoded); // Use atob instead of Buffer
    
    return decoded;
  }

  /**
   * Generate a mock hash for password verification
   * In production, use proper hashing like bcrypt or Argon2
   */
  static async hashPassword(password: string): Promise<string> {
    // Simulate hashing delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock hash: Simple hash simulation using string manipulation
    const combined = password + this.MOCK_KEY;
    let hash = '';
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash += char.toString(16);
    }
    return `hash_${hash}`;
  }

  /**
   * Verify password against hash
   * In production, use proper hash verification
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const computedHash = await this.hashPassword(password);
    return computedHash === hash;
  }
}

/**
 * Secure Storage Service
 * Uses Expo SecureStore for secure key-value storage
 */
export class SecureStorageService {
  /**
   * Store a value securely
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw new Error('Failed to store secure data');
    }
  }

  /**
   * Retrieve a value securely
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  /**
   * Remove a value securely
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure item:', error);
    }
  }

  /**
   * Check if a key exists
   */
  static async hasItem(key: string): Promise<boolean> {
    const value = await this.getItem(key);
    return value !== null;
  }

  /**
   * Clear all stored data
   */
  static async clearAll(): Promise<void> {
    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map(key => this.removeItem(key)));
  }
}

/**
 * Password Data Service
 * Manages password entries with mock encryption
 */
export class PasswordDataService {
  /**
   * Load passwords from secure storage
   */
  static async loadPasswords(): Promise<any[]> {
    try {
      const encryptedData = await SecureStorageService.getItem(STORAGE_KEYS.PASSWORDS_DATA);
      
      if (!encryptedData) {
        // Return empty array if no data exists
        return [];
      }

      const decryptedData = await MockEncryptionService.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error loading passwords:', error);
      return [];
    }
  }

  /**
   * Save passwords to secure storage
   */
  static async savePasswords(passwords: any[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(passwords);
      const encryptedData = await MockEncryptionService.encrypt(jsonData);
      await SecureStorageService.setItem(STORAGE_KEYS.PASSWORDS_DATA, encryptedData);
    } catch (error) {
      console.error('Error saving passwords:', error);
      throw new Error('Failed to save passwords');
    }
  }

  /**
   * Add a new password entry
   */
  static async addPassword(password: any): Promise<void> {
    const passwords = await this.loadPasswords();
    const newPassword = {
      ...password,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    passwords.push(newPassword);
    await this.savePasswords(passwords);
  }

  /**
   * Update an existing password entry
   */
  static async updatePassword(id: string, updates: Partial<any>): Promise<void> {
    const passwords = await this.loadPasswords();
    const index = passwords.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Password not found');
    }

    passwords[index] = {
      ...passwords[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.savePasswords(passwords);
  }

  /**
   * Delete a password entry
   */
  static async deletePassword(id: string): Promise<void> {
    const passwords = await this.loadPasswords();
    const filteredPasswords = passwords.filter(p => p.id !== id);
    await this.savePasswords(filteredPasswords);
  }

  /**
   * Get password by ID
   */
  static async getPasswordById(id: string): Promise<any | null> {
    const passwords = await this.loadPasswords();
    return passwords.find(p => p.id === id) || null;
  }
}
