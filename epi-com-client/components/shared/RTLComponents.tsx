import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle, TextProps, ViewProps } from 'react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';

interface RTLTextProps extends TextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
  className?: string;
}

export const RTLText: React.FC<RTLTextProps> = ({ children, style, className, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  return (
    <Text
      style={[
        isRtl ? styles.rtlText : styles.ltrText,
        Array.isArray(style) ? style : style ? [style] : null
      ]}
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
  style?: ViewStyle | ViewStyle[];
  className?: string;
}

export const RTLRow: React.FC<RTLRowProps> = ({ children, style, className, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  return (
    <View
      style={[
        styles.row,
        isRtl ? styles.rtlRow : null,
        Array.isArray(style) ? style : style ? [style] : null
      ]}
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
  style?: ViewStyle | ViewStyle[];
  className?: string;
}

export const RTLView: React.FC<RTLViewProps> = ({ children, style, className, ...props }) => {
  const { isRtl } = useAppTranslation();
  
  return (
    <View
      style={[
        isRtl ? styles.rtlContainer : styles.ltrContainer,
        Array.isArray(style) ? style : style ? [style] : null
      ]}
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