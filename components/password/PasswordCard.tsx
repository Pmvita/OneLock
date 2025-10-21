import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PasswordEntry, PasswordCategory } from '@/types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS, CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants';
import { PasswordStrengthChecker } from '@/utils';

interface PasswordCardProps {
  password: PasswordEntry;
  onPress: () => void;
  onFavoritePress: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
  style?: ViewStyle;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({
  password,
  onPress,
  onFavoritePress,
  onEditPress,
  onDeletePress,
  style,
}) => {
  const strength = PasswordStrengthChecker.checkStrength(password.password);
  const strengthColor = PasswordStrengthChecker.getStrengthColor(strength.level);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.categoryIndicator, { backgroundColor: CATEGORY_COLORS[password.category] }]} />
          <View style={styles.titleTextContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {password.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {password.username || password.email || 'No username'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onFavoritePress}
          style={styles.favoriteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={password.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={password.isFavorite ? COLORS.error : COLORS.gray400}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordText} numberOfLines={1}>
            {'•'.repeat(Math.min(password.password.length, 20))}
          </Text>
          <View style={[styles.strengthIndicator, { backgroundColor: strengthColor }]} />
        </View>

        {password.url && (
          <Text style={styles.urlText} numberOfLines={1}>
            {password.url}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.categoryContainer}>
          <Ionicons
            name={CATEGORY_ICONS[password.category] as any}
            size={14}
            color={CATEGORY_COLORS[password.category]}
          />
          <Text style={[styles.categoryText, { color: CATEGORY_COLORS[password.category] }]}>
            {password.category}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.actionButton}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Ionicons name="create-outline" size={16} color={COLORS.gray500} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDeletePress}
            style={styles.actionButton}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface CategoryBadgeProps {
  category: PasswordCategory;
  count?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  count,
  onPress,
  style,
}) => {
  const color = CATEGORY_COLORS[category];
  const icon = CATEGORY_ICONS[category];

  const content = (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }, style]}>
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.badgeText, { color }]}>
        {category}
      </Text>
      {count !== undefined && (
        <Text style={[styles.badgeCount, { color }]}>
          {count}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

interface StrengthMeterProps {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
  showScore?: boolean;
  style?: ViewStyle;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({
  strength,
  score,
  showScore = false,
  style,
}) => {
  const color = PasswordStrengthChecker.getStrengthColor(strength);
  const percentage = Math.max(0, Math.min(100, score));

  return (
    <View style={[styles.strengthMeter, style]}>
      <View style={styles.strengthBar}>
        <View style={[styles.strengthFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.strengthLabels}>
        <Text style={[styles.strengthLabel, { color }]}>
          {strength.replace('-', ' ').toUpperCase()}
        </Text>
        {showScore && (
          <Text style={[styles.strengthScore, { color }]}>
            {score}%
          </Text>
        )}
      </View>
    </View>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionTitle,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.emptyState, style]}>
      <Ionicons name={icon} size={64} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {actionTitle && onActionPress && (
        <TouchableOpacity
          style={styles.emptyAction}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyActionText}>{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  content: {
    marginBottom: SPACING.sm,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  passwordText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
    fontFamily: 'monospace',
  },
  strengthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  urlText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    marginLeft: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    marginLeft: SPACING.xs,
  },
  badgeCount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.xs,
  },
  strengthMeter: {
    marginVertical: SPACING.sm,
  },
  strengthBar: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  strengthLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  strengthScore: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyActionText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.white,
  },
});
