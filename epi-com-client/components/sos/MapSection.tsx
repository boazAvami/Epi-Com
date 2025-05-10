import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import { EpipenMarker } from '@/components/map/EpipenMarker';
import { Coordinate } from '@/types';
import {ResponderCardProps} from "@/components/sos/ResponderCard";
import {UserMarker} from "@/components/map/UserMarker";
import PulseOverlay from "@/components/sos/PulseOverlay";

interface Pulse {
    id: string;
    radius: number;
}

interface MapSectionProps {
    location: Coordinate;
    markers: any[];
    pulseMaxRadius: number;
    responders: ResponderCardProps[]
}

const MapSection = forwardRef<MapView, MapSectionProps>(({ location, markers, pulseMaxRadius, responders }, mapRef) => {
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

            {location && <>
                <PulseOverlay center={location} maxRadius={400} delay={1000} />
            </>}
        </MapView>
    );
});

export default MapSection;
