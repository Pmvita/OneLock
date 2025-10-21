import React from 'react';
import { Stack } from 'expo-router';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';

export default function RootLayout() {
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
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="password/[id]"
        options={{
          title: 'Password Details',
        }}
      />
      <Stack.Screen
        name="password/add"
        options={{
          title: 'Add Password',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
