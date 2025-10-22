import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PasswordGeneratorOptions } from '@/types';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '@/constants';
import { PasswordGenerator, PasswordStrengthChecker } from '@/utils';
import { Button, Card } from '../ui/Button';
import { useTheme } from '@/contexts/ThemeContext';

interface PasswordGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  onPasswordGenerated: (password: string) => void;
}

export const PasswordGeneratorModal: React.FC<PasswordGeneratorModalProps> = ({
  visible,
  onClose,
  onPasswordGenerated,
}) => {
  const { colors } = useTheme();
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [strength, setStrength] = useState<{ score: number; level: 'weak' | 'medium' | 'strong' | 'very-strong' }>({
    score: 0,
    level: 'weak',
  });

  const generatePassword = () => {
    try {
      const password = PasswordGenerator.generatePassword(options);
      setGeneratedPassword(password);
      const strengthResult = PasswordStrengthChecker.checkStrength(password);
      setStrength(strengthResult);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleGenerate = () => {
    generatePassword();
  };

  const handleUsePassword = () => {
    onPasswordGenerated(generatedPassword);
    onClose();
  };

  const updateOption = (key: keyof PasswordGeneratorOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    if (visible && generatedPassword) {
      generatePassword();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Password Generator</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.passwordCard}>
            <View style={styles.passwordContainer}>
              <Text style={styles.passwordText} numberOfLines={2}>
                {generatedPassword || 'Generate a password to see it here'}
              </Text>
              {generatedPassword && (
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => {
                    // Copy to clipboard functionality would go here
                    console.log('Copy password:', generatedPassword);
                  }}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            {generatedPassword && (
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthLabel}>Strength:</Text>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: `${strength.score}%`,
                        backgroundColor: PasswordStrengthChecker.getStrengthColor(strength.level),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: PasswordStrengthChecker.getStrengthColor(strength.level) }]}>
                  {strength.level.toUpperCase()} ({strength.score}%)
                </Text>
              </View>
            )}
          </Card>

          <Card style={styles.optionsCard}>
            <Text style={styles.sectionTitle}>Password Length</Text>
            <View style={styles.lengthContainer}>
              <Text style={styles.lengthLabel}>{options.length}</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => updateOption('length', Math.max(4, options.length - 1))}
                >
                  <Ionicons name="remove" size={16} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${((options.length - 4) / 28) * 100}%` }
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => updateOption('length', Math.min(32, options.length + 1))}
                >
                  <Ionicons name="add" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          <Card style={styles.optionsCard}>
            <Text style={styles.sectionTitle}>Character Types</Text>
            
            <OptionToggle
              title="Uppercase Letters (A-Z)"
              value={options.includeUppercase}
              onToggle={(value) => updateOption('includeUppercase', value)}
            />
            <OptionToggle
              title="Lowercase Letters (a-z)"
              value={options.includeLowercase}
              onToggle={(value) => updateOption('includeLowercase', value)}
            />
            <OptionToggle
              title="Numbers (0-9)"
              value={options.includeNumbers}
              onToggle={(value) => updateOption('includeNumbers', value)}
            />
            <OptionToggle
              title="Symbols (!@#$%^&*)"
              value={options.includeSymbols}
              onToggle={(value) => updateOption('includeSymbols', value)}
            />
          </Card>

          <Card style={styles.presetCard}>
            <Text style={styles.sectionTitle}>Quick Presets</Text>
            <View style={styles.presetButtons}>
              <Button
                title="Simple"
                variant="outline"
                size="small"
                onPress={() => setOptions({
                  length: 12,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: false,
                })}
                style={styles.presetButton}
              />
              <Button
                title="Strong"
                variant="outline"
                size="small"
                onPress={() => setOptions({
                  length: 16,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                })}
                style={styles.presetButton}
              />
              <Button
                title="Maximum"
                variant="outline"
                size="small"
                onPress={() => setOptions({
                  length: 32,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                })}
                style={styles.presetButton}
              />
            </View>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Generate"
            onPress={handleGenerate}
            icon="refresh"
            style={styles.generateButton}
          />
          {generatedPassword && (
            <Button
              title="Use Password"
              onPress={handleUsePassword}
              icon="checkmark"
              style={styles.useButton}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

interface OptionToggleProps {
  title: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const OptionToggle: React.FC<OptionToggleProps> = ({ title, value, onToggle }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={() => onToggle(!value)}
      activeOpacity={0.7}
    >
      <Text style={styles.optionTitle}>{title}</Text>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  passwordCard: {
    marginBottom: SPACING.md,
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
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  copyButton: {
    padding: SPACING.sm,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthLabel: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.sm,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  optionsCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.md,
  },
  lengthContainer: {
    alignItems: 'center',
  },
  lengthLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  optionTitle: {
    fontSize: FONT_SIZES.md,
    flex: 1,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    // Will be set dynamically
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  presetCard: {
    marginBottom: SPACING.md,
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  generateButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  useButton: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
});
