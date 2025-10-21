import { PasswordCategory } from '@/types';

export const COLORS = {
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
  
  // Accent colors
  accent: '#10B981',
  accentLight: '#34D399',
  accentDark: '#059669',
  
  // Warning colors
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  // Error colors
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  // Success colors
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
};

export const GRADIENTS = {
  primary: ['#6366F1', '#8B5CF6'],
  secondary: ['#EC4899', '#F59E0B'],
  accent: ['#10B981', '#06B6D4'],
  sunset: ['#F59E0B', '#EF4444'],
  ocean: ['#06B6D4', '#3B82F6'],
  forest: ['#10B981', '#059669'],
};

export const CATEGORY_COLORS: Record<PasswordCategory, string> = {
  Social: '#3B82F6',
  Finance: '#10B981',
  Work: '#8B5CF6',
  Shopping: '#F59E0B',
  Entertainment: '#EC4899',
  Other: '#6B7280',
};

export const CATEGORY_ICONS: Record<PasswordCategory, string> = {
  Social: 'people',
  Finance: 'card',
  Work: 'briefcase',
  Shopping: 'cart',
  Entertainment: 'play-circle',
  Other: 'folder',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const PASSWORD_STRENGTH_COLORS = {
  weak: '#EF4444',
  medium: '#F59E0B',
  strong: '#10B981',
  'very-strong': '#059669',
};

export const AUTO_LOCK_OPTIONS = [
  { label: 'Immediately', value: 0 },
  { label: '1 minute', value: 1 },
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: 'Never', value: -1 },
];

export const PASSWORD_GENERATOR_DEFAULTS = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
};

export const STORAGE_KEYS = {
  MASTER_PASSWORD_HASH: 'master_password_hash',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  AUTO_LOCK_MINUTES: 'auto_lock_minutes',
  THEME: 'theme',
  PASSWORDS_DATA: 'passwords_data',
  LAST_UNLOCK_TIME: 'last_unlock_time',
};
