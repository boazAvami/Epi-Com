import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 160;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PulsingSOSButton = ({
                              onPress,
                              isUrgent,
                              countdownDuration = 10,
                              onTick,
                          }: {
    onPress: () => void;
    isUrgent?: boolean;
    countdownDuration?: number;
    onTick?: (secondsLeft: number) => void;
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const circleAnim = useRef(new Animated.Value(0)).current;
    const intervalRef = useRef<number | null>(null);
    const loopRef = useRef<Animated.CompositeAnimation | null>(null);
    const hasAnimatedRef = useRef(false);

    const startPulse = (urgent: boolean) => {
        if (loopRef.current) loopRef.current.stop();

        scaleAnim.setValue(1);
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: urgent ? 1.2 : 1.08,
                    duration: urgent ? 400 : 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: urgent ? 400 : 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        loopRef.current = loop;
    };

    useEffect(() => {
        startPulse(isUrgent ?? false);
    }, [isUrgent]);

    useFocusEffect(
        React.useCallback(() => {
            if (!hasAnimatedRef.current) {
                hasAnimatedRef.current = true;
                circleAnim.setValue(0);
                Animated.timing(circleAnim, {
                    toValue: 1,
                    duration: countdownDuration * 1000,
                    useNativeDriver: false,
                }).start();
            }

            if (intervalRef.current) clearInterval(intervalRef.current);

            const startTime = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                const secondsLeft = Math.ceil(countdownDuration - elapsed);

                if (secondsLeft <= 0) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    onPress();
                    return;
                }

                if (onTick) onTick(secondsLeft);

                const urgent = secondsLeft <= 3;
                Haptics.impactAsync(
                    urgent ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Soft
                );
            }, 1000);

            return () => {
                if (loopRef.current) loopRef.current.stop();
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                hasAnimatedRef.current = false;
            };
        }, [])
    );



    const strokeDashoffset = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, CIRCUMFERENCE],
    });

    return (
        <View style={styles.wrapper}>
            <Svg width={SIZE} height={SIZE} style={styles.svg}>
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#FECACA"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    opacity={0.3}
                />
                <AnimatedCircle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#FE385C"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                />
            </Svg>

            <Animated.View style={[styles.pulse, { transform: [{ scale: scaleAnim }] }]}>
                <Pressable style={styles.innerButton} onPress={onPress}>
                    <Text style={styles.text}>SOS</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default PulsingSOSButton;

const styles = StyleSheet.create({
    wrapper: {
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    pulse: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FE385C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
    },
    innerButton: {
        width: SIZE - 20,
        height: SIZE - 20,
        borderRadius: (SIZE - 20) / 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FE385C',
        fontFamily: 'Poppins_600SemiBold',
    },
});
