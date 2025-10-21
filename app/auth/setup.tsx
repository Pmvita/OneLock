import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthenticationService } from '@/services';
import { PasswordValidator } from '@/utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { Button, Input, Card, StrengthMeter } from '@/components';

export default function SetupScreen() {
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValidation = PasswordValidator.validateMasterPassword(masterPassword);
  const passwordsMatch = masterPassword === confirmPassword && confirmPassword.length > 0;

  const handleSetup = async () => {
    if (!passwordValidation.isValid) {
      Alert.alert('Invalid Password', passwordValidation.errors.join('\n'));
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Passwords Don\'t Match', 'Please make sure both passwords are identical.');
      return;
    }

    setLoading(true);
    try {
      await AuthenticationService.setupMasterPassword(masterPassword);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Setup Failed', 'Unable to set up master password. Please try again.');
      console.error('Setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Welcome to OneLock</Text>
          <Text style={styles.subtitle}>
            Set up your master password to secure your credentials
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Master Password</Text>
          <Text style={styles.sectionDescription}>
            This password will be used to encrypt and decrypt your stored passwords.
            Choose a strong, memorable password.
          </Text>

          <Input
            label="Master Password"
            placeholder="Enter your master password"
            value={masterPassword}
            onChangeText={setMasterPassword}
            secureTextEntry={!showPassword}
            error={masterPassword.length > 0 && !passwordValidation.isValid ? passwordValidation.errors[0] : undefined}
            style={styles.input}
          />

          {masterPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <StrengthMeter
                strength={passwordValidation.isValid ? 'strong' : 'weak'}
                score={passwordValidation.isValid ? 85 : 25}
                showScore={true}
              />
            </View>
          )}

          <View style={styles.passwordToggle}>
            <Button
              title={showPassword ? 'Hide' : 'Show'}
              variant="ghost"
              size="small"
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? 'eye-off' : 'eye'}
            />
          </View>

          <Input
            label="Confirm Password"
            placeholder="Confirm your master password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            error={confirmPassword.length > 0 && !passwordsMatch ? 'Passwords do not match' : undefined}
            style={styles.input}
          />

          <View style={styles.passwordToggle}>
            <Button
              title={showConfirmPassword ? 'Hide' : 'Show'}
              variant="ghost"
              size="small"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
            />
          </View>
        </Card>

        <Card style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Ionicons name="lock-closed" size={24} color={COLORS.accent} />
            <Text style={styles.securityTitle}>Security Features</Text>
          </View>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.featureText}>End-to-end encryption</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.featureText}>Biometric authentication</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.featureText}>Auto-lock protection</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.featureText}>Secure local storage</Text>
            </View>
          </View>
        </Card>

        <View style={styles.footer}>
          <Button
            title="Set Up OneLock"
            onPress={handleSetup}
            loading={loading}
            disabled={!passwordValidation.isValid || !passwordsMatch}
            icon="arrow-forward"
            gradient={true}
            style={styles.setupButton}
          />
          
          <Text style={styles.disclaimer}>
            Your master password is never stored in plain text and cannot be recovered if forgotten.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  formCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  input: {
    marginBottom: SPACING.md,
  },
  strengthContainer: {
    marginBottom: SPACING.md,
  },
  passwordToggle: {
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  securityCard: {
    marginBottom: SPACING.xl,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  securityTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  footer: {
    alignItems: 'center',
  },
  setupButton: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  disclaimer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: SPACING.lg,
  },
});
