import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";

export function useNotifications() {
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notification) => {
            console.log("📩 Notification received (foreground):", notification);
            // TODO: לטפל בהתראה
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("👉 Notification clicked:", response);
            // TODO: לטפל בניווט או פעולה אחרת
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);
}
