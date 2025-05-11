import { useState, useEffect, useCallback } from 'react';
import { EpipenMarker, Coordinate } from '../types';
import { calculateDistance } from '../utils/location';
import { addEpiPen, getAllEpiPens } from '../services/graphql/graphqlEpipenService';

interface UseEpipensResult {
  markers: EpipenMarker[];
  sortedMarkers: EpipenMarker[];
  addMarker: (newMarker: Omit<EpipenMarker, 'id'>) => Promise<void>;
  selectedEpipen: EpipenMarker | null;
  selectEpipen: (marker: EpipenMarker | null) => void;
  isLoading: boolean;
  parseEpipen: (epiPen: any) => EpipenMarker;
}

/**
 * Hook for managing EpiPen markers
 */
export function useEpipens(userLocation: Coordinate | null): UseEpipensResult {
  const [markers, setMarkers] = useState<EpipenMarker[]>([]);
  const [sortedMarkers, setSortedMarkers] = useState<EpipenMarker[]>([]);
  const [selectedEpipen, setSelectedEpipen] = useState<EpipenMarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load all markers from server
  useEffect(() => {
    const fetchMarkers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllEpiPens();
        const epiPens = response.allEpiPens;
        
        // Transform the server response to match our local EpipenMarker format
        const transformedEpiPens: EpipenMarker[] = epiPens.map(epiPen => parseEpipen(epiPen));
        
        setMarkers(transformedEpiPens);
      } catch (error) {
        console.error('Failed to fetch EpiPens:', error);
        // Fallback to empty array
        setMarkers([]);
      } finally {
        setIsLoading(false);
      }
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
          marker.coordinate.latitude,
          marker.coordinate.longitude
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
  
  // Add new marker to server
  const addMarker = useCallback(async (newMarker: Omit<EpipenMarker, 'id'>) => {
    try {
      // Prepare data for server
      const epipenServerData = {
        location: {
          latitude: newMarker.coordinate.latitude,
          longitude: newMarker.coordinate.longitude
        },
        description: newMarker.description || `${newMarker.type} Injector`,
        // Date formatting is handled by the GraphQL service to ensure consistency
        expiryDate: newMarker.expireDate,
        contact: {
          name: newMarker.contact?.name || 'Unknown',
          phone: newMarker.contact?.phone || 'Unknown'
        },
        image: newMarker.photo || null,
        serialNumber: newMarker.serialNumber || Date.now().toString(), // Generate a serial number if not provided
        kind: newMarker.type === 'adult' ? 'ADULT' : 'JUNIOR' as 'ADULT' | 'JUNIOR'
      };
      
      // Send to server
      const response = await addEpiPen(epipenServerData);
      
      // Add to local state if server request was successful
      if (response.addEpiPen && response.addEpiPen._id) {
        const marker: EpipenMarker = {
          id: response.addEpiPen._id,
          ...newMarker,
          // Generate a description based on type if not provided
          description: newMarker.description || `${newMarker.type} Injector`
        };
        
        setMarkers(prev => [...prev, marker]);
      }
    } catch (error) {
      console.error('Failed to add EpiPen:', error);
      throw error; // Propagate the original error with its message
    }
  }, []);
  
  // Select an EpiPen marker
  const selectEpipen = useCallback((marker: EpipenMarker | null) => {
    setSelectedEpipen(marker);
  }, []);

  const parseEpipen: (epiPen: any) => EpipenMarker = (epiPen: any) => {
    return {
      id: epiPen._id,
      type: epiPen.kind === 'ADULT' ? 'adult' : 'junior',
      coordinate: {
        latitude: epiPen.location.latitude,
        longitude: epiPen.location.longitude
      },
      description: epiPen.description || `${epiPen.kind.toLowerCase()} Injector`,
      expireDate: epiPen.expiryDate,
      contact: {
        name: epiPen.contact.name,
        phone: epiPen.contact.phone
      },
      photo: epiPen.image,
      serialNumber: epiPen.serialNumber,
      userId: epiPen.userId
    }
  }

  return {
    markers,
    sortedMarkers,
    addMarker,
    selectedEpipen,
    selectEpipen,
    isLoading,
    parseEpipen
  };
}