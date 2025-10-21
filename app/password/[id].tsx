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
import { PasswordDataService } from '@/services';
import { PasswordEntry } from '@/types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS, CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants';
import { PasswordStrengthChecker, BreachChecker } from '@/utils';
import { Button, Card, StrengthMeter, CategoryBadge } from '@/components';

export default function PasswordDetailsScreen() {
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
      const data = await PasswordDataService.getPasswordById(id!);
      if (data) {
        setPassword(data);
        checkBreach(data.password);
      } else {
        Alert.alert('Error', 'Password not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading password:', error);
      Alert.alert('Error', 'Failed to load password');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const checkBreach = async (passwordText: string) => {
    setCheckingBreach(true);
    try {
      const result = await BreachChecker.checkPassword(passwordText);
      setBreachResult(result);
    } catch (error) {
      console.error('Error checking breach:', error);
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
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    if (!password) return;

    try {
      await Share.share({
        message: `Password for ${password.title}: ${password.password}`,
        title: `Password: ${password.title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/password/edit/${password?.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Password',
      `Are you sure you want to delete "${password?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await PasswordDataService.deletePassword(password!.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete password');
            }
          },
        },
      ]
    );
  };

  const toggleFavorite = async () => {
    if (!password) return;

    try {
      await PasswordDataService.updatePassword(password.id, {
        isFavorite: !password.isFavorite,
      });
      setPassword(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  if (loading || !password) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const strength = PasswordStrengthChecker.checkStrength(password.password);
  const strengthColor = PasswordStrengthChecker.getStrengthColor(strength.level);

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
                color={password.isFavorite ? COLORS.error : COLORS.gray400}
              />
            </TouchableOpacity>
          </View>

          <CategoryBadge category={password.category} />
        </Card>

        {/* Password Card */}
        <Card style={styles.passwordCard}>
          <View style={styles.passwordHeader}>
            <Text style={styles.sectionTitle}>Password</Text>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <Text style={styles.passwordText} numberOfLines={2}>
              {showPassword ? password.password : '•'.repeat(Math.min(password.password.length, 20))}
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(password.password, 'Password')}
              style={styles.copyButton}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <StrengthMeter
            strength={strength.level}
            score={strength.score}
            showScore={true}
            style={styles.strengthMeter}
          />
        </Card>

        {/* Details Card */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Details</Text>

          {password.username && (
            <DetailRow
              label="Username"
              value={password.username}
              onCopy={() => copyToClipboard(password.username!, 'Username')}
            />
          )}

          {password.email && (
            <DetailRow
              label="Email"
              value={password.email}
              onCopy={() => copyToClipboard(password.email!, 'Email')}
            />
          )}

          {password.url && (
            <DetailRow
              label="Website"
              value={password.url}
              onCopy={() => copyToClipboard(password.url!, 'URL')}
              isUrl={true}
            />
          )}

          <DetailRow
            label="Created"
            value={new Date(password.createdAt).toLocaleDateString()}
          />

          <DetailRow
            label="Last Updated"
            value={new Date(password.updatedAt).toLocaleDateString()}
          />
        </Card>

        {/* Breach Check Card */}
        {breachResult && (
          <Card style={[styles.breachCard, breachResult.isBreached && styles.breachCardWarning] as any}>
            <View style={styles.breachHeader}>
              <Ionicons
                name={breachResult.isBreached ? 'warning' : 'checkmark-circle'}
                size={24}
                color={breachResult.isBreached ? COLORS.error : COLORS.success}
              />
              <Text style={styles.breachTitle}>
                {breachResult.isBreached ? 'Security Alert' : 'Password Safe'}
              </Text>
            </View>
            
            <Text style={styles.breachDescription}>
              {breachResult.isBreached
                ? `This password has been found in ${breachResult.breachCount} data breach(es). Consider changing it immediately.`
                : 'This password has not been found in any known data breaches.'}
            </Text>

            {breachResult.isBreached && breachResult.breachDetails && (
              <View style={styles.breachDetails}>
                {breachResult.breachDetails.map((detail: string, index: number) => (
                  <Text key={index} style={styles.breachDetailItem}>
                    • {detail}
                  </Text>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Notes Card */}
        {password.notes && (
          <Card style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{password.notes}</Text>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Edit"
            onPress={handleEdit}
            icon="create-outline"
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Share"
            onPress={handleShare}
            icon="share-outline"
            variant="outline"
            style={styles.actionButton}
          />
            <Button
              title="Delete"
              onPress={handleDelete}
              icon="trash-outline"
              variant="outline"
              style={[styles.actionButton, styles.deleteButton] as any}
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
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueContainer}>
        <Text style={[styles.detailValue, isUrl && styles.urlText]} numberOfLines={1}>
          {value}
        </Text>
        {onCopy && (
          <TouchableOpacity onPress={onCopy} style={styles.detailCopyButton}>
            <Ionicons name="copy-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  content: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  headerCard: {
    marginBottom: SPACING.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  passwordCard: {
    marginBottom: SPACING.md,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  toggleButton: {
    padding: SPACING.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  passwordText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontFamily: 'monospace',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.gray100,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  copyButton: {
    padding: SPACING.sm,
  },
  strengthMeter: {
    marginTop: SPACING.sm,
  },
  detailsCard: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    marginBottom: SPACING.md,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  urlText: {
    color: COLORS.primary,
  },
  detailCopyButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  breachCard: {
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  } as any,
  breachCardWarning: {
    borderLeftColor: COLORS.error,
  } as any,
  breachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  breachTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  breachDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  breachDetails: {
    marginTop: SPACING.sm,
  },
  breachDetailItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  notesCard: {
    marginBottom: SPACING.md,
  },
  notesText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  } as any,
  deleteButton: {
    borderColor: COLORS.error,
  } as any,
});
