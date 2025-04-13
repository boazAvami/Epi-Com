import { useState, useEffect, useCallback } from 'react';
import { EpipenMarker, Location } from '../types';
import { calculateDistance } from '../utils/location';
import { loadMarkers, saveMarkers } from '../utils/storage';

interface UseEpipensResult {
  markers: EpipenMarker[];
  sortedMarkers: EpipenMarker[];
  addMarker: (newMarker: Omit<EpipenMarker, 'id'>) => Promise<void>;
  selectedEpipen: EpipenMarker | null;
  selectEpipen: (marker: EpipenMarker | null) => void;
  isLoading: boolean;
}

/**
 * Hook for managing EpiPen markers
 */
export function useEpipens(userLocation: Location | null): UseEpipensResult {
  const [markers, setMarkers] = useState<EpipenMarker[]>([]);
  const [sortedMarkers, setSortedMarkers] = useState<EpipenMarker[]>([]);
  const [selectedEpipen, setSelectedEpipen] = useState<EpipenMarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved markers
  useEffect(() => {
    const fetchMarkers = async () => {
      setIsLoading(true);
      const savedMarkers = await loadMarkers();
      setMarkers(savedMarkers);
      setIsLoading(false);
    };
    
    fetchMarkers();
  }, []);
  
  // Calculate distances and sort markers when user location changes
  useEffect(() => {
    if (userLocation && markers.length > 0) {
      const markersWithDistance = markers.map(marker => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          marker.location.latitude,
          marker.location.longitude
        );
        
        return {
          ...marker,
          distance
        };
      });
      
      // Sort by distance
      const sorted = [...markersWithDistance].sort((a, b) => 
        (a.distance ?? Infinity) - (b.distance ?? Infinity)
      );
      setSortedMarkers(sorted);
    } else {
      setSortedMarkers(markers);
    }
  }, [userLocation, markers]);
  
  // Add new marker
  const addMarker = useCallback(async (newMarker: Omit<EpipenMarker, 'id'>) => {
    const marker: EpipenMarker = {
      id: Date.now().toString(),
      ...newMarker,
      // Generate a description based on type if not provided
      description: newMarker.description || `${newMarker.type} Injector`
    };
    
    const updatedMarkers = [...markers, marker];
    setMarkers(updatedMarkers);
    
    await saveMarkers(updatedMarkers);
  }, [markers]);
  
  // Select an EpiPen marker
  const selectEpipen = useCallback((marker: EpipenMarker | null) => {
    setSelectedEpipen(marker);
  }, []);

  return {
    markers,
    sortedMarkers,
    addMarker,
    selectedEpipen,
    selectEpipen,
    isLoading
  };
}