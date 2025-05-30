import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, ButtonText} from '@/components/ui/button';
import MapView, { Marker } from 'react-native-maps';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {GetUser} from "@/services/graphql/graphqlUserService";
import {ILocation, IUser} from "@shared/types";
import {Avatar, AvatarFallbackText, AvatarImage} from "@/components/ui/avatar";
import {VStack} from "@/components/ui/vstack";
import {Text} from "@/components/ui/text";
import dayjs from "dayjs";
import {Center} from "@/components/ui/center";
import {colors} from "@/constants/Colors";
import {useSOS} from "@/hooks/useSOS";
import * as Location from 'expo-location';
import {useNavigationApps} from "@/hooks/useNavigationApps";
import {useAppTranslation} from "@/hooks/useAppTranslation";

export default function SOSResponseScreen() {
    const { sosId, userId, location, timestamp } = useLocalSearchParams();
    const { handleWazeNavigate, handleGoogleNavigate } = useNavigationApps();
    const [sosLocation = {longitude: 0, latitude: 0}, setSosLocation] = useState<ILocation>();
    const router = useRouter();
    const [sosUser, setSosUser] = useState<Partial<IUser> | null>(null);
    const [hasSharedLocation, setHasSharedLocation] = useState(false);
    const {responseToSOS} = useSOS();
    const { t } = useAppTranslation();

    useEffect(() => {
        const getSOSUser = async () => {
            const sosUser: {user: Partial<IUser>} = await GetUser(userId as string);
            setSosUser(sosUser.user);
        }

        setSosLocation(JSON.parse(location as string));
        setHasSharedLocation(false);
        getSOSUser();
    }, []);

    const handleHelp = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert(t('sos.locationPermissionDenied'));
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLocation: ILocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        await responseToSOS(sosId as string, userLocation);
        setHasSharedLocation(true);
    };

    const handleCannotHelp = () => {
        router.push('/(tabs)')
    };

    const getTimeString: () => string = () => dayjs(new Date(Number(timestamp))).fromNow();

    return (
        <View style={styles.container}>
            <VStack space="md">

                <View style={styles.mapContainer}>
                    <MapView showsUserLocation
                                             zoomEnabled={false}
                                             scrollEnabled={false}
                                             pitchEnabled={false}
                                             style={styles.map}
                                             initialRegion={{ ...sosLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
                        <Marker coordinate={sosLocation} />
                    </MapView>
                    <Button onPress={() => handleGoogleNavigate(sosLocation)} style={styles.googleMapsButton}>
                        <Image
                            source={require('../../assets/images/google-maps-logo.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </Button>

                    <Button onPress={() => handleWazeNavigate(sosLocation)} style={styles.wazeButton}>
                        <Image
                            source={require('../../assets/images/waze-logo.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </Button>
                </View>
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>{t('sos.alertReceived')}</Text>
                </View>

                <Center>
                    <VStack space="sm" style={styles.userBox}>
                        <Avatar size="xl" style={styles.avatar}>
                            <AvatarFallbackText>{sosUser?.firstName}</AvatarFallbackText>
                            <AvatarImage
                                source={
                                    sosUser?.profile_picture_uri
                                        ? { uri: sosUser?.profile_picture_uri }
                                        : require('@/assets/images/profile_avatar_placeholder.png')
                                }
                            />
                        </Avatar>
                        <Text style={styles.name}>{sosUser?.firstName} {sosUser?.lastName}</Text>
                        <Text style={styles.time}>{getTimeString()}</Text>
                    </VStack>
                </Center>

                 <VStack>
                    <Center>
                        {hasSharedLocation ?
                            <Text>{t('sos.locationSharedSuccess')}</Text>
                            : <>
                                <Button onPress={handleHelp} style={styles.primaryButton}>
                                    <ButtonText>{t('sos.shareLocation')}</ButtonText>
                                </Button>
                                <Button variant="link" onPress={handleCannotHelp}>
                                    <ButtonText>{t('sos.cannotHelp')}</ButtonText>
                                </Button>
                            </>}
                    </Center>
                </VStack>
            </VStack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, marginTop: 50 },
    alertBox: { backgroundColor: '#fee', padding: 12, borderRadius: 8, borderColor: '#f00', borderWidth: 1, marginBottom: 8 },
    alertText: { color: '#d00', fontWeight: 'bold', textAlign: 'center' },
    time: { textAlign: 'center', marginBottom: 12, color: '#4F4F4F' },
    mapContainer: { height: 300, borderRadius: 12, overflow: 'hidden', marginBottom: 12, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' },
    map: { flex: 1 },
    wazeButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundMedium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleMapsButton: {
        position: 'absolute',
        bottom: 50,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundMedium,
        justifyContent: 'center',
        alignItems: 'center'
    }
    ,
    userBox: {alignItems: 'center', justifyContent: 'center' },
    avatar: {  marginLeft: 10 },
    name: { fontSize: 18, fontWeight: 'bold' },
    condition: { color: '#555' },
    primaryButton: { marginVertical: 5, width: '70%', backgroundColor: '#FE385C', borderRadius: 20 },
});
