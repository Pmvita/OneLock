import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthenticationService, MasterUserService } from '@/services';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { Button, Input, Card } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [username, setUsername] = useState<string | null>(null);
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isMasterUser, setIsMasterUser] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    checkBiometricAvailability();
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const storedUsername = await AuthenticationService.getUsername();
      setUsername(storedUsername);
      
      // Check if this is a master user
      if (storedUsername) {
        const masterUserStatus = await MasterUserService.isMasterUser(storedUsername);
        setIsMasterUser(masterUserStatus);
        
        // Load last sync time for master user
        if (masterUserStatus) {
          const syncTime = await MasterUserService.getLastSyncTime();
          setLastSyncTime(syncTime);
        }
      }
    } catch (error) {
      console.error('Error loading username:', error);
    }
  };

  const checkBiometricAvailability = async () => {
    try {
      const available = await AuthenticationService.isBiometricAvailable();
      const settings = await AuthenticationService.getSettings();
      setBiometricAvailable(available);
      setBiometricEnabled(settings.biometricEnabled);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handlePasswordLogin = async () => {
    if (!masterPassword.trim()) {
      Alert.alert('Error', 'Please enter your master password');
      return;
    }

    setLoading(true);
    try {
      const isValid = await AuthenticationService.verifyMasterPassword(masterPassword);
      
      if (isValid) {
        await AuthenticationService.setLastUnlockTime();
        
        // Set last logged in user
        if (username) {
          await AuthenticationService.setLastLoggedInUser(username);
        }
        
        router.replace('/(tabs)');
      } else {
        Alert.alert('Invalid Password', 'The password you entered is incorrect. Please try again.');
        setMasterPassword('');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Unable to verify password. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    try {
      const success = await AuthenticationService.authenticateWithBiometrics();
      
      if (success) {
        await AuthenticationService.setLastUnlockTime();
        
        // Set last logged in user
        if (username) {
          await AuthenticationService.setLastLoggedInUser(username);
        }
        
        router.replace('/(tabs)');
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication was not successful.');
      }
    } catch (error) {
      Alert.alert('Authentication Error', 'Unable to authenticate with biometrics. Please try again.');
      console.error('Biometric error:', error);
    } finally {
      setBiometricLoading(false);
    }
  };

  const getBiometricIcon = () => {
    if (!biometricAvailable) return 'finger-print-outline';
    // In a real app, you'd check the actual biometric type
    return 'finger-print-outline';
  };

  const getBiometricLabel = () => {
    if (!biometricAvailable) return 'Biometric Not Available';
    return 'Use Biometric';
  };

  const handleHomePress = () => {
    router.push('/landing');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Home Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleHomePress}
          activeOpacity={0.7}
        >
          <Ionicons name="home" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={64} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome Back{username ? `, ${username}` : ''}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your master password to unlock OneLock
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Master Password"
            placeholder="Enter your master password"
            value={masterPassword}
            onChangeText={setMasterPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />

          <View style={styles.passwordToggle}>
            <Button
              title={showPassword ? 'Hide' : 'Show'}
              variant="ghost"
              size="small"
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? 'eye-off' : 'eye'}
            />
          </View>

          <Button
            title="Unlock OneLock"
            onPress={handlePasswordLogin}
            loading={loading}
            disabled={!masterPassword.trim()}
            icon="lock-open"
            gradient={true}
            style={styles.loginButton}
          />
        </Card>

        {biometricAvailable && biometricEnabled && (
          <Card style={styles.biometricCard}>
            <View style={styles.biometricHeader}>
              <Ionicons name="finger-print" size={24} color={colors.accent} />
              <Text style={styles.biometricTitle}>Quick Access</Text>
            </View>
            
            <Button
              title={getBiometricLabel()}
              onPress={handleBiometricLogin}
              loading={biometricLoading}
              disabled={!biometricAvailable}
              icon={getBiometricIcon() as any}
              variant="outline"
              style={styles.biometricButton}
            />
          </Card>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Forgot your password? You'll need to reset the app data.
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
  headerContainer: {
    paddingTop: SPACING.xl + SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    alignItems: 'flex-start',
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
    width: 120,
    height: 120,
    borderRadius: 60,
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
  formCard: {
    marginBottom: SPACING.lg,
  },
  input: {
    marginBottom: SPACING.md,
  },
  passwordToggle: {
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
  },
  loginButton: {
    width: '100%',
  },
  biometricCard: {
    marginBottom: SPACING.xl,
  },
  biometricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  biometricTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.sm,
  },
  biometricButton: {
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
