import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { AuthenticationService } from '@/services';
import { UserSettings } from '@/types';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  colors: typeof COLORS_LIGHT;
  setTheme: (theme: ThemeMode) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Light theme colors (existing COLORS)
const COLORS_LIGHT = {
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

// Dark theme colors
const COLORS_DARK = {
  // Primary colors (adjusted for dark mode)
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  
  // Secondary colors
  secondary: '#F472B6',
  secondaryLight: '#F9A8D4',
  secondaryDark: '#EC4899',
  
  // Accent colors
  accent: '#34D399',
  accentLight: '#6EE7B7',
  accentDark: '#10B981',
  
  // Warning colors
  warning: '#FBBF24',
  warningLight: '#FCD34D',
  warningDark: '#F59E0B',
  
  // Error colors
  error: '#F87171',
  errorLight: '#FCA5A5',
  errorDark: '#EF4444',
  
  // Success colors
  success: '#34D399',
  successLight: '#6EE7B7',
  successDark: '#10B981',
  
  // Neutral colors (inverted for dark mode)
  white: '#000000',
  black: '#FFFFFF',
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',
  
  // Background colors (dark mode)
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',
  
  // Text colors (dark mode)
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  
  // Border colors (dark mode)
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await AuthenticationService.getSettings();
      setThemeState(settings.theme);
    } catch (error) {
      console.error('Error loading theme:', error);
      setThemeState('light');
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AuthenticationService.updateSettings({ theme: newTheme });
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  // Determine if we should use dark colors
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT;

  // Don't render until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
