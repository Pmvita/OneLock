import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { Button, Card } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';

export default function LandingScreen() {
  const { colors } = useTheme();
  const handleSetup = () => {
    router.push('/auth/setup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={80} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>OneLock</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Secure password management for your digital life
          </Text>
        </View>

        <Card style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Ionicons name="lock-closed" size={24} color={colors.accent} />
            <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>Security Features</Text>
          </View>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>End-to-end encryption</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>Biometric authentication</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>Auto-lock protection</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>Secure local storage</Text>
            </View>
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Set Up New Account"
            onPress={handleSetup}
            icon="person-add"
            gradient={true}
            style={styles.setupButton}
          />
          
          <Button
            title="Log In to Existing Account"
            onPress={handleLogin}
            variant="outline"
            icon="log-in"
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Your passwords are encrypted and stored securely on your device
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  featuresCard: {
    marginBottom: SPACING.xl,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featuresTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.sm,
  },
  featureList: {
    gap: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
  },
  actionButtons: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  setupButton: {
    width: '100%',
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: SPACING.lg,
  },
});
