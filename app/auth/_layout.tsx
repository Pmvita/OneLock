import React from 'react';
import { Stack } from 'expo-router';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.textPrimary,
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
