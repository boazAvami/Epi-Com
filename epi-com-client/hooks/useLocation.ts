import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from '../types';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface UseLocationResult {
  location: LocationData | null;
  errorMsg: string | null;
  region: Region;
  setRegion: (region: Region) => void;
  goToCurrentLocation: () => void;
  requestLocationPermission: () => Promise<boolean>;
}

/**
 * Hook for managing user location and map region
 */
export function useLocation(): UseLocationResult {
  const { t } = useAppTranslation();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Default region - TODO : need to set isreal coords 
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  });

  // Request location permission and get current position
  useEffect(() => {
    const getLocation = async () => {
      try {
        const permission = await requestLocationPermission();
        if (!permission) return;

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        if (currentLocation) {
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
          });
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg(t('errors.location_error'));
      }
    };
    
    getLocation();
  }, [t('errors.location_error'), t('errors.location_denied')]);
  
  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg(t('errors.location_denied'));
      return false;
    }
    return true;
  };
  
  const goToCurrentLocation = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });
    }
  };

  return {
    location,
    errorMsg,
    region,
    setRegion,
    goToCurrentLocation,
    requestLocationPermission
  };
}