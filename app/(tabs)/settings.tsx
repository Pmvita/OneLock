import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthenticationService } from '@/services';
import { UserSettings, AuthState } from '@/types';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, AUTO_LOCK_OPTIONS } from '@/constants';
import { Button, Card } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    biometricEnabled: false,
    autoLockMinutes: 5,
    theme: 'light',
  });
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [userSettings, auth] = await Promise.all([
        AuthenticationService.getSettings(),
        AuthenticationService.getAuthState(),
      ]);
      console.log('Loaded user settings:', userSettings);
      console.log('Loaded auth state:', auth);
      setSettings(userSettings);
      setAuthState(auth);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    try {
      await AuthenticationService.updateSettings({ [key]: value });
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleChangePassword = () => {
    router.push('/settings/change-password' as any);
  };

  const handleBiometricToggle = async (value: boolean) => {
    console.log('Toggle pressed, value:', value);
    console.log('Current settings:', settings);
    console.log('Auth state:', authState);
    
    if (value && !authState?.biometricAvailable) {
      // For testing purposes, allow enabling even when biometrics not available
      console.log('Biometric not available, but allowing for testing');
      Alert.alert('Biometric Not Available', 'Biometric authentication is not available on this device, but the setting will be saved for testing purposes.');
    }

    // Immediately update the UI state for responsive feedback
    console.log('Updating UI state to:', value);
    setSettings(prev => ({ ...prev, biometricEnabled: value }));

    if (value) {
      // When enabling, try biometric authentication if available
      if (authState?.biometricAvailable) {
        try {
          console.log('Attempting biometric authentication...');
          const success = await AuthenticationService.authenticateWithBiometrics();
          console.log('Biometric authentication result:', success);
          
          if (success) {
            await AuthenticationService.updateSettings({ biometricEnabled: true });
            Alert.alert('Success', 'Biometric authentication has been enabled.');
          } else {
            // Revert the UI state if authentication failed
            console.log('Authentication failed, reverting UI state');
            setSettings(prev => ({ ...prev, biometricEnabled: false }));
            Alert.alert('Authentication Failed', 'Please authenticate to enable biometric login.');
          }
        } catch (error) {
          // Revert the UI state if there was an error
          console.log('Error during authentication, reverting UI state:', error);
          setSettings(prev => ({ ...prev, biometricEnabled: false }));
          console.error('Error enabling biometric:', error);
          Alert.alert('Error', 'Failed to enable biometric authentication.');
        }
      } else {
        // Biometric not available, just save the setting for testing
        try {
          await AuthenticationService.updateSettings({ biometricEnabled: true });
          console.log('Biometric setting saved (testing mode)');
        } catch (error) {
          console.log('Error saving biometric setting:', error);
          setSettings(prev => ({ ...prev, biometricEnabled: false }));
        }
      }
    } else {
      // When disabling, just update the setting
      try {
        console.log('Disabling biometric authentication...');
        await AuthenticationService.updateSettings({ biometricEnabled: false });
        console.log('Biometric authentication disabled successfully');
      } catch (error) {
        // Revert the UI state if there was an error
        console.log('Error disabling biometric, reverting UI state:', error);
        setSettings(prev => ({ ...prev, biometricEnabled: true }));
        console.error('Error disabling biometric:', error);
        Alert.alert('Error', 'Failed to disable biometric authentication.');
      }
    }
  };

  const handleAutoLockChange = (minutes: number) => {
    updateSetting('autoLockMinutes', minutes);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    await setTheme(newTheme);
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will be available in a future update.');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'This feature will be available in a future update.');
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will delete all your passwords and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthenticationService.resetAuthData();
              router.replace('/auth/setup');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset app data');
            }
          },
        },
      ]
    );
  };

  const renderAutoLockOptions = () => {
    return AUTO_LOCK_OPTIONS.map((option) => (
      <Button
        key={option.value}
        title={option.label}
        onPress={() => handleAutoLockChange(option.value)}
        variant={settings.autoLockMinutes === option.value ? 'primary' : 'outline'}
        size="small"
        style={styles.autoLockOption}
      />
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Security Settings */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Change Master Password</Text>
              <Text style={styles.settingDescription}>
                Update your master password for better security
              </Text>
            </View>
            <Button
              title="Change"
              onPress={handleChangePassword}
              variant="outline"
              size="small"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>
                Use Face ID, Touch ID, or fingerprint to unlock
              </Text>
            </View>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={(value) => {
                console.log('Switch onValueChange called with:', value);
                handleBiometricToggle(value);
              }}
              disabled={false} // Allow testing even when biometrics not available
              trackColor={{ false: colors.gray300, true: colors.primary + '50' }}
              thumbColor={settings.biometricEnabled ? colors.primary : colors.gray400}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-Lock</Text>
              <Text style={styles.settingDescription}>
                Automatically lock the app after inactivity
              </Text>
            </View>
          </View>

          <View style={styles.autoLockContainer}>
            {renderAutoLockOptions()}
          </View>
        </Card>

        {/* Appearance Settings */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={24} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred theme
              </Text>
            </View>
          </View>

          <View style={styles.themeContainer}>
            <Button
              title="Light"
              onPress={() => handleThemeChange('light')}
              variant={theme === 'light' ? 'primary' : 'outline'}
              size="small"
              style={styles.themeButton}
            />
            <Button
              title="Dark"
              onPress={() => handleThemeChange('dark')}
              variant={theme === 'dark' ? 'primary' : 'outline'}
              size="small"
              style={styles.themeButton}
            />
            <Button
              title="System"
              onPress={() => handleThemeChange('system')}
              variant={theme === 'system' ? 'primary' : 'outline'}
              size="small"
              style={styles.themeButton}
            />
          </View>
        </Card>

        {/* Data Management */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cloud-download" size={24} color={colors.accent} />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Export your passwords to a secure file
              </Text>
            </View>
            <Button
              title="Export"
              onPress={handleExportData}
              variant="outline"
              size="small"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Import Data</Text>
              <Text style={styles.settingDescription}>
                Import passwords from another password manager
              </Text>
            </View>
            <Button
              title="Import"
              onPress={handleImportData}
              variant="outline"
              size="small"
            />
          </View>
        </Card>

        {/* About */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color={colors.gray500} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2024.01.01</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Developer</Text>
            <Text style={styles.aboutValue}>OneLock Team</Text>
          </View>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.sectionCard, styles.dangerCard] as any}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={24} color={colors.error} />
            <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Reset App</Text>
              <Text style={styles.settingDescription}>
                Delete all passwords and reset to initial setup
              </Text>
            </View>
            <Button
              title="Reset"
              onPress={handleResetApp}
              variant="outline"
              size="small"
              style={styles.dangerButton}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionCard: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
  autoLockContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  autoLockOption: {
    flex: 1,
    minWidth: '30%',
  },
  themeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  themeButton: {
    flex: 1,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  aboutLabel: {
    fontSize: FONT_SIZES.md,
  },
  aboutValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  dangerCard: {
    borderLeftWidth: 4,
  } as any,
  dangerButton: {
    // Will be set dynamically
  },
});
