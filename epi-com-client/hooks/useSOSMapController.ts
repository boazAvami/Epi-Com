import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import { Animated, Easing } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import {ILocation, IUser} from '@shared/types';
import { useSOS } from '@/hooks/useSOS';
import { useEpipens } from '@/hooks/useEpipens';
import { SOSNotificationData } from '@/hooks/useSOSNotifications';
import { ESOSNotificationType } from '@shared/types';
import {ResponderCardProps} from "@/components/sos/ResponderCard";

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
    setRespondersData: Dispatch<SetStateAction<ResponderCardProps[]>>
};

export default function useSOSMapController({ mapRef, bottomSheetRef, setRespondersData }: Props) {
    const router = useRouter();
    const { sendSOS, stopSOS } = useSOS();
    const zoomOutIntervalRef = useRef<number | null>(null);
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const idCounter = useRef(0);

    const [location, setLocation] = useState<ILocation | null>(null);
    const { markers } = useEpipens(location);
    const [pulses, setPulses] = useState<{ id: string; radius: number }[]>([]);
    const [showSearchMessages, setShowSearchMessages] = useState(true);
    const [messageIndex, setMessageIndex] = useState(0);
    const [currentZoom, setCurrentZoom] = useState(0.01);
    const [pulseMaxRadius, setPulseMaxRadius] = useState(500);
    const [pulseTTL, setPulseTTL] = useState(4000);
    const [animationSpeedInterval, setAnimationSpeedInterval] = useState(4000);

    const opacityAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;

    const createId = () => {
        idCounter.current += 1;
        return `pulse-${idCounter.current}`;
    };

    const addPulse = () => {
        setPulses((prev) => [
            ...prev,
            { id: createId(), radius: 0, createdAt: Date.now(), opacity: 1 }
        ]);
    };


    const handleCancel = async () => {
        await stopSOS();
        if (zoomOutIntervalRef.current) clearInterval(zoomOutIntervalRef.current);
        setPulses([]);
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
                await sendSOS({ location });
                listenToResponders();
            } catch (e) {
                console.error('SOS Failed:', e);
            }
        })();
    }, [location]);

    useEffect(() => {
        if (!location) return;

        addPulse();
        const pulseAdder = setInterval(() => addPulse(), 5000);

        const pulseInterval = setInterval(() => {
            const now = Date.now();
            setPulses((prev) => {
                const now = Date.now();
                return prev
                    .map((p) => {
                        const age = now - p.createdAt;
                        const fade = Math.max(1 - age / pulseTTL, 0);
                        return {...p, radius: p.radius + 3, opacity: fade};
                    })
                    .filter((p) => p.opacity > 0);
            });
        }, 20);

        return () => {
            clearInterval(pulseAdder);
            clearInterval(pulseInterval);
        };
    }, [location, pulseMaxRadius]);



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
        setPulseMaxRadius(1000);

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

                setAnimationSpeedInterval((prev) => Math.max(prev * 0.7, 1000));
                setPulseMaxRadius((r) => r * 3);
                setPulseTTL((ttl) => Math.min(ttl * 1.5, 15000));

                return nextZoom;
            });
        }, 30000);

        return () => {
            if (zoomOutIntervalRef.current) clearInterval(zoomOutIntervalRef.current);
        };
    }, [location]);

    return {
        location,
        pulses,
        markers,
        showSearchMessages,
        messageIndex,
        opacityAnim,
        spinAnim,
        handleCancel,
        pulseMaxRadius,
    };
}
