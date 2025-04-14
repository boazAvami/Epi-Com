import { Stack } from 'expo-router';

export default function IndicatorLayout() {
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
