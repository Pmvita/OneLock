import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PasswordDataService } from '@/services';
import { PasswordEntry } from '@/types';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { PasswordCard, EmptyState } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const [favoritePasswords, setFavoritePasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const allPasswords = await PasswordDataService.loadPasswords();
      const favorites = allPasswords.filter(password => password.isFavorite);
      setFavoritePasswords(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordPress = (password: PasswordEntry) => {
    router.push(`/password/${password.id}`);
  };

  const handleFavoritePress = async (password: PasswordEntry) => {
    try {
      await PasswordDataService.updatePassword(password.id, {
        isFavorite: !password.isFavorite,
      });
      await loadFavorites();
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
              await loadFavorites();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete password');
            }
          },
        },
      ]
    );
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
    
    return (
      <EmptyState
        title="No Favorites Yet"
        description="Mark passwords as favorites by tapping the heart icon to see them here."
        icon="heart-outline"
        actionTitle="Browse Passwords"
        onActionPress={() => router.push('/(tabs)')}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      backgroundColor: colors.white,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    headerSubtitle: {
      fontSize: FONT_SIZES.md,
      color: colors.textSecondary,
    },
    listContent: {
      padding: SPACING.md,
      flexGrow: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Passwords</Text>
        <Text style={styles.headerSubtitle}>
          {favoritePasswords.length} favorite{favoritePasswords.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favoritePasswords}
        renderItem={renderPasswordCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
