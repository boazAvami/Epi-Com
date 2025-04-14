import { graphqlRequest } from './graphqlClient';
import { IEpiPen, NearbyEpiPen } from '@/shared/types/epipen-data.type';

/**
 * Fetch all EpiPens belonging to the specified user
 * @param userId The ID of the user whose EpiPens to fetch
 * @returns Promise with a list of user's EpiPens
 */
export const getAllUserEpiPens = async (userId: string) => {
    const query = `
        query GetUserEpiPens($userId: ID!) {
          epiPensByUser(userId: $userId) {
            _id
            userId
            location {
              latitude
              longitude
            }
            description
            expiryDate
            contact {
              phone
              name
            }
            image
            serialNumber
          }
        }`;

    // console.log("Sending getAllUserEpiPens query to GraphQL with userId:", userId);
    try {
        const response = await graphqlRequest<{ epiPensByUser: IEpiPen[] }>(
            query, 
            { userId }
        );
        // console.log("getAllUserEpiPens response received:", 
        //            response ? "Has data" : "No data");
        return response;
    } catch (error) {
        console.error("Error in getAllUserEpiPens:", error);
        throw error;
    }
};