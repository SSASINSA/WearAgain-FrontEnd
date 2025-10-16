import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import {typography} from '../../app/theme';

interface TextProps extends RNTextProps {
  variant?:
    | 'displayL'
    | 'displayM'
    | 'headlineL'
    | 'headlineM'
    | 'headlineS'
    | 'labelL'
    | 'labelM'
    | 'labelS'
    | 'bodyL'
    | 'bodyM'
    | 'bodyS'
    | 'bodyS2';
  color?: string;
  weight?: keyof typeof typography.fontWeight;
  align?: 'left' | 'center' | 'right';
  fontFamily?: string;
}

export function Text({
  variant = 'bodyM',
  color = '#000000',
  weight,
  align = 'left',
  fontFamily,
  style,
  children,
  ...props
}: TextProps) {
  const textStyle = [
    typography[variant],
    {
      color: color,
      fontWeight: weight
        ? typography.fontWeight[weight]
        : typography[variant].fontWeight,
      textAlign: align,
      fontFamily: fontFamily || typography[variant].fontFamily,
    },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
}
