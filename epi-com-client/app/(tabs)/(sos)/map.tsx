import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEpipens } from "@/hooks/useEpipens";
import { Coordinate } from "@/types";
import { EpipenMarker } from "@/components/map/EpipenMarker";
import { useFocusEffect } from "expo-router";
import {useSOS} from "@/hooks/useSOS";

type Pulse = { id: string; radius: number };

const messages = [
    "מחפשים עזרה באזור שלך...",
    "בודקים זמינות מחזיקי אפיפן...",
    "מחברים אותך למי שיכול לעזור...",
    "מתאמים עבורך מענה רפואי...",
    "מקשרים אותך למחזיק אפיפן קרוב...",
    "בודקים אפשרויות תגובה מיידית...",
];

export default function SOSMapScreen() {
    const { sendSOS } = useSOS();
    const idCounter = useRef(0);
    const mapRef = useRef<MapView | null>(null);
    const zoomOutIntervalRef = useRef<number | null>(null);
    const [hasSentSOS, setHasSentSOS] = useState(false);

    const createId = () => {
        idCounter.current += 1;
        return `pulse-${idCounter.current}`;
    };

    const [location, setLocation] = useState<Coordinate | null>(null);
    const { markers } = useEpipens(location);
    const [pulses, setPulses] = useState<Pulse[]>([]);
    const [messageIndex, setMessageIndex] = useState(0);
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;
    const [currentZoom, setCurrentZoom] = useState(0.01);
    const [pulseMaxRadius, setPulseMaxRadius] = useState(500);

    const addPulse = () => {
        setPulses((prev) => [...prev, { id: createId(), radius: 0 }]);
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });


    useEffect(() => {
        if (location && !hasSentSOS) {
            (async () => {
                try {
                    await sendSOS({location});
                    console.log('SOS sent successfully');
                    setHasSentSOS(true);
                } catch (error) {
                    console.error('Failed to send SOS:', error);
                }
            })();
        }
    }, [location, hasSentSOS]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
        })();
    }, []);

    useEffect(() => {
        if (!location) return;

        addPulse();
        const pulseAdder = setInterval(() => {
            addPulse();
        }, 2000);

        const pulseInterval = setInterval(() => {
            setPulses((prev: Pulse[]) =>
                prev
                    .map((p: Pulse) => ({ ...p, radius: p.radius + 2 }))
                    .filter((p) => p.radius <= pulseMaxRadius) // 🚀 מותאם למקסימום דינאמי
            );
        }, 20);

        return () => {
            clearInterval(pulseAdder);
            clearInterval(pulseInterval);
        };
    }, [location, pulseMaxRadius]); // 🚀 נוסיף את pulseMaxRadius לתלות

    useEffect(() => {
        const textInterval = setInterval(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setMessageIndex((prev) => (prev + 1) % messages.length);
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }
            });
        }, 6000);

        return () => clearInterval(textInterval);
    }, []);

    useEffect(() => {
        const spinLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(spinAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );
        spinLoop.start();

        return () => {
            spinLoop.stop();
        };
    }, []);

    const startZoomOut = () => {
        if (zoomOutIntervalRef.current) {
            clearInterval(zoomOutIntervalRef.current);
        }

        zoomOutIntervalRef.current = setInterval(() => {
            setCurrentZoom((prevZoom) => {
                const newZoom = prevZoom * 1.3;

                if (newZoom > 0.5) {
                    if (zoomOutIntervalRef.current) {
                        clearInterval(zoomOutIntervalRef.current);
                        zoomOutIntervalRef.current = null;
                    }
                    return prevZoom;
                }

                if (mapRef.current && location) {
                    mapRef.current.animateToRegion({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: newZoom,
                        longitudeDelta: newZoom,
                    }, 1000);
                }

                // 🚀 הגדלת טווח הפולסים יחד עם הזום
                setPulseMaxRadius((prevRadius) => prevRadius * 1.3);

                return newZoom;
            });
        }, 10000);
    };

    useFocusEffect(
        React.useCallback(() => {
            if (location && mapRef.current) {
                setCurrentZoom(0.01);
                setPulseMaxRadius(500); // 🚀 גם מאפסים טווח פולסים כשחוזרים

                mapRef.current.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 500);

                startZoomOut();
            }

            return () => {
                if (zoomOutIntervalRef.current) {
                    clearInterval(zoomOutIntervalRef.current);
                    zoomOutIntervalRef.current = null;
                }
            };
        }, [location])
    );

    if (!location) return null;

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    ...location,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation
                zoomEnabled={false}
                scrollEnabled={false}
                pitchEnabled={false}
            >
                {markers.map((marker) => (
                    <EpipenMarker
                        key={marker.id}
                        marker={marker}
                        onPress={() => {}}
                    />
                ))}

                {pulses.map((pulse) => {
                    const opacityStroke = Math.max(0.02, 0.4 - pulse.radius / pulseMaxRadius);
                    const opacityFill = Math.max(0.005, 0.1 - pulse.radius / (pulseMaxRadius * 2));

                    return (
                        <Circle
                            key={pulse.id}
                            center={location}
                            radius={pulse.radius}
                            strokeColor={`rgba(254,56,92,${opacityStroke})`}
                            fillColor={`rgba(254,56,92,${opacityFill})`}
                            zIndex={-1}
                        />
                    );
                })}
            </MapView>

            <View style={styles.messageContainer}>
                <Animated.Text style={[styles.messageText, { opacity: opacityAnim }]}>
                    {messages[messageIndex]}
                </Animated.Text>
                <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    messageContainer: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginRight: 8,
    },
    spinner: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: '#FE385C',
        borderTopColor: 'transparent',
        borderRadius: 9,
    },
});
