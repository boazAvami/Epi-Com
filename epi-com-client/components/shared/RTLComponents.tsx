import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle, TextProps, ViewProps } from 'react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface RTLTextProps extends TextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
}

export const RTLText: React.FC<RTLTextProps> = ({ children, style, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  return (
    <Text
      style={[
        isRtl ? styles.rtlText : null,
        Array.isArray(style) ? style : style ? [style] : null
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// RTL-aware Row component for horizontal layouts
interface RTLRowProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const RTLRow: React.FC<RTLRowProps> = ({ children, style, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  return (
    <View
      style={[
        styles.row,
        isRtl ? styles.rtlRow : null,
        Array.isArray(style) ? style : style ? [style] : null
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// RTL-aware View that adjusts alignment for RTL
interface RTLViewProps extends ViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const RTLView: React.FC<RTLViewProps> = ({ children, style, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  return (
    <View
      style={[
        isRtl ? styles.rtlContainer : null,
        Array.isArray(style) ? style : style ? [style] : null
      ]}
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
  rtlContainer: {
    alignItems: 'flex-end',
  }
});