import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ResponderBottomSheet from "@/components/sos/ResponderBottomSheet";
import SearchMessageOverlay from "@/components/sos/SearchMessageOverlay";
import MapSection from "@/components/sos/MapSection";
import useSOSMapController from "@/hooks/useSOSMapController";
import { Button, ButtonText } from "@/components/ui/button";
import {ResponderCardProps} from "@/components/sos/ResponderCard";
import {useAppTranslation} from "@/hooks/useAppTranslation";

export default function SOSMapScreen() {
    const mapRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const [respondersData, setRespondersData] = useState<ResponderCardProps[]>([]);
    const { t } = useAppTranslation();

    const {
        location,
        markers,
        showSearchMessages,
        messageIndex,
        spinAnim,
        opacityAnim,
        handleCancel,
        messages
    } = useSOSMapController({
        mapRef,
        bottomSheetRef,
        setRespondersData,
    });

    if (!location) return null;

    return (
        <>
            <View style={styles.container}>
                <MapSection
                    ref={mapRef}
                    location={location}
                    markers={markers}
                    responders={respondersData}
                />

                <View style={styles.cancelWrapper}>
                    <Button onPress={handleCancel} style={styles.cancelButton}>
                        <ButtonText>{t('buttons.cancel')}</ButtonText>
                    </Button>
                </View>

                <SearchMessageOverlay
                    messages={messages}
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
                mapRef={mapRef}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    cancelWrapper: {
        position: 'absolute',
        top: 50,
        right: 20
    },
    cancelButton: {
        backgroundColor: '#FE385C',
        borderRadius: 20,
        padding: 5,
    }
});
