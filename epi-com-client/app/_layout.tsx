import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/context/authContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../i18n';
import { useAuth as useAuthStore } from '../stores/useAuth';
import { Poppins_400Regular, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useSOSNotifications } from '@/hooks/useSOSNotifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/he';
import SOSModal from "@/components/sos/SOSModal";
import {ILocation} from "@shared/types";

dayjs.extend(relativeTime);
dayjs.locale('he');

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
    return (
        <BottomSheetModalProvider>
            <Slot screenOptions={{ headerShown: false }} />
        </BottomSheetModalProvider>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        Poppins_600SemiBold,
    });

    const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);
    const { modalVisible, setModalVisible, sosInfo } = useSOSNotifications();

    useEffect(() => {
        loadStoredAuth();
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GluestackUIProvider mode="light">
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <AuthProvider>
                        <RootLayoutInner />
                        <SOSModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            userId={sosInfo?.userId as string}
                            location={sosInfo?.location as ILocation}
                            sosId={sosInfo?.sosId as string}
                            timestamp={sosInfo?.timestamp}
                        />
                    </AuthProvider>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </GluestackUIProvider>
        </GestureHandlerRootView>
    );
}
