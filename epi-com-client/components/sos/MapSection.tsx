// components/sos/map/MapSection.tsx
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { EpipenMarker } from '@/components/map/EpipenMarker';
import { Coordinate } from '@/types';

interface Pulse {
    id: string;
    radius: number;
}

interface MapSectionProps {
    location: Coordinate;
    pulses: Pulse[];
    markers: any[];
    pulseMaxRadius: number;
}

const MapSection = forwardRef<MapView, MapSectionProps>(({ location, pulses, markers, pulseMaxRadius }, mapRef) => {
    return (
        <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
                ...location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            showsUserLocation
            zoomEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
        >
            {markers.map((marker) => (
                <EpipenMarker key={marker.id} marker={marker} onPress={() => {}} />
            ))}

            {pulses.map((pulse) => {

                return (
                    <Circle
                        key={pulse.id}
                        center={location}
                        radius={pulse.radius}
                        strokeColor={`rgba(254,56,92,${pulse.opacity * 0.4}})`}
                        fillColor={`rgba(254,56,92,${pulse.opacity * 0.4})`}
                        zIndex={-1}
                    />
                );
            })}
        </MapView>
    );
});

export default MapSection;
