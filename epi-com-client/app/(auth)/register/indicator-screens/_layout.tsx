import { Stack } from 'expo-router';
import {RegisterProvider} from "@/context/RegisterContext";

export default function AuthLayout() {
    return (
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    gestureEnabled: true,
                    animationMatchesGesture: true,
                    presentation: 'card',
                }}
            />
    );
}
