import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Slot } from 'expo-router';
import {AuthProvider} from '@/context/authContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth as useAuthStore } from '../stores/useAuth';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
    return <Slot screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
    const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);
    useEffect(() => {
        loadStoredAuth();
    }, []);


    useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light"><ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
            <RootLayoutInner />
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider></GluestackUIProvider>
  );
}
