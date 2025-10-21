import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PasswordDataService } from '@/services';
import { PasswordEntry, PasswordCategory } from '@/types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, CATEGORY_COLORS, CATEGORY_ICONS, BORDER_RADIUS, SHADOWS } from '@/constants';
import { CategoryBadge, EmptyState } from '@/components';

export default function CategoriesScreen() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<PasswordCategory, number>>({
    Social: 0,
    Finance: 0,
    Work: 0,
    Shopping: 0,
    Entertainment: 0,
    Other: 0,
  });

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      const data = await PasswordDataService.loadPasswords();
      setPasswords(data);
      
      // Calculate category statistics
      const stats: Record<PasswordCategory, number> = {
        Social: 0,
        Finance: 0,
        Work: 0,
        Shopping: 0,
        Entertainment: 0,
        Other: 0,
      };
      
      data.forEach(password => {
        if (password.category in stats) {
          stats[password.category as PasswordCategory]++;
        }
      });
      
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error loading passwords:', error);
    }
  };

  const handleCategoryPress = (category: PasswordCategory) => {
    router.push({
      pathname: '/(tabs)',
      params: { category },
    });
  };

  const renderCategoryCard = ({ item }: { item: PasswordCategory }) => {
    const count = categoryStats[item];
    const color = CATEGORY_COLORS[item];
    const icon = CATEGORY_ICONS[item];

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={32} color={color} />
        </View>
        
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item}</Text>
          <Text style={styles.categoryCount}>{count} password{count !== 1 ? 's' : ''}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
      </TouchableOpacity>
    );
  };

  const categories: PasswordCategory[] = ['Social', 'Finance', 'Work', 'Shopping', 'Entertainment', 'Other'];

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No Categories"
            description="Add some passwords to see them organized by category."
            icon="folder-outline"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  listContent: {
    padding: SPACING.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  categoryCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});
