import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { Marker } from 'react-native-maps';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {ILocation, IUser} from "@shared/types";

interface UserMarkerProps {
  user: IUser;
  location: ILocation;
  description: string;
  onPress: (user: IUser) => void;
  zoomLevel?: number;
}

const UserMarkerComponent: React.FC<UserMarkerProps> = ({
  user,
  onPress,
  zoomLevel = 15,
  location,
  description
}) => {
  const markerColor = '#2196F3';

  const getMarkerStyle = (): ViewStyle => {
    const baseSize = 24;
    
    let size = baseSize;
    if (zoomLevel && zoomLevel > 15) {
      size = baseSize + (zoomLevel - 15) * 2;
    } else if (zoomLevel && zoomLevel < 15) {
      size = Math.max(16, baseSize - (15 - zoomLevel) * 2);
    }
    
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: markerColor,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 2,
      borderColor: colors.white,
    };
  };

  return (
    <Marker
      key={user._id}
      coordinate={location}
      title={user.firstName + ' ' + user.lastName}
      description={description}
      onPress={() => onPress(user)}
    >
      <View style={getMarkerStyle()}>
        <Ionicons name="person" size={10} color={colors.white} />
      </View>
    </Marker>
  );
};

export const UserMarker = memo(UserMarkerComponent);