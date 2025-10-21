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
import { PasswordDataService } from '@/services/storage';
import { PasswordValidator } from '@/utils';
import { getTemplatePasswords } from '@/utils/templates';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { Button, Input, Card, StrengthMeter } from '@/components';

export default function SetupScreen() {
  const [username, setUsername] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadTemplates, setLoadTemplates] = useState(true);

  const passwordValidation = PasswordValidator.validateMasterPassword(masterPassword);
  const passwordsMatch = masterPassword === confirmPassword && confirmPassword.length > 0;
  
  // Username validation
  const isUsernameValid = username.trim().length >= 3 && username.trim().length <= 20 && /^[a-zA-Z0-9_]+$/.test(username.trim());

  const handleSetup = async () => {
    if (!username.trim()) {
      Alert.alert('Username Required', 'Please enter a username.');
      return;
    }

    if (!isUsernameValid) {
      Alert.alert('Invalid Username', 'Username must be 3-20 characters long and contain only letters, numbers, and underscores.');
      return;
    }

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
      await AuthenticationService.setupMasterPassword(username.trim(), masterPassword);
      
      // Load template passwords if user chose to
      if (loadTemplates) {
        const templatePasswords = getTemplatePasswords();
        await PasswordDataService.savePasswords(templatePasswords);
      }
      
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
          <Text style={styles.sectionTitle}>Account Setup</Text>
          <Text style={styles.sectionDescription}>
            Choose a username for your OneLock account. This will be displayed on your login screen.
          </Text>

          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            error={username.length > 0 && !isUsernameValid ? 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' : undefined}
            style={styles.input}
          />

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

        <Card style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Ionicons name="document-text" size={24} color={COLORS.accent} />
            <Text style={styles.templateTitle}>Get Started</Text>
          </View>
          
          <Text style={styles.templateDescription}>
            Would you like to start with sample passwords to see how OneLock works? 
            You can always delete or edit these later.
          </Text>
          
          <View style={styles.templateOptions}>
            <Button
              title="Yes, load sample passwords"
              variant={loadTemplates ? "primary" : "outline"}
              onPress={() => setLoadTemplates(true)}
              icon="checkmark-circle"
              style={styles.templateButton}
            />
            <Button
              title="No, start with empty vault"
              variant={!loadTemplates ? "primary" : "outline"}
              onPress={() => setLoadTemplates(false)}
              icon="close-circle"
              style={styles.templateButton}
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
            disabled={!isUsernameValid || !passwordValidation.isValid || !passwordsMatch}
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
  templateCard: {
    marginBottom: SPACING.lg,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  templateTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  templateDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  templateOptions: {
    gap: SPACING.sm,
  },
  templateButton: {
    width: '100%',
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
