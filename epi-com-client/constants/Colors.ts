/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  primary: '#FF385C',
  secondary: '#4285F4',
  warning: '#FF9500',
  error: '#FF3B30',
  backgroundLight: '#FFFFFF',
  backgroundGray: '#F8F8F8',
  backgroundMedium: '#F5F5F5',
  borderLight: '#DDD',
  textDark: '#333333',
  textMedium: '#666666',
  textLight: '#999999',
  white: '#FFFFFF',
  shadow: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  mapOverlay: 'rgba(181, 19, 19, 0.7)'
};
