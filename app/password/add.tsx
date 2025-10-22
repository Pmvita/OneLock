import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { PasswordDataService } from '@/services';
import { PasswordEntry, PasswordCategory } from '@/types';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@/constants';
import { PasswordValidator, URLValidator } from '@/utils';
import { Button, Input, Card, PasswordGeneratorModal } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';

const CATEGORIES: PasswordCategory[] = ['Social', 'Finance', 'Work', 'Shopping', 'Entertainment', 'Other'];

export default function AddPasswordScreen() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState<Partial<PasswordEntry>>({
    title: '',
    username: '',
    email: '',
    password: '',
    url: '',
    category: 'Other',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGenerator, setShowGenerator] = useState(false);

  const updateField = (field: keyof PasswordEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = PasswordValidator.validate(formData.password, {
        minLength: 4,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
      });
      
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (formData.url && !URLValidator.isValidURL(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await PasswordDataService.addPassword(formData as PasswordEntry);
      router.back();
    } catch (error) {
      console.error('Error saving password:', error);
      Alert.alert('Error', 'Failed to save password');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordGenerated = (password: string) => {
    updateField('password', password);
    setShowGenerator(false);
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Input
            label="Title *"
            placeholder="e.g., Facebook, Gmail, Bank Account"
            value={formData.title || ''}
            onChangeText={(value) => updateField('title', value)}
            error={errors.title}
            style={styles.input}
          />

          <Input
            label="Username"
            placeholder="Your username or login ID"
            value={formData.username || ''}
            onChangeText={(value) => updateField('username', value)}
            autoCapitalize="none"
            style={styles.input}
          />

          <Input
            label="Email"
            placeholder="Your email address"
            value={formData.email || ''}
            onChangeText={(value) => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <View style={styles.passwordContainer}>
            <Input
              label="Password *"
              placeholder="Enter your password"
              value={formData.password || ''}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry={true}
              error={errors.password}
              style={styles.passwordInput}
            />
            <Button
              title="Generate"
              onPress={() => setShowGenerator(true)}
              variant="outline"
              size="small"
              icon="key"
              style={styles.generateButton}
            />
          </View>

          <Input
            label="Website URL"
            placeholder="https://example.com"
            value={formData.url || ''}
            onChangeText={(value) => updateField('url', value)}
            keyboardType="default"
            autoCapitalize="none"
            error={errors.url}
            style={styles.input}
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category</Text>
            <View style={styles.categoryButtons}>
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  title={category}
                  onPress={() => updateField('category', category)}
                  variant={formData.category === category ? 'primary' : 'outline'}
                  size="small"
                  style={styles.categoryButton}
                />
              ))}
            </View>
          </View>

          <Input
            label="Notes"
            placeholder="Additional notes or information"
            value={formData.notes || ''}
            onChangeText={(value) => updateField('notes', value)}
            multiline={true}
            numberOfLines={3}
            style={styles.input}
          />
        </Card>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="ghost"
            style={styles.cancelButton}
          />
          <Button
            title="Save Password"
            onPress={handleSave}
            loading={loading}
            icon="checkmark"
            gradient={true}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>

      <PasswordGeneratorModal
        visible={showGenerator}
        onClose={() => setShowGenerator(false)}
        onPasswordGenerated={handlePasswordGenerated}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  formCard: {
    marginBottom: SPACING.lg,
  },
  input: {
    marginBottom: SPACING.md,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  passwordInput: {
    flex: 1,
    marginRight: SPACING.sm,
    marginBottom: 0,
  },
  generateButton: {
    marginBottom: 0,
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
});
