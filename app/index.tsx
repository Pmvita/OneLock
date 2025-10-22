import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { AuthenticationService } from '@/services';
import { AuthState } from '@/types';
import { FONT_SIZES, SPACING } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';

export default function IndexScreen() {
  const { colors } = useTheme();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthState = async () => {
    try {
      const state = await AuthenticationService.getAuthState();
      setAuthState(state);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (!loading && authState) {
      if (authState.isFirstLaunch) {
        // No master password exists - new user
        router.replace('/landing');
      } else {
        // Master password exists - existing user
        router.replace('/auth/login');
      }
    }
  }, [loading, authState]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Checking authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
