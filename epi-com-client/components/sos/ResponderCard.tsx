import React, {useEffect, useState} from 'react';
import {Image, Linking, StyleSheet} from 'react-native';
import {ILocation, IUser} from '@shared/types';
import { Phone } from 'lucide-react-native';
import {HStack} from "@/components/ui/hstack";
import {Avatar, AvatarFallbackText, AvatarImage} from "@/components/ui/avatar";
import {VStack} from "@/components/ui/vstack";
import {Text} from "@/components/ui/text";
import {Button, ButtonIcon} from "@/components/ui/button";
import {Center} from "@/components/ui/center";
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import {useNavigationApps} from "@/hooks/useNavigationApps";
import {colors} from "@/constants/Colors";

export interface ResponderCardProps {
    user: IUser;
    userLocation: ILocation
}

export default function ResponderCard({ user, userLocation }: ResponderCardProps) {
    const [distanceText, setDistanceText] = useState<string>('');
    const {handleGoogleNavigate, handleWazeNavigate} = useNavigationApps();

    const getDistanceText = (from: ILocation, to: ILocation) => {
        const dist = haversine(from, to);
        return dist < 1000
            ? `${Math.round(dist)} מטרים ממך`
            : `${(dist / 1000).toFixed(1)} ק״מ ממך`;
    };

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
        }

        const location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    };

    useEffect(() => {
        const getDistanceString = async () => {
            try {
                const loc: ILocation = await getCurrentLocation();

                setDistanceText(getDistanceText(userLocation, loc));
            } catch (e) {
                console.error('❌ Could not get location:', e);
            }
        };

        getDistanceString();
    }, []);

    return (
        <Center style={styles.container}>
            <VStack space="xl">
                <Center>
                    <Avatar size="xl">
                        <AvatarFallbackText>{user?.firstName}</AvatarFallbackText>
                        <AvatarImage
                            source={
                                user?.profile_picture_uri
                                    ? { uri: user?.profile_picture_uri }
                                    : require('@/assets/images/profile_avatar_placeholder.png')
                            }
                        />
                    </Avatar>
                    <Text bold>{user.firstName} {user.lastName}</Text>
                    <Text size="sm">{distanceText || 'מיקום לא ידוע'}</Text>
                </Center>

                <HStack reversed style={styles.buttonsContainer} space="md">
                    {user.phone_number && (
                        <Button size="lg" className="rounded-full p-3" style={styles.phoneButton}
                                onPress={() => Linking.openURL(`tel:${user.phone_number}`)}>
                            <ButtonIcon as={Phone} size="md"/>
                        </Button>
                    )}
                    <Button size="lg" onPress={() => handleGoogleNavigate(userLocation)} className="rounded-full p-3" style={styles.googleMapsButton}>
                        <Image
                            source={require('../../assets/images/google-maps-logo.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </Button>

                    <Button size="lg" onPress={() => handleWazeNavigate(userLocation)} className="rounded-full p-3" style={styles.wazeButton}>
                        <Image
                            source={require('../../assets/images/waze-logo.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain"
                        />
                    </Button>
                </HStack>
            </VStack>
        </Center>

);
}

const styles = StyleSheet.create({
    container: {
      marginTop: 30
    },
    buttonsContainer: {
      margin: 3
    },
    wazeButton: {
        backgroundColor: colors.backgroundMedium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleMapsButton: {
        backgroundColor: colors.backgroundMedium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneButton: {
        backgroundColor: '#3eba54'
    }
});
