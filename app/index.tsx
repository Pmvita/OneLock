import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { AuthenticationService } from '@/services';
import { AuthState } from '@/types';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export default function IndexScreen() {
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
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Checking authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
