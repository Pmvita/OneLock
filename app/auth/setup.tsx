import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthenticationService, MasterUserService } from '@/services';
import { PasswordDataService } from '@/services/storage';
import { useTheme } from '@/contexts/ThemeContext';
import { getTemplatePasswords } from '@/utils/templates';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { Button, Input, Card, StrengthMeter } from '@/components';

export default function SetupScreen() {
  const { colors } = useTheme();
  const { userType } = useLocalSearchParams<{ userType?: string }>();
  const [username, setUsername] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [useTemplates, setUseTemplates] = useState(true);
  const [importMockData, setImportMockData] = useState(false);

  // Determine if this is a master user setup
  const isMasterUser = userType === 'master' || username.toLowerCase() === 'pmvita';

  const handleSetup = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (!masterPassword) {
      Alert.alert('Error', 'Please enter a master password');
      return;
    }

    if (masterPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (masterPassword.length < 8) {
      Alert.alert('Error', 'Master password must be at least 8 characters long');
      return;
    }

    // For master user, validate credentials
    if (isMasterUser) {
      const isValidMasterUser = await MasterUserService.isMasterUser(username.trim());
      if (!isValidMasterUser) {
        Alert.alert('Error', 'Invalid master user credentials');
        return;
      }
    }

    setLoading(true);

    try {
      // Set up authentication with user type
      const finalUserType = isMasterUser ? 'master' : 'local';
      await AuthenticationService.setupMasterPassword(username.trim(), masterPassword, finalUserType);

      // Handle data import based on user type
      if (isMasterUser && importMockData) {
        // Import mockData for master user
        await MasterUserService.syncFromMockData();
      } else if (!isMasterUser && useTemplates) {
        // Add template passwords for local user
        const templatePasswords = getTemplatePasswords();
        await PasswordDataService.savePasswords(templatePasswords);
      }

      Alert.alert(
        'Setup Complete',
        `Your ${isMasterUser ? 'Master' : 'Local'} OneLock account has been created successfully!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Setup Failed', 'Unable to set up master password. Please try again.');
      console.error('Setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
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
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: SPACING.lg,
    },
    formCard: {
      marginBottom: SPACING.lg,
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
      color: colors.textPrimary,
      marginLeft: SPACING.sm,
    },
    templateDescription: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: SPACING.md,
    },
    templateButtons: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    securityCard: {
      marginBottom: SPACING.lg,
    },
    securityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    securityTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
      color: colors.textPrimary,
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
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
      marginLeft: SPACING.sm,
    },
    actionButtons: {
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    setupButton: {
      width: '100%',
      marginBottom: SPACING.lg,
    },
    disclaimer: {
      fontSize: FONT_SIZES.xs,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 16,
      paddingHorizontal: SPACING.lg,
    },
  });

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
            <Ionicons name="shield-checkmark" size={64} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome to OneLock</Text>
          <Text style={styles.subtitle}>
            Set up your master password to secure your credentials
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Master Password"
            value={masterPassword}
            onChangeText={setMasterPassword}
            placeholder="Enter your master password"
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {masterPassword && (
            <StrengthMeter password={masterPassword} style={{ marginTop: SPACING.sm }} />
          )}

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your master password"
            secureTextEntry={!showConfirmPassword}
            rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </Card>

        <Card style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Ionicons name="document-text" size={24} color={colors.accent} />
            <Text style={styles.templateTitle}>
              {isMasterUser ? 'Import Data' : 'Get Started'}
            </Text>
          </View>
          
          <Text style={styles.templateDescription}>
            {isMasterUser 
              ? 'Would you like to import sample passwords from mockData to see how OneLock works? This will give you a full vault to explore.'
              : 'Would you like to start with sample passwords to see how OneLock works? You can always add your own passwords later.'
            }
          </Text>

          <View style={styles.templateButtons}>
            {isMasterUser ? (
              <>
                <Button
                  title="Yes, import mockData"
                  onPress={() => setImportMockData(true)}
                  variant={importMockData ? 'primary' : 'outline'}
                  size="small"
                  style={{ flex: 1 }}
                />
                <Button
                  title="No, start empty"
                  onPress={() => setImportMockData(false)}
                  variant={!importMockData ? 'primary' : 'outline'}
                  size="small"
                  style={{ flex: 1 }}
                />
              </>
            ) : (
              <>
                <Button
                  title="Yes, add samples"
                  onPress={() => setUseTemplates(true)}
                  variant={useTemplates ? 'primary' : 'outline'}
                  size="small"
                  style={{ flex: 1 }}
                />
                <Button
                  title="No, start empty"
                  onPress={() => setUseTemplates(false)}
                  variant={!useTemplates ? 'primary' : 'outline'}
                  size="small"
                  style={{ flex: 1 }}
                />
              </>
            )}
          </View>
        </Card>

        <Card style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Ionicons name="lock-closed" size={24} color={colors.accent} />
            <Text style={styles.securityTitle}>Security Features</Text>
          </View>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>End-to-end encryption</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Biometric authentication</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Auto-lock protection</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Secure local storage</Text>
            </View>
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Set Up OneLock"
            onPress={handleSetup}
            loading={loading}
            disabled={loading}
            style={styles.setupButton}
          />
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimer}>
            Your master password is encrypted and stored securely on your device. 
            We never have access to your passwords.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}