export interface PasswordEntry {
  id: string;
  title: string;
  username?: string;
  email?: string;
  password: string;
  url?: string;
  category: PasswordCategory;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export type PasswordCategory = 
  | 'Social'
  | 'Finance'
  | 'Work'
  | 'Shopping'
  | 'Entertainment'
  | 'Other';

export interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
}

export interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  breachDetails?: string[];
}

export interface UserSettings {
  username?: string;
  masterPasswordHash?: string;
  biometricEnabled: boolean;
  autoLockMinutes: number;
  theme: 'light' | 'dark' | 'system';
}

export interface AuthState {
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  username?: string;
  biometricAvailable: boolean;
  biometricEnabled: boolean;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface SearchFilters {
  query: string;
  category?: PasswordCategory;
  favoritesOnly: boolean;
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}
