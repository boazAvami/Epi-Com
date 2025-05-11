import React, {ForwardedRef, forwardRef, RefObject} from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import {Coordinate, EpipenMarker as Epipen} from '@/types';
import {ResponderCardProps} from "@/components/sos/ResponderCard";
import {UserMarker} from "@/components/map/UserMarker";
import {EpipenMarker} from "@/components/map/EpipenMarker";
import PulseOverlay from "@/components/sos/PulseOverlay";

interface Pulse {
    id: string;
    radius: number;
}

interface MapSectionProps {
    location: Coordinate;
    markers: Epipen[];
    responders: ResponderCardProps[]
}

const MapSection = forwardRef<MapView, MapSectionProps>(({ location, markers, responders }, mapRef) => {
    const [mapRegion, setMapRegion] = React.useState<Coordinate>(location);
    const getAllRespondersEpipens = () => {
        return responders.reduce((acc: Epipen[], responder) => {
            return acc.concat(responder.epipenList);
        }, []);
    }

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
            onRegionChangeComplete={(region) => {
                setMapRegion({
                    latitude: region.latitude,
                    longitude: region.longitude
                });
            }}
        >
            {markers.map((marker) => (
                <EpipenMarker key={marker.id} marker={marker} onPress={() => {}} />
            ))}

            {getAllRespondersEpipens().map((marker) => (
                <EpipenMarker key={marker.id} marker={marker} onPress={() => {}} />
            ))}

            {responders?.map((responder) => (
                <UserMarker user={responder.user} onPress={() => {}} location={location} key={responder.user._id} description=""/>
            ))}

            {location && <>
                <PulseOverlay center={location} mapRegion={mapRegion} delay={1000} mapRef={mapRef as RefObject<MapView>} />
            </>}
        </MapView>
    );
});

export default MapSection;
