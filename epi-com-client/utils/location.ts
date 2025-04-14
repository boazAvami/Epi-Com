import { Coordinate } from '../types';

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 First coordinate latitude
 * @param lon1 First coordinate longitude
 * @param lat2 Second coordinate latitude
 * @param lon2 Second coordinate longitude
 * @returns Distance in kilometers, rounded to 1 decimal place
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
export function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Get initial region from a coordinate with reasonable zoom levels
 */
export function getRegionForCoordinates(coordinate: Coordinate) {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  };
}