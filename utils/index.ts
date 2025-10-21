import { PasswordStrength, PasswordGeneratorOptions, PasswordCategory } from '@/types';
import { PASSWORD_STRENGTH_COLORS } from '@/constants';

/**
 * Password Generator Utility
 * Generates secure passwords based on user preferences
 */
export class PasswordGenerator {
  private static readonly CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  /**
   * Generate a random password based on options
   */
  static generatePassword(options: PasswordGeneratorOptions): string {
    let charset = '';

    if (options.includeLowercase) {
      charset += this.CHARACTER_SETS.lowercase;
    }
    if (options.includeUppercase) {
      charset += this.CHARACTER_SETS.uppercase;
    }
    if (options.includeNumbers) {
      charset += this.CHARACTER_SETS.numbers;
    }
    if (options.includeSymbols) {
      charset += this.CHARACTER_SETS.symbols;
    }

    if (charset === '') {
      throw new Error('At least one character type must be selected');
    }

    let password = '';
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Generate a memorable password using common words
   */
  static generateMemorablePassword(wordCount: number = 4): string {
    const words = [
      'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'house',
      'island', 'jungle', 'knight', 'ladder', 'mountain', 'ocean', 'palace', 'queen',
      'river', 'sunset', 'tower', 'umbrella', 'village', 'water', 'yellow', 'zebra',
      'bright', 'clever', 'daring', 'elegant', 'fierce', 'gentle', 'happy', 'intense',
      'joyful', 'kind', 'lively', 'magic', 'noble', 'optimistic', 'peaceful', 'quick',
      'radiant', 'strong', 'tranquil', 'unique', 'vibrant', 'wise', 'excellent', 'fantastic'
    ];

    const selectedWords = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }

    // Add numbers and symbols
    const number = Math.floor(Math.random() * 100);
    const symbols = ['!', '@', '#', '$', '%'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    return selectedWords.join('-') + number + symbol;
  }

  /**
   * Generate a PIN code
   */
  static generatePIN(length: number = 6): string {
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += Math.floor(Math.random() * 10).toString();
    }
    return pin;
  }
}

/**
 * Password Strength Checker Utility
 * Analyzes password strength and provides feedback
 */
export class PasswordStrengthChecker {
  /**
   * Calculate password strength score and level
   */
  static checkStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 12) {
      score += 25;
    } else if (password.length >= 8) {
      score += 15;
      feedback.push('Consider using at least 12 characters');
    } else {
      feedback.push('Use at least 8 characters');
    }

    // Character variety checks
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    if (hasLowercase) score += 10;
    else feedback.push('Add lowercase letters');

    if (hasUppercase) score += 10;
    else feedback.push('Add uppercase letters');

    if (hasNumbers) score += 10;
    else feedback.push('Add numbers');

    if (hasSymbols) score += 15;
    else feedback.push('Add special characters');

    // Complexity bonus
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) {
      score += 10;
    } else {
      feedback.push('Use more unique characters');
    }

    // Common patterns penalty
    if (this.hasCommonPatterns(password)) {
      score -= 20;
      feedback.push('Avoid common patterns');
    }

    // Common passwords penalty
    if (this.isCommonPassword(password)) {
      score -= 30;
      feedback.push('Avoid common passwords');
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine level
    let level: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score < 30) level = 'weak';
    else if (score < 60) level = 'medium';
    else if (score < 85) level = 'strong';
    else level = 'very-strong';

    // Add positive feedback for strong passwords
    if (score >= 85) {
      feedback.push('Excellent password strength!');
    } else if (score >= 60) {
      feedback.push('Good password strength');
    }

    return {
      score,
      level,
      feedback: feedback.length > 0 ? feedback : ['Password meets basic requirements'],
    };
  }

  /**
   * Check for common patterns
   */
  private static hasCommonPatterns(password: string): boolean {
    const patterns = [
      /123/, /abc/, /qwe/, /asd/, /zxc/, // Sequential
      /111/, /222/, /333/, // Repeated
      /password/i, /admin/i, /user/i, // Common words
    ];

    return patterns.some(pattern => pattern.test(password));
  }

  /**
   * Check if password is commonly used
   */
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890', 'abc123',
      'password1', '123123', 'dragon', 'master', 'hello',
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Get strength color
   */
  static getStrengthColor(level: PasswordStrength['level']): string {
    return PASSWORD_STRENGTH_COLORS[level];
  }
}

/**
 * Password Validation Utility
 * Validates password requirements and constraints
 */
export class PasswordValidator {
  /**
   * Validate password against common requirements
   */
  static validate(password: string, requirements?: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSymbols?: boolean;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const defaults = {
      minLength: 8,
      maxLength: 128,
      requireUppercase: false,
      requireLowercase: true,
      requireNumbers: false,
      requireSymbols: false,
    };

    const rules = { ...defaults, ...requirements };

    // Length validation
    if (password.length < rules.minLength!) {
      errors.push(`Password must be at least ${rules.minLength} characters long`);
    }
    if (password.length > rules.maxLength!) {
      errors.push(`Password must be no more than ${rules.maxLength} characters long`);
    }

    // Character type validation
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (rules.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (rules.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate master password specifically
   */
  static validateMasterPassword(password: string): { isValid: boolean; errors: string[] } {
    return this.validate(password, {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
    });
  }
}

/**
 * Breach Check Utility (Mock Implementation)
 * Simulates checking if a password has been compromised
 */
export class BreachChecker {
  private static readonly MOCK_BREACHED_PASSWORDS = [
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', 'monkey', '1234567890', 'abc123',
  ];

  /**
   * Mock breach check - simulates API call
   */
  static async checkPassword(password: string): Promise<{
    isBreached: boolean;
    breachCount: number;
    breachDetails?: string[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isBreached = this.MOCK_BREACHED_PASSWORDS.includes(password.toLowerCase());
    
    if (isBreached) {
      return {
        isBreached: true,
        breachCount: Math.floor(Math.random() * 5) + 1,
        breachDetails: [
          'Data breach in 2023',
          'Compromised in multiple incidents',
          'Found in password dumps',
        ],
      };
    }

    return {
      isBreached: false,
      breachCount: 0,
    };
  }

  /**
   * Check if password appears in common breach lists
   */
  static isCommonlyBreached(password: string): boolean {
    return this.MOCK_BREACHED_PASSWORDS.includes(password.toLowerCase());
  }
}

/**
 * URL Utility
 * Validates and formats URLs
 */
export class URLValidator {
  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format URL for display
   */
  static formatURL(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  /**
   * Extract domain from URL
   */
  static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }
}

/**
 * Search Utility
 * Provides search and filtering functionality
 */
export class SearchUtils {
  /**
   * Search passwords by query
   */
  static searchPasswords(passwords: any[], query: string): any[] {
    if (!query.trim()) {
      return passwords;
    }

    const searchTerm = query.toLowerCase();
    return passwords.filter(password => 
      password.title.toLowerCase().includes(searchTerm) ||
      password.username?.toLowerCase().includes(searchTerm) ||
      password.email?.toLowerCase().includes(searchTerm) ||
      password.url?.toLowerCase().includes(searchTerm) ||
      password.notes?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filter passwords by category
   */
  static filterByCategory(passwords: any[], category: PasswordCategory): any[] {
    if (!category) {
      return passwords;
    }
    return passwords.filter(password => password.category === category);
  }

  /**
   * Filter favorites
   */
  static filterFavorites(passwords: any[]): any[] {
    return passwords.filter(password => password.isFavorite);
  }

  /**
   * Sort passwords
   */
  static sortPasswords(passwords: any[], sortBy: 'name' | 'createdAt' | 'updatedAt', order: 'asc' | 'desc' = 'asc'): any[] {
    return [...passwords].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });
  }
}
