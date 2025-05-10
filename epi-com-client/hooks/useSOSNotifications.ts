import {useEffect, useRef, useState} from "react";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import {useRouter} from "expo-router";
import {ESOSNotificationType, ILocation, IUser} from "@shared/types";
export type SOSNotificationData = {
    type: ESOSNotificationType;
    sosId?: string;
    userId?: string;
    timestamp?: number;
    location?: ILocation;
    responder?: IUser
};

export function useSOSNotifications() {
    const router = useRouter();
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [sosInfo, setSosInfo] = useState<{
        sosId: string;
        userId: string;
        location: ILocation;
        timestamp?: number;
    } | null>(null);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notification) => {
            const data = notification.request.content.data as SOSNotificationData;

            if (data.type === ESOSNotificationType.SOS_SENT && data.sosId && data.userId && data.location) {
                setSosInfo({
                    sosId: data.sosId,
                    location: data.location,
                    timestamp: data.timestamp,
                    userId: data.userId
                });

                setModalVisible(true);
            }
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data as SOSNotificationData;

            if (data.type === ESOSNotificationType.SOS_SENT) {
                router.push({
                    pathname: "/(sos)/respond",
                    params: {
                        sosId: String(data.sosId),
                        userId: String(data.userId),
                        location: JSON.stringify(data.location),
                        timestamp: data.timestamp,
                    },
                });
            }
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    return {
        modalVisible,
        setModalVisible,
        sosInfo,
    };
}
