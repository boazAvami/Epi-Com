import {StyleSheet, View} from 'react-native';
import { Center } from "@/components/ui/center";
import React, { useState, useCallback } from "react";
import PulsingSOSButton from "@/components/sos/PulsingSOSButton";
import { VStack } from "@/components/ui/vstack";
import EmergencyContactsList from "@/components/sos/EmergencyContactsList";
import { useAuth } from "@/stores/useAuth";
import { IEmergencyContact } from "@shared/types";
import { useRouter, useFocusEffect } from "expo-router";
import {Text} from "@/components/ui/text";

export default function SOSScreen() {
    const { user } = useAuth();
    const router = useRouter();

    const [isUrgent, setIsUrgent] = useState(false);
    const handleSendSOS = useCallback(() => {
        router.push('/(sos)/map');
    }, [router]);

    const handleTick = useCallback((secondsLeft: number) => {
        setIsUrgent(secondsLeft <= 3 && secondsLeft > 0);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Center className="p-20 mt-10">
                <VStack space="xl">
                    <Center>
                        <PulsingSOSButton onPress={handleSendSOS} isUrgent={isUrgent} onTick={handleTick}/>
                    </Center>

                    <View style={styles.sosExplanationBox}>
                        <Text style={styles.sosExplanationText}>
                             בלחיצה על כפתור החירום תישלח בקשת עזרה מיידית
                            <Text style={styles.boldText}> למשתמשים בסביבה שמחזיקים אפיפן 🚨</Text>
                        </Text>
                    </View>
                    <EmergencyContactsList contacts={user?.emergencyContacts as IEmergencyContact[]} />
                </VStack>
            </Center>
        </View>
    );
}

const styles = StyleSheet.create({
    sosExplanationBox: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FEF2F2', // אדום בהיר
        borderWidth: 1,
        borderColor: '#FECACA', // גבול אדום בהיר
        borderRadius: 12,
    },
    sosExplanationText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#991B1B', // אדום כהה
    },
    boldText: {
        fontWeight: 'bold',
        color: '#991B1B'
    },
});

