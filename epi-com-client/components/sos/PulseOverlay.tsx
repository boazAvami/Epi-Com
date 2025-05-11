import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import MapView from 'react-native-maps';
import {Coordinate} from "@/types";

interface PulseOverlayProps {
    mapRef: React.RefObject<MapView>;
    center: { latitude: number; longitude: number };
    duration?: number;
    delay?: number;
    mapRegion: Coordinate;
}
const PULSE_MAX_RADIUS = 250;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PulseOverlay: React.FC<PulseOverlayProps> = ({
                                                       mapRef,
                                                       center,
                                                       mapRegion,
                                                       duration = 3000,
                                                       delay = 1000,
                                                   }) => {
    const radiusAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0.4)).current;
    const timeoutRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);

    const [screenPosition, setScreenPosition] = useState<{ x: number; y: number } | null>(null);

    const animate = () => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        radiusAnim.setValue(0);
        opacityAnim.setValue(0.4);

        Animated.parallel([
            Animated.timing(radiusAnim, {
                toValue: PULSE_MAX_RADIUS,
                duration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ]).start(() => {
            isAnimatingRef.current = false;
            timeoutRef.current = setTimeout(animate, delay);
        });
    };

    useEffect(() => {
        const updateScreenCoords = async () => {
            try {
                if (!mapRef.current) return;
                const screenPoint = await mapRef.current.pointForCoordinate(center);
                setScreenPosition(screenPoint);
            } catch (e) {
                console.warn('❌ Could not convert coordinate to screen point:', e);
            }
        };

        updateScreenCoords();
    }, [center.latitude, center.longitude, mapRef, mapRegion.latitude, mapRegion.longitude]);

    useEffect(() => {
        timeoutRef.current = setTimeout(animate, delay);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            isAnimatingRef.current = false;
        };
    }, [delay]);

    if (!screenPosition) return null;
    const size: number = PULSE_MAX_RADIUS * 2;

    return (
        <View
            pointerEvents="none"
            style={[
                StyleSheet.absoluteFill,
                {
                    left: screenPosition.x - PULSE_MAX_RADIUS,
                    top: screenPosition.y - PULSE_MAX_RADIUS,
                    width: size,
                    height: size,
                    position: 'absolute',
                },
            ]}
        >
            <Svg width="100%" height="100%">
                <AnimatedCircle
                    cx={PULSE_MAX_RADIUS}
                    cy={PULSE_MAX_RADIUS}
                    r={radiusAnim}
                    stroke="rgba(254,56,92,1)"
                    strokeWidth="2"
                    fill="rgba(254,56,92,0.3)"
                    opacity={opacityAnim}
                />
            </Svg>
        </View>
    );
};

export default PulseOverlay;
