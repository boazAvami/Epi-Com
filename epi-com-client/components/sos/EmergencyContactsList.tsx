import React from 'react';
import { View, StyleSheet, FlatList, Pressable, Linking } from 'react-native';
import {IEmergencyContact} from "@shared/types";
import {Text} from "@/components/ui/text";
import {Button, ButtonText} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {VStack} from "@/components/ui/vstack";
import {HStack} from "@/components/ui/hstack";
import {Center} from "@/components/ui/center";

type EmergencyContactsListProps = {
    contacts: IEmergencyContact[];
};

const EmergencyContactsList = ({ contacts }: EmergencyContactsListProps) => {
    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const renderItem = ({ item }: { item: IEmergencyContact }) => (
        <Card variant="outline" className="mt-4">
                <HStack space="xl">
                    <Center>
                    <Button onPress={() => handleCall(item.phone)} style={styles.callButton}>
                        <ButtonText style={styles.callText}>☎️ חיוג</ButtonText>
                    </Button>
                    </Center>
                    <VStack>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.phone}>{item.phone}</Text>
                    </VStack>
                </HStack>
        </Card>
    );

    return (
        <FlatList
            data={contacts}
            keyExtractor={(item, index) => `${item.phone}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
        />
    );
};

export default EmergencyContactsList;

const styles = StyleSheet.create({
    list: {
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        textAlign: 'right'
    },
    phone: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
        textAlign: 'right'
    },
    callButton: {
        backgroundColor: '#FE385C',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 999,
    },
    callText: {
        color: '#fff',
        fontWeight: '600',
    },
});
