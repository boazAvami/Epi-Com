import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Keyboard, 
  TouchableWithoutFeedback, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import MapView, { Region, MapPressEvent, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { EpipenMarker as EpipenMarkerType } from '../../types';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { EpipenMarker } from '@/components/map/EpipenMarker';
import { MapControls } from '@/components/map/MapControls';
import { colors } from '../../constants/Colors';
import styles from './styles';

// Interface for search results from Nominatim
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  name?: string;
}

export interface EpipenMapRef {
  navigateToMarker: (coordinate: { latitude: number; longitude: number }) => void;
}

interface EpipenMapProps {
  region: Region;
  markers: EpipenMarkerType[];
  selectingLocation: boolean;
  onMarkerPress: (marker: EpipenMarkerType) => void;
  onRegionChange: (region: Region) => void;
  onAddLocation: (coordinate: { latitude: number; longitude: number } | null) => void;
  onSelectLocation: () => void;
  onCurrentLocation: () => void;
}

export const EpipenMap = forwardRef<EpipenMapRef, EpipenMapProps>(({
  region,
  markers,
  selectingLocation,
  onMarkerPress,
  onRegionChange,
  onAddLocation,
  onSelectLocation,
  onCurrentLocation
}, ref) => {
  const { t, isRtl, language } = useAppTranslation();
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [zoomLevel, setZoomLevel] = useState(15); // Default zoom level
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Temporary pin for search results
  const [tempPin, setTempPin] = useState<{
    latitude: number;
    longitude: number;
    title: string;
  } | null>(null);
  
  // Debounce timer for search
  const searchTimerRef = useRef<number | null>(null);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    navigateToMarker: (coordinate: { latitude: number; longitude: number }) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.01, 
          longitudeDelta: 0.01,
        }, 500); 
      }
    }
  }));

  // Toggle map type
  const toggleMapType = useCallback(() => {
    if (mapType === 'standard') {
      setMapType('satellite');
    } else if (mapType === 'satellite') {
      setMapType('terrain');
    } else {
      setMapType('standard');
    }
  }, [mapType]);

  // Handle map press for custom location selection
  const handleMapPress = useCallback((event: MapPressEvent) => {
    if (selectingLocation) {
      const newLocation = event.nativeEvent.coordinate;
      onAddLocation(newLocation);
    } else {
      // Clear temporary pin when map is tapped elsewhere
      setTempPin(null);
    }
    
    // Close search results when map is tapped
    Keyboard.dismiss();
    setSearchFocused(false);
  }, [selectingLocation, onAddLocation]);

  // Add EpiPen at current location
  const handleAddEpipen = useCallback(() => {
    onAddLocation(null);
  }, [onAddLocation]);

  // Calculate zoom level from region
  const handleRegionChange = useCallback((newRegion: Region) => {
    const zoom = Math.round(Math.log(360 / newRegion.longitudeDelta) / Math.LN2);
    setZoomLevel(zoom);
    onRegionChange(newRegion);
  }, [onRegionChange]);
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setSearchFocused(false);
  };
  
  
  const searchPlaces = useCallback(async (query: string) => {
    // Don't search if query is too short
    if (!query || query.trim().length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const acceptLanguage = language === 'en' ? 'en' : 'he';
      const encodedQuery = encodeURIComponent(query);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&addressdetails=1&limit=7&accept-language=${acceptLanguage}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'EpipenApp'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Error searching places:', response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [language]);
  
  // Format a shorter display name from result - only street, city, country
  const getShortDisplayName = (result: SearchResult): string => {
    if (result.address) {
      const addr = result.address;
      const parts: string[] = [];
      
      // Add only street if available
      if (addr.road) {
        parts.push(addr.road);
      }
      
      // Add city/town 
      const locality = addr.city || addr.town || addr.village;
      if (locality && !parts.includes(locality)) {
        parts.push(locality);
      }
      
      // Add country for context
      if (addr.country && !parts.includes(addr.country)) {
        parts.push(addr.country);
      }
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    // Fallback to simplifying the display_name 
    if (result.display_name) {
      const parts = result.display_name.split(', ');
      
      // Try to extract just the key parts from display name
      if (parts.length >= 3) {
        // Get first part (likely street/location), city-like part from middle, and country from end
        return [parts[0], parts[Math.floor(parts.length / 2)], parts[parts.length - 1]].join(', ');
      } else if (parts.length === 2) {
        return parts.join(', ');
      }
      return result.display_name;
    }
    
    return result.name || result.display_name || '';
  };
  
  // Handle search input
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    searchTimerRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };
  
  const handleResultSelect = (result: SearchResult) => {
    // Navigate to selected location
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const locationName = getShortDisplayName(result);
    
    // Add temporary pin at the location
    setTempPin({
      latitude: lat,
      longitude: lon,
      title: locationName
    });
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
    
    // Update search query but keep the pin
    setSearchQuery(locationName);
    setSearchResults([]);
    setSearchFocused(false);
    Keyboard.dismiss();
  };
  
  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setTempPin(null);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          mapType={mapType}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onMapReady={() => setMapReady(true)}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChange}
        >
          {mapReady && markers.map((marker) => (
            <EpipenMarker
              key={marker.id}
              marker={marker}
              onPress={onMarkerPress}
              zoomLevel={zoomLevel}
            />
          ))}
          {tempPin && (
            <Marker
              coordinate={{
                latitude: tempPin.latitude,
                longitude: tempPin.longitude,
              }}
              title={tempPin.title}
              description={t('search.selected_location')}
              onPress={() => {
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    latitude: tempPin.latitude,
                    longitude: tempPin.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }, 500);
                }
              }}
              ref={(ref) => {
                if (ref) {
                  // Make callout appear automatically
                  setTimeout(() => ref.showCallout(), 1000);
                }
              }}
            >
              <View style={styles.tempPinMarker}>
                <Ionicons name="location" size={30} color={colors.primary} />
              </View>
            </Marker>
          )}
        </MapView>

        {/* Location selection overlay */}
        {selectingLocation && (
          <View style={styles.selectLocationOverlay}>
            <Text style={styles.selectLocationText}>{t('add.tap_select')}</Text>
          </View>
        )}

        {/* Search Bar */}
        {!selectingLocation && (
          <View style={styles.searchBarContainer}>
            <View style={[
              styles.searchBar,
              searchFocused && styles.searchBarFocused
            ]}>
              <Ionicons 
                name="search-outline" 
                size={22} 
                color="#888" 
                style={isRtl ? styles.searchIconRtl : styles.searchIcon} 
              />
              <TextInput
                style={[
                  styles.searchInput,
                  isRtl && styles.textRtl
                ]}
                placeholder={t('search.placeholder')}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                returnKeyType="search"
              />
              {isSearching ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.searchIcon} />
              ) : searchQuery.length > 0 ? (
                <TouchableOpacity 
                  onPress={handleClearSearch}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              ) : null}
            </View>
            
            {/* Search Results */}
            {searchFocused && searchResults.length > 0 && !isSearching && (
              <View style={styles.searchResults}>
                <FlatList
                  data={searchResults}
                  keyboardShouldPersistTaps="always"
                  keyExtractor={(item) => item.place_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.resultItem}
                      onPress={() => handleResultSelect(item)}
                    >
                      <Ionicons 
                        name="location-outline" 
                        size={18} 
                        color={colors.secondary} 
                        style={isRtl ? styles.resultIconRtl : styles.resultIcon} 
                      />
                      <Text 
                        style={[
                          styles.resultText,
                          isRtl && styles.textRtl
                        ]}
                        numberOfLines={2}
                      >
                        {getShortDisplayName(item)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            
            {/* No Results Message */}
            {searchFocused && searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
              <View style={styles.searchResults}>
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>{t('search.no_results')}</Text>
                </View>
              </View>
            )}

            {/* Search Loading Message */}
            {searchFocused && searchQuery.length >= 3 && isSearching && (
              <View style={styles.searchResults}>
                <View style={styles.searchingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.searchingText}>{t('search.placeholder')}</Text>
                </View>
              </View>
            )}
          </View>
        )}
        
        {/* Map Controls */}
        <MapControls
          mapType={mapType}
          selectingLocation={selectingLocation}
          onLocationPress={onCurrentLocation}
          onMapTypeChange={toggleMapType}
          onAddLocationPress={onSelectLocation}
          onAddEpipenPress={handleAddEpipen}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});