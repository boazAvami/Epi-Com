import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import {useRouter} from "expo-router";
type SOSNotificationData = {
    type: "sos";
    sosId: string;
    userId: string;
    location: {
        latitude: number;
        longitude: number;
    };
};

export function useSOSNotifications() {
    const router = useRouter();
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notification) => {
            console.log("📩 Notification received (foreground):", notification);
            // TODO: לטפל בהתראה
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data as SOSNotificationData;

            if (data.type === "sos") {
                router.push({
                    pathname: "/(sos)/respond",
                    params: {
                        sosId: String(data.sosId),
                        userId: String(data.userId),
                        lat: data.location.latitude.toString(),
                        lng: data.location.longitude.toString(),
                    },
                });
            }
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);
}
