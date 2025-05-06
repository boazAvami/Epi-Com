import { View } from 'react-native';
import { Center } from "@/components/ui/center";
import React, { useState, useCallback } from "react";
import PulsingSOSButton from "@/components/sos/PulsingSOSButton";
import { VStack } from "@/components/ui/vstack";
import CancelTimer from "@/components/sos/CancelTimer";
import EmergencyContactsList from "@/components/sos/EmergencyContactsList";
import { useAuth } from "@/stores/useAuth";
import { IEmergencyContact } from "@shared/types";
import { useRouter, useFocusEffect } from "expo-router";

export default function SOSScreen() {
    const { user } = useAuth();
    const router = useRouter();

    const [showTimer, setShowTimer] = useState(true);
    const [timerKey, setTimerKey] = useState(0);
    const [isUrgent, setIsUrgent] = useState(false);
    const handleSendSOS = useCallback(() => {
        router.push('/(tabs)/(sos)/map');
    }, [router]);

    const handleCancel = useCallback(() => {
        setShowTimer(false);
        setIsUrgent(false);
    }, []);

    const handleTick = useCallback((secondsLeft: number) => {
        setIsUrgent(secondsLeft <= 3 && secondsLeft > 0);
    }, []);

    useFocusEffect(
        useCallback(() => {
            setShowTimer(true);
            setTimerKey(prev => prev + 1);
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <Center className="p-20 mt-10">
                <VStack space="xl">
                    <PulsingSOSButton onPress={handleSendSOS} isUrgent={isUrgent} />

                    {showTimer && (
                        <CancelTimer
                            resetSignal={timerKey}
                            onFinish={handleSendSOS}
                            onCancel={handleCancel}
                            onTick={handleTick}
                        />
                    )}

                    <EmergencyContactsList contacts={user?.emergencyContacts as IEmergencyContact[]} />
                </VStack>
            </Center>
        </View>
    );
}
