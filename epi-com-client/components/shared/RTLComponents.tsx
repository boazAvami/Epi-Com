import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle, TextProps, ViewProps } from 'react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface RTLTextProps extends TextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[] | undefined;
  className?: string;
}

export const RTLText: React.FC<RTLTextProps> = ({ children, style, className, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  // Create a base style that's always applied
  const baseStyle = isRtl ? styles.rtlText : styles.ltrText;
  
  // Handle different types of style props safely
  let combinedStyle;
  if (Array.isArray(style)) {
    // Filter out any null/undefined values in the array
    combinedStyle = [baseStyle, ...style.filter(s => s !== null && s !== undefined)];
  } else if (style) {
    combinedStyle = [baseStyle, style];
  } else {
    combinedStyle = baseStyle;
  }
  
  return (
    <Text
      style={combinedStyle}
      className={className}
      {...props}
    >
      {children}
    </Text>
  );
};

// RTL-aware Row component for horizontal layouts
interface RTLRowProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[] | undefined;
  className?: string;
}

export const RTLRow: React.FC<RTLRowProps> = ({ children, style, className, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  // Create base styles that won't cause type conflicts
  const baseStyle = isRtl ? { ...styles.row, ...styles.rtlRow } : styles.row;
  
  // Combine with provided styles
  let combinedStyle;
  if (Array.isArray(style)) {
    combinedStyle = [baseStyle, ...style.filter(s => s !== null && s !== undefined)];
  } else if (style) {
    combinedStyle = [baseStyle, style];
  } else {
    combinedStyle = baseStyle;
  }
  
  return (
    <View
      style={combinedStyle}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
};

// RTL-aware View that adjusts alignment for RTL
interface RTLViewProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[] | undefined;
  className?: string;
}

export const RTLView: React.FC<RTLViewProps> = ({ children, style, className, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  // Create base style
  const baseStyle = isRtl ? styles.rtlContainer : styles.ltrContainer;
  
  // Combine with provided styles
  let combinedStyle;
  if (Array.isArray(style)) {
    combinedStyle = [baseStyle, ...style.filter(s => s !== null && s !== undefined)];
  } else if (style) {
    combinedStyle = [baseStyle, style];
  } else {
    combinedStyle = baseStyle;
  }
  
  return (
    <View
      style={combinedStyle}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
  ltrText: {
    textAlign: 'left',
  },
  rtlContainer: {
    alignItems: 'flex-end',
  },
  ltrContainer: {
    alignItems: 'flex-start',
  }
});