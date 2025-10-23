import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Text} from '../common/Text';

interface SocialLoginButtonProps {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  disabled?: boolean;
  borderRadius?: number;
  loading?: boolean;
}

export function SocialLoginButton({
  label,
  onPress,
  icon,
  style,
  backgroundColor = '#FFFFFF',
  textColor = '#111111',
  borderColor,
  disabled = false,
  borderRadius = 8,
  loading = false,
}: SocialLoginButtonProps) {
  const buttonStyle = ({
    pressed: _pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.button,
    {
      backgroundColor,
      borderColor: borderColor ?? backgroundColor,
      opacity: disabled || loading ? 0.4 : 1,
      borderRadius,
    },
    style,
  ];

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{disabled: disabled || loading}}>
      {({pressed}) => (
        <View style={styles.content}>
          <View style={styles.iconSlot}>
            {loading ? (
              <ActivityIndicator size="small" color={textColor} />
            ) : (
              icon
            )}
          </View>
          <Text
            variant="labelL"
            align="center"
            color={textColor}
            style={pressed ? styles.textPressed : undefined}>
            {label}
          </Text>
          <View style={styles.iconSlot} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconSlot: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPressed: {
    opacity: 0.6,
  },
});
