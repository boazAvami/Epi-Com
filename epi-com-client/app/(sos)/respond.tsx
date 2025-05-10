import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Linking} from 'react-native';
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

export default function SOSResponseScreen() {
    const { sosId, userId, location, timestamp } = useLocalSearchParams();
    const [sosLocation = {longitude: 0, latitude: 0}, setSosLocation] = useState<ILocation>();
    const router = useRouter();
    const [sosUser, setSosUser] = useState<Partial<IUser> | null>(null);
    const {responseToSOS} = useSOS();

    useEffect(() => {
        const getSOSUser = async () => {
            const sosUser: {user: Partial<IUser>} = await GetUser(userId as string);
            setSosUser(sosUser.user);
        }

        setSosLocation(JSON.parse(location as string));
        getSOSUser();
    }, []);

    const handleWazeNavigate = () => {
        const wazeUrl = `waze://?ll=${sosLocation.latitude},${sosLocation.longitude}&navigate=yes`;
        Linking.canOpenURL(wazeUrl)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(wazeUrl);
                } else {
                    return Linking.openURL(`https://waze.com/ul?ll=${sosLocation.latitude},${sosLocation.longitude}&navigate=yes`);
                }
            })
            .catch(err => console.error('Error opening Waze:', err));
    };

    const handleGoogleNavigate = () => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sosLocation.latitude},${sosLocation.longitude}&travelmode=driving`;
        Linking.canOpenURL(googleMapsUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(googleMapsUrl);
                } else {
                    console.warn('Cannot open Google Maps');
                }
            })
            .catch((err) => console.error('Error opening Google Maps:', err));
    };

    const handleHelp = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('לא אושרה גישה למיקום. לא ניתן לשלוח תגובת SOS.');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLocation: ILocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        await responseToSOS(sosId as string, userLocation);

        // TODO: SHOW DETAILS
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
                    <Button onPress={handleGoogleNavigate} style={styles.googleMapsButton}>
                        <Image
                            source={require('../../assets/images/google-maps-logo.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </Button>

                    <Button onPress={handleWazeNavigate} style={styles.wazeButton}>
                        <Image
                            source={require('../../assets/images/waze-logo.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </Button>
                </View>
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>התקבלה קריאת מצוקה!</Text>
                </View>

                <Center>
                    <VStack space="sm">
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
                        <Button onPress={handleHelp} style={styles.primaryButton}>
                            <ButtonText>שתף פרטי מיקום</ButtonText>
                        </Button>
                        <Button variant="link" onPress={handleCannotHelp}>
                            <ButtonText>לא יכול לעזור</ButtonText>
                        </Button>
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
    userBox: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatar: {  marginLeft: 10 },
    name: { fontSize: 18, fontWeight: 'bold' },
    condition: { color: '#555' },
    primaryButton: { marginVertical: 5, width: '40%', backgroundColor: '#FE385C', borderRadius: 20 },
});
