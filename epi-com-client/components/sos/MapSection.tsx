import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import { EpipenMarker } from '@/components/map/EpipenMarker';
import { Coordinate } from '@/types';
import {ResponderCardProps} from "@/components/sos/ResponderCard";
import {UserMarker} from "@/components/map/UserMarker";

interface Pulse {
    id: string;
    radius: number;
}

interface MapSectionProps {
    location: Coordinate;
    pulses: Pulse[];
    markers: any[];
    pulseMaxRadius: number;
    responders: ResponderCardProps[]
}

const MapSection = forwardRef<MapView, MapSectionProps>(({ location, pulses, markers, pulseMaxRadius, responders }, mapRef) => {
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

            {responders?.map((responder) => (
                <UserMarker user={responder.user} onPress={() => {}} location={location} key={responder.user._id} description=""/>
            ))}

            {pulses.map((pulse) => {
                const opacityStroke = Math.max(0.02, 0.4 - pulse.radius / pulseMaxRadius);
                const opacityFill = Math.max(0.005, 0.1 - pulse.radius / (pulseMaxRadius * 2));

                return (
                    <Circle
                        key={pulse.id}
                        center={location}
                        radius={pulse.radius}
                        strokeColor={`rgba(254,56,92,${opacityStroke})`}
                        fillColor={`rgba(254,56,92,${opacityFill})`}
                        zIndex={-1}
                    />
                );
            })}
        </MapView>
    );
});

export default MapSection;
