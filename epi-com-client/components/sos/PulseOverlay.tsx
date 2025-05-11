import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface PulseOverlayProps {
    center: { latitude: number; longitude: number };
    duration?: number;
    delay?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PulseOverlay: React.FC<PulseOverlayProps> = ({
                                                       center,
                                                       duration = 3000,
                                                       delay = 1000,
                                                   }) => {
    const radiusAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0.4)).current;
    const timeoutRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);

    const animate = () => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        radiusAnim.setValue(0);
        opacityAnim.setValue(0.4);

        Animated.parallel([
            Animated.timing(radiusAnim, {
                toValue: 500,
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
        timeoutRef.current = setTimeout(animate, delay);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            isAnimatingRef.current = false;
        };
    }, [center.latitude, center.longitude, 500, duration, delay]);

    return (
        <Svg style={StyleSheet.absoluteFill}>
            <AnimatedCircle
                cx="50%"
                cy="50%"
                r={radiusAnim}
                stroke="rgba(254,56,92,1)"
                strokeWidth="2"
                fill="rgba(254,56,92,0.3)"
                opacity={opacityAnim}
            />
        </Svg>
    );
};

export default PulseOverlay;
