import React from 'react';
import { Stack } from 'expo-router';
import { FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function StackNavigator() {
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
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="landing"
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StackNavigator />
    </ThemeProvider>
  );
}
