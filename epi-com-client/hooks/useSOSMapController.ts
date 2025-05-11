import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { ILocation, IUser } from '@shared/types';
import { useSOS } from '@/hooks/useSOS';
import { useEpipens } from '@/hooks/useEpipens';
import { SOSNotificationData } from '@/hooks/useSOSNotifications';
import { ESOSNotificationType } from '@shared/types';
import { ResponderCardProps } from "@/components/sos/ResponderCard";

const messages = [
    'מחפשים עזרה באזור שלך...',
    'בודקים זמינות מחזיקי אפיפן...',
    'מחברים אותך למי שיכול לעזור...',
    'מתאמים עבורך מענה רפואי...',
    'מקשרים אותך למחזיק אפיפן קרוב...',
    'בודקים אפשרויות תגובה מיידית...'
];

type Props = {
    mapRef: any;
    bottomSheetRef: any;
    setRespondersData: Dispatch<SetStateAction<ResponderCardProps[]>>;
};

export default function useSOSMapController({ mapRef, bottomSheetRef, setRespondersData }: Props) {
    const router = useRouter();
    const { sendSOS, stopSOS, sendExpandSOSRange } = useSOS();
    const zoomOutIntervalRef = useRef<number | null>(null);
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);

    const [location, setLocation] = useState<ILocation | null>(null);
    const { markers } = useEpipens(location);
    const [showSearchMessages, setShowSearchMessages] = useState(true);
    const [messageIndex, setMessageIndex] = useState(0);
    const [currentZoom, setCurrentZoom] = useState(0.01);
    const [animationSpeedInterval, setAnimationSpeedInterval] = useState(4000);
    const [sosId, setSosId] = useState('');

    const opacityAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;

    const handleCancel = async () => {
        await stopSOS();
        if (zoomOutIntervalRef.current) clearInterval(zoomOutIntervalRef.current);
        if (mapRef.current && location) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 500);
        }
        router.back();
    };

    const listenToResponders = () => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            const data = notification.request.content.data as SOSNotificationData;
            if (data.type === ESOSNotificationType.SOS_RESPONSE) {
                setShowSearchMessages(false);

                const newResponder = {
                    user: data.responder as IUser,
                    userLocation: data.location as ILocation,
                };

                setRespondersData((prev: ResponderCardProps[]) => {
                    const exists = prev.some((r) => r.user._id === newResponder.user._id);
                    if (exists) return prev;
                    return [...prev, newResponder];
                });

                bottomSheetRef.current?.snapToIndex(1);
            }
        });
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        })();
    }, []);

    useEffect(() => {
        if (!location) return;
        (async () => {
            try {
                const sendRes = await sendSOS({ location });
                setSosId(sendRes?.sosId as string);
                listenToResponders();
            } catch (e) {
                console.error('SOS Failed:', e);
            }
        })();
    }, [location]);

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setMessageIndex((prev) => (prev + 1) % messages.length);
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, animationSpeedInterval);
        return () => clearInterval(interval);
    }, [animationSpeedInterval]);

    useEffect(() => {
        const spinLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(spinAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(spinAnim, { toValue: 0, duration: 0, useNativeDriver: true })
            ])
        );
        spinLoop.start();
        return () => spinLoop.stop();
    }, []);

    useEffect(() => {
        if (!location || !mapRef.current) return;

        setCurrentZoom(0.01);
        mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);

        zoomOutIntervalRef.current = setInterval(() => {
            setCurrentZoom((prev) => {
                const nextZoom = prev * 2;
                if (nextZoom > 0.5) return prev;

                mapRef.current?.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: nextZoom,
                    longitudeDelta: nextZoom,
                }, 1000);

                const newRange: number = getNextRange(nextZoom);
                console.log('Expanding search to radius (m):', newRange);
                sendExpandSOSRange({sosId, location, newRange});

                setAnimationSpeedInterval((prev) => Math.max(prev * 0.7, 1000));

                return nextZoom;
            });
        }, 30000);

        return () => {
            if (zoomOutIntervalRef.current) clearInterval(zoomOutIntervalRef.current);
        };
    }, [location, sosId]);

    const getNextRange = (nextZoom: number) => {
        const KM_PER_LAT_DEGREE: number = 111.32;
        return  Math.floor((nextZoom / 2) * KM_PER_LAT_DEGREE * 1000);
    }

    return {
        location,
        markers,
        showSearchMessages,
        messageIndex,
        opacityAnim,
        spinAnim,
        handleCancel,
    };
}
