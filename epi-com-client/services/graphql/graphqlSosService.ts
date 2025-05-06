import { graphqlRequest } from "@/services/graphql/graphqlClient";
import { Coordinate } from "@/types";

export const sendSOSMutation = async (userId: string, location: Coordinate) => {
    const query = `
        mutation SendSOS($userId: ID!, $location: LocationInput!) {
            sendSOS(userId: $userId, location: $location) {
                status
                message
            }
        }
    `;

    const variables = {
        userId,
        location,
    };

    return graphqlRequest<{ sendSOS: { status: string; message: string } }>(query, variables);
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
