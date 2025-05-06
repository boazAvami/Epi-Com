import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';

const PulsingSOSButton = ({ onPress, isUrgent }: { onPress: () => void; isUrgent?: boolean }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const loopRef = useRef<Animated.CompositeAnimation | null>(null);

    const startAnimation = (urgent: boolean) => {
        if (loopRef.current) {
            loopRef.current.stop();
            loopRef.current = null;
        }

        scaleAnim.stopAnimation(() => {
            scaleAnim.setValue(1);

            const loop = Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: urgent ? 1.3 : 1.15,
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
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            startAnimation(isUrgent ?? false);

            // 🧠 נתחיל רטט רק כשנכנסים
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                if (isUrgent) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                } else {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                }
            }, isUrgent ? 500 : 1000);

            return () => {
                if (loopRef.current) {
                    loopRef.current.stop();
                }
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        }, [isUrgent])
    );

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.animatedCircle, { transform: [{ scale: scaleAnim }] }]}>
                <Pressable style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>SOS</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default PulsingSOSButton;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#FE385C',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FE385C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
    },
    button: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FE385C',
        fontSize: 32,
        fontFamily: 'Poppins_600SemiBold',
        fontWeight: 'bold',
    },
});
