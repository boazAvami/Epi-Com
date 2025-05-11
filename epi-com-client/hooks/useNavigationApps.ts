import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import {I18nManager, Linking} from 'react-native';
import { changeLanguage, isRTL } from '../i18n';
import {ILocation} from "@shared/types";

export function useNavigationApps() {
  const handleWazeNavigate = (location: ILocation) => {
    const wazeUrl = `waze://?ll=${location.latitude},${location.longitude}&navigate=yes`;
    Linking.canOpenURL(wazeUrl)
        .then(supported => {
          if (supported) {
            return Linking.openURL(wazeUrl);
          } else {
            return Linking.openURL(`https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes`);
          }
        })
        .catch(err => console.error('Error opening Waze:', err));
  };

  const handleGoogleNavigate = (location: ILocation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=driving`;
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

  return {
      handleGoogleNavigate,
      handleWazeNavigate
  }
}