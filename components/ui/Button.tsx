import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  gradient = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = SPACING.md;
        baseStyle.paddingVertical = SPACING.sm;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingHorizontal = SPACING.xl;
        baseStyle.paddingVertical = SPACING.lg;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingHorizontal = SPACING.lg;
        baseStyle.paddingVertical = SPACING.md;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // primary
        baseStyle.backgroundColor = colors.primary;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: FONT_WEIGHTS.semibold,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = FONT_SIZES.sm;
        break;
      case 'large':
        baseStyle.fontSize = FONT_SIZES.lg;
        break;
      default: // medium
        baseStyle.fontSize = FONT_SIZES.md;
    }

    // Variant styles
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseStyle.color = colors.primary;
        break;
      default:
        baseStyle.color = colors.white;
    }

    return baseStyle;
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          color={getTextStyle().color}
          style={{ marginRight: SPACING.sm }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          color={getTextStyle().color}
          style={{ marginLeft: SPACING.sm }}
        />
      )}
    </>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        activeOpacity={0.8}
      >
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: colors.primary,
              borderRadius: BORDER_RADIUS.md,
            }
          ]}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  shadow?: 'sm' | 'md' | 'lg';
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = SPACING.md,
  shadow = 'md',
  gradient = false,
}) => {
  const { colors } = useTheme();
  const cardStyle: ViewStyle = {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding,
    ...SHADOWS[shadow],
  };

  if (gradient) {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.white,
            borderRadius: BORDER_RADIUS.lg,
          }
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const inputStyle: any = {
    borderWidth: 1,
    borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: disabled ? colors.gray100 : colors.white,
    color: disabled ? colors.gray500 : colors.textPrimary,
  };

  if (multiline) {
    inputStyle.minHeight = numberOfLines! * 24 + SPACING.md * 2;
    inputStyle.textAlignVertical = 'top';
  }

  return (
    <View style={style}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
}) => {
  const { colors } = useTheme();
  const spinnerSize = size === 'small' ? 20 : size === 'large' ? 40 : 30;

  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={spinnerSize} color={color || colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
});
