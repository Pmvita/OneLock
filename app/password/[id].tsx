import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { PasswordEntry } from '@/types';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS, CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants';
import { PasswordStrengthChecker, BreachChecker } from '@/utils';
import { Button, Card, StrengthMeter, CategoryBadge } from '@/components';

export default function PasswordDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [password, setPassword] = useState<PasswordEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [breachResult, setBreachResult] = useState<any>(null);
  const [checkingBreach, setCheckingBreach] = useState(false);

  useEffect(() => {
    if (id) {
      loadPassword();
    }
  }, [id]);

  const loadPassword = async () => {
    try {
      // This would normally load from storage
      // For now, we'll use a mock password
      const mockPassword: PasswordEntry = {
        id: id!,
        title: 'Example Password',
        username: 'user@example.com',
        password: 'SecurePassword123!',
        url: 'https://example.com',
        category: 'Work',
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setPassword(mockPassword);
      checkBreachStatus(mockPassword.password);
    } catch (error) {
      console.error('Error loading password:', error);
      Alert.alert('Error', 'Failed to load password details');
    } finally {
      setLoading(false);
    }
  };

  const checkBreachStatus = async (passwordText: string) => {
    setCheckingBreach(true);
    try {
      const result = await BreachChecker.checkPassword(passwordText);
      setBreachResult(result);
    } catch (error) {
      console.error('Error checking breach status:', error);
    } finally {
      setCheckingBreach(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied', `${label} copied to clipboard`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const toggleFavorite = async () => {
    if (!password) return;

    try {
      // This would normally update in storage
      setPassword({ ...password, isFavorite: !password.isFavorite });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/password/add?id=${password?.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Password',
      'Are you sure you want to delete this password? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // This would normally delete from storage
              router.back();
            } catch (error) {
              console.error('Error deleting password:', error);
              Alert.alert('Error', 'Failed to delete password');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!password) return;

    try {
      await Share.share({
        message: `Password for ${password.title}: ${password.password}`,
        title: `Password: ${password.title}`,
      });
    } catch (error) {
      console.error('Error sharing password:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!password) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Password not found</Text>
      </View>
    );
  }

  const strength = PasswordStrengthChecker.checkStrength(password.password);
  const strengthColor = PasswordStrengthChecker.getStrengthColor(strength.level);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      padding: SPACING.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
    },
    loadingText: {
      fontSize: FONT_SIZES.md,
      color: colors.textPrimary,
      marginTop: SPACING.md,
    },
    headerCard: {
      marginBottom: SPACING.md,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryIndicator: {
      width: 4,
      height: 40,
      borderRadius: 2,
      marginRight: SPACING.md,
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
    },
    favoriteButton: {
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.md,
    },
    passwordText: {
      flex: 1,
      fontSize: FONT_SIZES.md,
      fontFamily: 'monospace',
      color: colors.textPrimary,
      backgroundColor: colors.gray100,
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.sm,
    },
    copyButton: {
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
    },
    strengthContainer: {
      marginTop: SPACING.md,
    },
    strengthLabel: {
      fontSize: FONT_SIZES.sm,
      color: colors.textSecondary,
      marginBottom: SPACING.xs,
    },
    strengthBar: {
      height: 6,
      backgroundColor: colors.gray200,
      borderRadius: 3,
      overflow: 'hidden',
    },
    strengthFill: {
      height: '100%',
      borderRadius: 3,
    },
    strengthText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      marginTop: SPACING.xs,
    },
    detailsCard: {
      marginBottom: SPACING.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailLabel: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: colors.textSecondary,
      width: 80,
    },
    detailValue: {
      flex: 1,
      fontSize: FONT_SIZES.md,
      color: colors.textPrimary,
    },
    urlText: {
      color: colors.primary,
    },
    detailCopyButton: {
      padding: SPACING.xs,
      marginLeft: SPACING.sm,
    },
    breachCard: {
      marginBottom: SPACING.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
    } as any,
    breachCardWarning: {
      borderLeftColor: colors.error,
    } as any,
    breachHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    breachTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.semibold,
      color: colors.textPrimary,
      marginLeft: SPACING.sm,
    },
    breachDescription: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginTop: SPACING.lg,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: SPACING.xs,
    } as any,
    deleteButton: {
      borderColor: colors.error,
    } as any,
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.titleContainer}>
            <View style={[styles.categoryIndicator, { backgroundColor: CATEGORY_COLORS[password.category] }]} />
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{password.title}</Text>
              <Text style={styles.subtitle}>
                {password.username || password.email || 'No username'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={toggleFavorite}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={password.isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={password.isFavorite ? colors.error : colors.gray400}
              />
            </TouchableOpacity>
          </View>

          <CategoryBadge category={password.category} />

          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText}>
              {showPassword ? password.password : '•'.repeat(password.password.length)}
            </Text>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => copyToClipboard(password.password, 'Password')}
              style={styles.copyButton}
            >
              <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <StrengthMeter
            strength={strength.level}
            score={strength.score}
            style={styles.strengthContainer}
          />
        </Card>

        {/* Breach Check Card */}
        {breachResult && (
          <Card style={[styles.breachCard, breachResult.isBreached && styles.breachCardWarning] as any}>
            <View style={styles.breachHeader}>
              <Ionicons
                name={breachResult.isBreached ? 'warning' : 'checkmark-circle'}
                size={24}
                color={breachResult.isBreached ? colors.error : colors.success}
              />
              <Text style={styles.breachTitle}>
                {breachResult.isBreached ? 'Security Alert' : 'Password Safe'}
              </Text>
            </View>
            <Text style={styles.breachDescription}>
              {breachResult.isBreached
                ? 'This password has been found in data breaches. We recommend changing it immediately.'
                : 'This password has not been found in any known data breaches.'}
            </Text>
          </Card>
        )}

        {/* Details Card */}
        <Card style={styles.detailsCard}>
          <DetailRow
            label="Username"
            value={password.username || password.email || 'Not set'}
            onCopy={() => copyToClipboard(password.username || password.email || '', 'Username')}
          />
          <DetailRow
            label="URL"
            value={password.url || 'Not set'}
            onCopy={() => copyToClipboard(password.url || '', 'URL')}
            isUrl={!!password.url}
          />
          <DetailRow
            label="Category"
            value={password.category}
          />
          <DetailRow
            label="Created"
            value={new Date(password.createdAt).toLocaleDateString()}
          />
          <DetailRow
            label="Updated"
            value={new Date(password.updatedAt).toLocaleDateString()}
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="outline"
            icon="create-outline"
            style={styles.actionButton}
          />
          <Button
            title="Share"
            onPress={handleShare}
            variant="outline"
            icon="share-outline"
            style={styles.actionButton}
          />
          <Button
            title="Delete"
            onPress={handleDelete}
            variant="outline"
            icon="trash-outline"
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  onCopy?: () => void;
  isUrl?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, onCopy, isUrl }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isUrl && styles.urlText]} numberOfLines={1}>
        {value}
      </Text>
      {onCopy && (
        <TouchableOpacity onPress={onCopy} style={styles.detailCopyButton}>
          <Ionicons name="copy-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};