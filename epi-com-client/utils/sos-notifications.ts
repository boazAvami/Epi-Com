import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        console.warn('Push notifications are only available on physical devices');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
}
