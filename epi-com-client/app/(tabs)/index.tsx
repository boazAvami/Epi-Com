import React, { useState, useCallback, useRef } from 'react';
import { View, StatusBar } from 'react-native';
import { useAuth } from '@/context/authContext';
import { useLocation } from '../../hooks/useLocation';
import { useEpipens } from '../../hooks/useEpipens';
import { Coordinate, EpipenMarker } from '../../types';
import { Header } from '../../components/shared/Header';
import { EpipenMap, EpipenMapRef } from '../../components/map/EpipenMap';
import { EpipenList } from '../../components/epipenList/EpipenList';
import { EpipenDetails } from '../../components/epipenDetails/EpipenDetails';
import { AddEpipenModal } from '../../components/addEpipen/AddEpipenModal';
import { EpipenFormData } from '../../components/addEpipen/EpipenForm';
import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';

export default function HomeScreen() {
  const { logout } = useAuth();
  const { location, errorMsg, region, setRegion, goToCurrentLocation } = useLocation();
  const { markers, sortedMarkers, addMarker, selectedEpipen, selectEpipen } = useEpipens(
    location?.coords || null
  );
  const mapRef = useRef<EpipenMapRef>(null);
  
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingLocation, setSelectingLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState<Coordinate | null>(null);
  
  // Handle marker selection
  const handleMarkerSelect = useCallback((marker: EpipenMarker) => {
    // Find the marker in sortedMarkers to get the one with distance information
    const markerWithDistance = sortedMarkers.find(m => m.id === marker.id) || marker;
    
    selectEpipen(markerWithDistance);
    setViewMode('details');

    mapRef.current?.navigateToMarker(marker.coordinate);
  }, [selectEpipen, sortedMarkers]);
  
  // Handle closing details
  const handleCloseDetails = useCallback(() => {
    selectEpipen(null);
    setViewMode('list');
  }, [selectEpipen]);
  
  // Handle adding a new marker
  const handleAddMarker = useCallback((data: EpipenFormData) => {
    addMarker(data);
    setModalVisible(false);
    setSelectingLocation(false);
    setCustomLocation(null);
  }, [addMarker]);
  
  // Handle adding location from map
  const handleAddLocation = useCallback((coordinate: Coordinate | null) => {
    if (coordinate) {
      setCustomLocation(coordinate);
    }
      setSelectingLocation(false);
      setModalVisible(true);
  }, []);
  
  // Handle selecting location on map
  const handleSelectLocation = useCallback(() => {
    setModalVisible(false);
    setSelectingLocation(true);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Header onLogout={logout} />
      
      <EpipenMap
          ref={mapRef}
          region={region}
        markers={markers}
        selectingLocation={selectingLocation}
        onMarkerPress={handleMarkerSelect}
        onRegionChange={setRegion}
        onAddLocation={handleAddLocation}
        onSelectLocation={handleSelectLocation}
        onCurrentLocation={goToCurrentLocation}
      />
      
      {/* Conditionally render list or details view */}
      {viewMode === 'list' ? (
        <EpipenList 
          markers={sortedMarkers} 
          onSelectEpipen={handleMarkerSelect} 
        />
      ) : (
        selectedEpipen && (
          <EpipenDetails 
            epipen={selectedEpipen} 
            onClose={handleCloseDetails} 
          />
        )
      )}
      
      {/* Add EpiPen Modal */}
      <AddEpipenModal
        visible={modalVisible}
        selectingLocation={selectingLocation}
        onCancel={() => {
          setModalVisible(false);
          setSelectingLocation(false);
          setCustomLocation(null);
        }}
        onSave={handleAddMarker}
        userLocation={location?.coords || null}
        customLocation={customLocation}
        onSelectCustomLocation={handleSelectLocation}
      />
    </View>
  );
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  }
});
