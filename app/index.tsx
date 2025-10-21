import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { AuthenticationService } from '@/services';
import { AuthState } from '@/types';
import { COLORS } from '@/constants';

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
    if (!loading) {
      if (authState?.isFirstLaunch) {
        router.replace('/auth/setup');
      } else if (authState && !authState.isFirstLaunch) {
        router.replace('/(tabs)');
      } else if (!authState) {
        router.replace('/auth' as any);
      }
    }
  }, [loading, authState]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
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
});
