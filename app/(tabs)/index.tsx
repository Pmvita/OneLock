import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PasswordDataService } from '@/services';
import { PasswordEntry, PasswordCategory, SearchFilters } from '@/types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '@/constants';
import { SearchUtils } from '@/utils';
import { PasswordCard, EmptyState, Button, Input } from '@/components';

export default function VaultScreen() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PasswordCategory | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('name');

  useEffect(() => {
    loadPasswords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [passwords, searchQuery, selectedCategory, showFavoritesOnly, sortBy]);

  const loadPasswords = async () => {
    try {
      const data = await PasswordDataService.loadPasswords();
      setPasswords(data);
    } catch (error) {
      console.error('Error loading passwords:', error);
      Alert.alert('Error', 'Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPasswords();
    setRefreshing(false);
  }, []);

  const applyFilters = () => {
    let filtered = [...passwords];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = SearchUtils.searchPasswords(filtered, searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = SearchUtils.filterByCategory(filtered, selectedCategory);
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = SearchUtils.filterFavorites(filtered);
    }

    // Apply sorting
    filtered = SearchUtils.sortPasswords(filtered, sortBy, 'asc');

    setFilteredPasswords(filtered);
  };

  const handlePasswordPress = (password: PasswordEntry) => {
    router.push(`/password/${password.id}`);
  };

  const handleFavoritePress = async (password: PasswordEntry) => {
    try {
      await PasswordDataService.updatePassword(password.id, {
        isFavorite: !password.isFavorite,
      });
      await loadPasswords();
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleEditPress = (password: PasswordEntry) => {
    router.push(`/password/edit/${password.id}`);
  };

  const handleDeletePress = (password: PasswordEntry) => {
    Alert.alert(
      'Delete Password',
      `Are you sure you want to delete "${password.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await PasswordDataService.deletePassword(password.id);
              await loadPasswords();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete password');
            }
          },
        },
      ]
    );
  };

  const handleAddPassword = () => {
    router.push('/password/add');
  };

  const handleGeneratorPress = () => {
    router.push('/generator' as any);
  };

  const renderPasswordCard = ({ item }: { item: PasswordEntry }) => (
    <PasswordCard
      password={item}
      onPress={() => handlePasswordPress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      onEditPress={() => handleEditPress(item)}
      onDeletePress={() => handleDeletePress(item)}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;
    
    if (passwords.length === 0) {
      return (
        <EmptyState
          title="No Passwords Yet"
          description="Start by adding your first password to secure your accounts."
          icon="shield-outline"
          actionTitle="Add Password"
          onActionPress={handleAddPassword}
        />
      );
    }

    if (filteredPasswords.length === 0) {
      return (
        <EmptyState
          title="No Results Found"
          description="Try adjusting your search or filter criteria."
          icon="search-outline"
          actionTitle="Clear Filters"
          onActionPress={() => {
            setSearchQuery('');
            setSelectedCategory(null);
            setShowFavoritesOnly(false);
          }}
        />
      );
    }

    return null;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search passwords..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !selectedCategory && !showFavoritesOnly && styles.filterButtonActive,
            ]}
            onPress={() => {
              setSelectedCategory(null);
              setShowFavoritesOnly(false);
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                !selectedCategory && !showFavoritesOnly && styles.filterButtonTextActive,
              ]}
            >
              All ({passwords.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              showFavoritesOnly && styles.filterButtonActive,
            ]}
            onPress={() => {
              setSelectedCategory(null);
              setShowFavoritesOnly(!showFavoritesOnly);
            }}
          >
            <Ionicons
              name="heart"
              size={16}
              color={showFavoritesOnly ? COLORS.white : COLORS.gray500}
            />
            <Text
              style={[
                styles.filterButtonText,
                showFavoritesOnly && styles.filterButtonTextActive,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>

          {Object.values(['Social', 'Finance', 'Work', 'Shopping', 'Entertainment', 'Other'] as PasswordCategory[]).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.filterButtonActive,
              ]}
              onPress={() => {
                setSelectedCategory(selectedCategory === category ? null : category);
                setShowFavoritesOnly(false);
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category && styles.filterButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={filteredPasswords}
        renderItem={renderPasswordCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleGeneratorPress}
          activeOpacity={0.8}
        >
          <Ionicons name="key" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabPrimary]}
          onPress={handleAddPassword}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    marginBottom: SPACING.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    marginTop: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray500,
    marginLeft: SPACING.xs,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gray500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.lg,
  },
  fabPrimary: {
    backgroundColor: COLORS.primary,
  },
});
