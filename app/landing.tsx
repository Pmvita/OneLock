import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, COLORS } from '@/constants';
import { Button, Card } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';

export default function LandingScreen() {
  const { colors } = useTheme();
  const [showAccountTypeSelection, setShowAccountTypeSelection] = useState(false);

  const handleSetup = () => {
    setShowAccountTypeSelection(true);
  };

  const handleMasterUserSetup = () => {
    router.push('/auth/setup?userType=master');
  };

  const handleLocalUserSetup = () => {
    router.push('/auth/setup?userType=local');
  };

  const handleBackToLanding = () => {
    setShowAccountTypeSelection(false);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {showAccountTypeSelection ? (
        <View style={styles.content}>
          {/* Back Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleBackToLanding}
              activeOpacity={0.7}
            >
              <Ionicons name="home" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Choose Account Type</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Select how you'd like to use OneLock
            </Text>
          </View>

          {/* Master User Option */}
          <Card style={styles.accountTypeCard}>
            <View style={styles.accountTypeHeader}>
              <View style={[styles.accountTypeIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="cloud" size={32} color={colors.white} />
              </View>
              <View style={styles.accountTypeText}>
                <Text style={[styles.accountTypeTitle, { color: colors.textPrimary }]}>
                  Master User
                </Text>
                <Text style={[styles.accountTypeSubtitle, { color: colors.textSecondary }]}>
                  Cross-device sync & advanced features
                </Text>
              </View>
            </View>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Sync passwords across devices
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Cloud backup & restore
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Advanced security features
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Import sample data
                </Text>
              </View>
            </View>

            <Button
              title="Choose Master User"
              onPress={handleMasterUserSetup}
              variant="primary"
              size="medium"
              style={styles.accountTypeButton}
            />
          </Card>

          {/* Local User Option */}
          <Card style={styles.accountTypeCard}>
            <View style={styles.accountTypeHeader}>
              <View style={[styles.accountTypeIcon, { backgroundColor: colors.gray500 }]}>
                <Ionicons name="phone-portrait" size={32} color={colors.white} />
              </View>
              <View style={styles.accountTypeText}>
                <Text style={[styles.accountTypeTitle, { color: colors.textPrimary }]}>
                  Local User
                </Text>
                <Text style={[styles.accountTypeSubtitle, { color: colors.textSecondary }]}>
                  Single device, maximum privacy
                </Text>
              </View>
            </View>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Data stays on this device only
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Maximum privacy & security
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  No internet required
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Fast & reliable
                </Text>
              </View>
            </View>

            <Button
              title="Choose Local User"
              onPress={handleLocalUserSetup}
              variant="outline"
              size="medium"
              style={styles.accountTypeButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              You can change this later in settings
            </Text>
          </View>
        </View>
      ) : (
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
      )}
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
  // Account Type Selection Styles
  headerContainer: {
    paddingTop: SPACING.xl + SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  homeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountTypeCard: {
    marginBottom: SPACING.lg,
  },
  accountTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  accountTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  accountTypeText: {
    flex: 1,
  },
  accountTypeTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  accountTypeSubtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
  },
  accountTypeButton: {
    width: '100%',
    marginTop: SPACING.lg,
  },
});
