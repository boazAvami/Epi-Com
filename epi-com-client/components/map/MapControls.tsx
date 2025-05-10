import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/Colors';
import { RTLView } from '../shared/RTLComponents';
import styles from './styles';

interface MapControlsProps {
  mapType: 'standard' | 'satellite' | 'terrain';
  selectingLocation: boolean;
  onLocationPress: () => void;
  onMapTypeChange: () => void;
  onAddLocationPress: () => void;
  onAddEpipenPress: () => void;
}

const MapControlsComponent: React.FC<MapControlsProps> = ({
  mapType,
  selectingLocation,
  onLocationPress,
  onMapTypeChange,
  onAddLocationPress,
  onAddEpipenPress
}) => {
  return (
    <RTLView style={styles.mapButtonsContainer}>
      {/* Current Location Button */}
      <TouchableOpacity 
        style={styles.mapButton}
        onPress={onLocationPress}
        accessible={true}
        accessibilityLabel="Current location"
        accessibilityRole="button"
      >
        <Ionicons name="locate" size={22} color={colors.secondary} />
      </TouchableOpacity>
      
      {/* Map Type Button */}
      <TouchableOpacity 
        style={styles.mapButton}
        onPress={onMapTypeChange}
        accessible={true}
        accessibilityLabel="Change map type"
        accessibilityRole="button"
      >
        <MaterialIcons 
          name={mapType === 'standard' ? 'map' : mapType === 'satellite' ? 'satellite' : 'terrain'} 
          size={22} 
          color={colors.secondary} 
        />
      </TouchableOpacity>
      
      {/* Add EpiPen Location Button */}
      <TouchableOpacity 
        style={[
          styles.mapButton, 
          selectingLocation && styles.activeMapButton
        ]}
        onPress={onAddLocationPress}
        accessible={true}
        accessibilityLabel="Select location on map"
        accessibilityRole="button"
      >
        <MaterialIcons 
          name="add-location" 
          size={22} 
          color={selectingLocation ? colors.white : colors.primary} 
        />
      </TouchableOpacity>
      
      {/* Add EpiPen at Current Location Button */}
      <TouchableOpacity 
        style={styles.mapButton}
        onPress={onAddEpipenPress}
        accessible={true}
        accessibilityLabel="Add EpiPen at current location"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={22} color={colors.primary} />
      </TouchableOpacity>
    </RTLView>
  );
};

export const MapControls = memo(MapControlsComponent);