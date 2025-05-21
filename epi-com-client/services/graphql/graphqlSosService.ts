import { graphqlRequest } from "@/services/graphql/graphqlClient";
import { Coordinate } from "@/types";
import {ILocation} from "@shared/types";

export const sendSOSMutation = async (userId: string, location: Coordinate) => {
    const query = `
        mutation SendSOS($userId: ID!, $location: LocationInput!) {
            sendSOS(userId: $userId, location: $location) {
                status
                message
                sosId
            }
        }
    `;

    const variables = {
        userId,
        location,
    };

    return graphqlRequest<{ sendSOS: { status: string; message: string, sosId: string } }>(query, variables);
};

export const sendExpandSOSRangeMutation = async (userId: string, sosId: string, location: ILocation, newRadiusInMeters: number) => {
    const query = `
        mutation ExpandSOSRange($userId: ID!, $sosId: ID!, $location: LocationInput! $newRadiusInMeters: Int!) {
            expandSOSRange(userId: $userId, sosId: $sosId, location: $location, newRadiusInMeters: $newRadiusInMeters) {
                status
                message
            }
        }
    `;

    const variables = {
        userId,
        sosId,
        location,
        newRadiusInMeters
    };

    return graphqlRequest<{ expandSOSRange: { status: string; message: string } }>(query, variables);
};

export const stopSOSMutation = async (userId: string) => {
    const query = `
        mutation stopSOS($userId: ID!) {
            stopSOS(userId: $userId) {
                status
                message
            }
        }
    `;

    const variables = {
        userId
    };

    return graphqlRequest<{ stopSOS: { status: string; message: string } }>(query, variables);
};

export const responseToSOSMutation = async (userId: string, sosId: string, location: {latitude: number, longitude: number}) => {
    const query = `
        mutation responseToSOS($userId: ID!, $sosId: ID!, $location: LocationInput!) {
            responseToSOS(userId: $userId, sosId: $sosId, location: $location) {
                status
                message
            }
        }
    `;

    const variables = {
        userId,
        sosId,
        location
    };

    return graphqlRequest<{ stopSOS: { status: string; message: string } }>(query, variables);
};
