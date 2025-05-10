import React, { memo } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Marker } from 'react-native-maps';
import { EpipenMarker as EpipenMarkerType } from '../../types';
import { colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

interface EpipenMarkerProps {
  marker: EpipenMarkerType;
  onPress: (marker: EpipenMarkerType) => void;
  zoomLevel?: number;
}

const EpipenMarkerComponent: React.FC<EpipenMarkerProps> = ({ 
  marker, 
  onPress,
  zoomLevel = 15 // Default zoom level
}) => {
  const markerColor = marker.type === 'adult' ? colors.primary : colors.warning;
  
  // Get marker title for display
  const getDisplayTitle = () => {
    return marker.type === 'adult' ? 'Adult EpiPen' : 'Junior EpiPen';
  };
  
  // Calculate marker size based on zoom level
  const getMarkerStyle = (): ViewStyle => {
    // Base size at zoom level 15
    const baseSize = 24;
    
    // Adjust size based on zoom level
    let size = baseSize;
    if (zoomLevel && zoomLevel > 15) {
      // Make marker bigger when zoomed in
      size = baseSize + (zoomLevel - 15) * 2;
    } else if (zoomLevel && zoomLevel < 15) {
      // Make marker smaller when zoomed out
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
  
  // Calculate icon size based on marker size
  const getIconSize = () => {
    const markerSize = getMarkerStyle().width as number;
    return Math.max(12, markerSize * 0.5); // 50% of marker size, minimum 12
  };
  
  return (
    <Marker
      key={marker.id}
      coordinate={marker.coordinate}
      title={getDisplayTitle()}
      description={marker.description}
      onPress={() => onPress(marker)}
    >
      <View style={getMarkerStyle()}>
        <Ionicons name="medkit" size={5} color={colors.white} />
      </View>
    </Marker>
  );
};

export const EpipenMarker = memo(EpipenMarkerComponent);