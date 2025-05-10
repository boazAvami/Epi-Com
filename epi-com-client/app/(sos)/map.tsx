import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IUser } from '@shared/types';
import ResponderBottomSheet from "@/components/sos/ResponderBottomSheet";
import SearchMessageOverlay from "@/components/sos/SearchMessageOverlay";
import MapSection from "@/components/sos/MapSection";
import useSOSMapController from "@/hooks/useSOSMapController";
import { Button, ButtonText } from "@/components/ui/button";
import {ResponderCardProps} from "@/components/sos/ResponderCard";

export default function SOSMapScreen() {
    const mapRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const [respondersData, setRespondersData] = useState<ResponderCardProps[]>([]);

    const {
        location,
        markers,
        showSearchMessages,
        messageIndex,
        spinAnim,
        opacityAnim,
        handleCancel,
        pulseMaxRadius,
    } = useSOSMapController({
        mapRef,
        bottomSheetRef,
        setRespondersData
    });

    if (!location) return null;

    return (
        <>
            <View style={styles.container}>
                <MapSection
                    ref={mapRef}
                    location={location}
                    markers={markers}
                    pulseMaxRadius={pulseMaxRadius}
                    responders={respondersData}
                />

                <View style={styles.cancelWrapper}>
                    <Button onPress={handleCancel} style={styles.cancelButton}>
                        <ButtonText>ביטול</ButtonText>
                    </Button>
                </View>

                <SearchMessageOverlay
                    visible={showSearchMessages}
                    messageIndex={messageIndex}
                    spinAnim={spinAnim}
                    opacityAnim={opacityAnim}
                />
            </View>

            <ResponderBottomSheet
                ref={bottomSheetRef}
                responders={respondersData}
                onCancelSOS={handleCancel}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    cancelWrapper: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 999,
    },
    cancelButton: {
        backgroundColor: '#FE385C',
        borderRadius: 20,
        padding: 5,
    }
});
