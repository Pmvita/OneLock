import React from 'react';
import { Stack } from 'expo-router';
import { FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';

export default function AuthLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontSize: FONT_SIZES.lg,
          fontWeight: FONT_WEIGHTS.semibold,
        },
      }}
    >
      <Stack.Screen
        name="setup"
        options={{
          title: 'Setup Master Password',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Unlock OneLock',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
