import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "@/components/ui/button";
import {useIsFocused} from "@react-navigation/core";

type CancelTimerProps = {
    duration?: number;
    resetSignal?: number;
    onFinish: () => void;
    onCancel: () => void;
    onTick?: (secondsLeft: number) => void;
};

const CancelTimer = ({
                         duration = 10,
                         resetSignal,
                         onFinish,
                         onCancel,
                         onTick
                     }: CancelTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isCancelledRef = useRef(false);
    const isUnmountedRef = useRef(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            isUnmountedRef.current = false;
        } else {
            isUnmountedRef.current = true;

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [isFocused]);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        isCancelledRef.current = false;
        setTimeLeft(duration);
        if (onTick) onTick(duration);

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [resetSignal]);

    useEffect(() => {
        if (timeLeft <= 0 && !isCancelledRef.current && !isUnmountedRef.current) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            onFinish();
        } else if (onTick && timeLeft > 0) {
            onTick(timeLeft);
        }
    }, [timeLeft]);

    const handleCancel = () => {
        isCancelledRef.current = true;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        onCancel();
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.text}>
                הקריאה תישלח בעוד {timeLeft} שניות...
            </Text>
            <Button variant="link" onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>ביטול</Text>
            </Button>
        </View>
    );
};

export default CancelTimer;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginTop: 16,
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    cancelButton: {
        paddingVertical: 6,
        paddingHorizontal: 18,
    },
    cancelText: {
        color: '#000',
        fontWeight: '600',
    },
});
