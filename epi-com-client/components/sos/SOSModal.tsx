import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { ILocation, IUser } from "@shared/types";
import MapView, { Marker } from "react-native-maps";
import { GetUser } from "@/services/graphql/graphqlUserService";
import * as Location from "expo-location";
import dayjs from "dayjs";
import { useSOS } from "@/hooks/useSOS";
import { useNavigationApps } from "@/hooks/useNavigationApps";
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { colors } from "@/constants/Colors";
import haversine from "haversine-distance";
import {useAppTranslation} from "@/hooks/useAppTranslation";

interface Props {
    visible: boolean;
    onClose: () => void;
    sosId: string;
    userId: string;
    location: ILocation;
    timestamp?: number;
}

const SOSModal: React.FC<Props> = ({ visible, onClose, sosId, userId, location, timestamp }) => {
    const [sosUser, setSosUser] = useState<Partial<IUser> | null>(null);
    const [distanceText, setDistanceText] = useState<string>('');
    const { responseToSOS } = useSOS();
    const { handleGoogleNavigate, handleWazeNavigate } = useNavigationApps();
    const { t } = useAppTranslation();

    useEffect(() => {
        if (!visible) return;
        GetUser(userId).then((res) => setSosUser(res.user));
    }, [visible, userId]);

    const handleHelp = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert(t('sos.locationPermissionDenied'));
            return;
        }

        const current = await Location.getCurrentPositionAsync({});
        await responseToSOS(sosId, {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
        });
        onClose();
    };

    const getTimeString = () => dayjs(Number(timestamp)).fromNow();

    const getDistanceText = (from: ILocation, to: ILocation) => {
        const dist = haversine(from, to);
        return dist < 1000
            ? t('sos.distanceMeters', { meters: Math.round(dist) })
            : t('sos.distanceKm', { km: (dist / 1000).toFixed(1) });
    };

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
        }

        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
        };
    };

    useEffect(() => {
        if (!location) return;

        const getDistanceString = async () => {
            try {
                const loc: ILocation = await getCurrentLocation();
                if (location && loc) {
                    const text: string = getDistanceText(location, loc);

                    if (text) {
                        setDistanceText(getDistanceText(location, loc));
                    }
                }
            } catch (e) {
                console.error('❌ Could not get location:', e);
            }
        };

        getDistanceString();
    }, [location]);

    return (
        <Modal isOpen={visible} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent>
                <ModalBody>
                    <View style={styles.mapContainer}>
                        <Center>
                            <Heading size="md" className="text-typography-950 mb-4">
                                {t('sos.alertReceived')}
                            </Heading>
                        </Center>

                        <MapView
                            showsUserLocation
                            zoomEnabled={false}
                            scrollEnabled={false}
                            pitchEnabled={false}
                            style={styles.map}
                            initialRegion={{ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                        >
                            <Marker coordinate={location} />
                        </MapView>

                        <Button onPress={() => handleGoogleNavigate(location)} style={styles.googleMapsButton}>
                            <Image source={require("@/assets/images/google-maps-logo.png")} style={{ width: 20, height: 20 }} />
                        </Button>

                        <Button onPress={() => handleWazeNavigate(location)} style={styles.wazeButton}>
                            <Image source={require("@/assets/images/waze-logo.png")} style={{ width: 20, height: 20 }} />
                        </Button>
                    </View>

                    <Center>
                        <VStack space="xs" style={styles.userBox}>
                            <Avatar size="xl" style={styles.avatar}>
                                <AvatarFallbackText>{sosUser?.firstName}</AvatarFallbackText>
                                <AvatarImage
                                    source={
                                        sosUser?.profile_picture_uri
                                            ? { uri: sosUser.profile_picture_uri }
                                            : require("@/assets/images/profile_avatar_placeholder.png")
                                    }
                                />
                            </Avatar>
                            <Text style={styles.name}>{sosUser?.firstName} {sosUser?.lastName}</Text>
                            <Text style={styles.time}>{getTimeString()}</Text>
                            <Text style={styles.distance}>{distanceText}</Text>
                        </VStack>
                    </Center>
                </ModalBody>

                <Center>
                    <Button onPress={handleHelp} style={styles.primaryButton}>
                        <ButtonText>{t('sos.shareLocation')}</ButtonText>
                    </Button>
                    <Button variant="link" onPress={onClose}>
                        <ButtonText>{t('sos.cannotHelp')}</ButtonText>
                    </Button>
                </Center>
            </ModalContent>
        </Modal>
    );
};

export default SOSModal;

const styles = StyleSheet.create({
    mapContainer: {
        height: 300,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
    },
    map: { flex: 1 },
    wazeButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundMedium,
        justifyContent: "center",
        alignItems: "center",
    },
    googleMapsButton: {
        position: "absolute",
        bottom: 50,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundMedium,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: { marginLeft: 10 },
    name: { fontSize: 18, fontWeight: "bold" },
    time: { textAlign: "center", color: "#4F4F4F" },
    distance: { textAlign: "center", marginBottom: 12, color: "#4F4F4F" },
    primaryButton: { marginVertical: 5, width: "60%", backgroundColor: "#FE385C", borderRadius: 20 },
    text: { marginBottom: 10, fontSize: 16, textAlign: "center" },
    bold: { fontWeight: "bold" },
    small: { fontSize: 14, fontStyle: "italic" },
    userBox: {alignItems: 'center', justifyContent: 'center' },
});
