import { graphqlRequest } from './graphqlClient';
import { useAuth } from '@/stores/useAuth';
import * as tokenStorage from '@/utils/tokenStorage';

export interface EpipenInputData {
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  expiryDate: string;
  contact: {
    name: string;
    phone: string;
  };
  image?: string | null;
  serialNumber: string;
  kind: 'ADULT' | 'JUNIOR';
}

export interface EpipenResponse {
  message: string;
  _id: string;
}

/**
 * Add a new EpiPen to the server
 */
export const addEpiPen = async (epipenData: Omit<EpipenInputData, '_id'>) => {
  try {
    // Create a copy to avoid modifying the original data
    const formattedData = { ...epipenData };

    // Validate and format expiryDate
    if (formattedData.expiryDate) {
      try {
        // Check if expiryDate is in MM/YYYY format and convert it to a valid ISO string
        if (/^\d{2}\/\d{4}$/.test(formattedData.expiryDate)) {
          const [month, year] = formattedData.expiryDate.split('/').map(Number);
          // Create a date for the 1st day of the specified month/year
          const date = new Date(year, month - 1, 1);
          
          // Validate the date is not Invalid Date
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${formattedData.expiryDate}`);
          }
          
          formattedData.expiryDate = date.toISOString();
        } else if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(formattedData.expiryDate)) {
          // If it's not already an ISO string, attempt to parse as a date
          const date = new Date(formattedData.expiryDate);
          
          // Validate the date is not Invalid Date
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${formattedData.expiryDate}`);
          }
          
          formattedData.expiryDate = date.toISOString();
        }
      } catch (error: any) {
        console.error('Date conversion error:', error);
        throw new Error(`Failed to format expiry date: ${error.message}`);
      }
    }

    const mutation = `
      mutation AddEpiPen($input: AddEpiPenInput!) {
        addEpiPen(input: $input) {
          message
          _id
        }
      }
    `;

    return graphqlRequest<{ addEpiPen: EpipenResponse }>(mutation, { input: formattedData });
  } catch (error: any) {
    console.error('Error adding EpiPen:', error);
    throw error;
  }
};

/**
 * Update an existing EpiPen
 */
export const updateEpiPen = async (epipenData: EpipenInputData & { _id: string }) => {
  try {
    // Create a copy to avoid modifying the original data
    const formattedData = { ...epipenData };

    // Validate and format expiryDate
    if (formattedData.expiryDate) {
      try {
        // Check if expiryDate is in MM/YYYY format and convert it to a valid ISO string
        if (/^\d{2}\/\d{4}$/.test(formattedData.expiryDate)) {
          const [month, year] = formattedData.expiryDate.split('/').map(Number);
          // Create a date for the 1st day of the specified month/year
          const date = new Date(year, month - 1, 1);
          
          // Validate the date is not Invalid Date
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${formattedData.expiryDate}`);
          }
          
          formattedData.expiryDate = date.toISOString();
        } else if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(formattedData.expiryDate)) {
          // If it's not already an ISO string, attempt to parse as a date
          const date = new Date(formattedData.expiryDate);
          
          // Validate the date is not Invalid Date
          if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format: ${formattedData.expiryDate}`);
          }
          
          formattedData.expiryDate = date.toISOString();
        }
      } catch (error: any) {
        console.error('Date conversion error:', error);
        throw new Error(`Failed to format expiry date: ${error.message}`);
      }
    }

    const mutation = `
      mutation UpdateEpiPen($input: UpdateEpiPenInput!) {
        updateEpiPen(input: $input) {
          message
          _id
        }
      }
    `;

    const input = {
      ...formattedData
    };

    return graphqlRequest<{ updateEpiPen: EpipenResponse }>(mutation, { input });
  } catch (error: any) {
    console.error('Error updating EpiPen:', error);
    throw error;
  }
};

/**
 * Delete an EpiPen
 */
export const deleteEpiPen = async (id: string) => {
  const mutation = `
    mutation DeleteEpiPen($input: DeleteEpiPenInput!) {
      deleteEpiPen(input: $input) {
        message
      }
    }
  `;

  return graphqlRequest<{ deleteEpiPen: { message: string } }>(mutation, { 
    input: { _id: id } 
  });
};

/**
 * Get all EpiPens owned by the current user
 */
export const getUserEpiPens = async () => {
  const query = `
    query GetUserEpiPens($userId: ID!) {
      epiPensByUser(userId: $userId) {
        _id
        location {
          latitude
          longitude
        }
        description
        expiryDate
        contact {
          name
          phone
        }
        image
        serialNumber
        kind
      }
    }
  `;

  // Get the userId from the auth store
  const userId = await tokenStorage.getUserId();
  
  if (!userId) {
    throw new Error('User not logged in');
  }

  return graphqlRequest<{ epiPensByUser: any[] }>(query, { userId });
};

/**
 * Get nearby EpiPens within a specified radius
 */
export const getNearbyEpiPens = async (latitude: number, longitude: number, radiusKm: number = 5) => {
  const query = `
    query GetNearbyEpiPens($input: NearbyEpiPenInput!) {
      nearbyEpiPens(input: $input) {
        userId
        epiPenId
        location {
          latitude
          longitude
        }
        contact {
          name
          phone
        }
        distance
        description
      }
    }
  `;

  return graphqlRequest<{ nearbyEpiPens: any[] }>(query, {
    input: {
      location: {
        latitude,
        longitude
      },
      radius: radiusKm
    }
  });
};

/**
 * Get all EpiPens in the system (admin only)
 */
export const getAllEpiPens = async () => {
  const query = `
    query GetAllEpiPens {
      allEpiPens {
        _id
        userId
        location {
          latitude
          longitude
        }
        description
        expiryDate
        contact {
          name
          phone
        }
        image
        serialNumber
        kind
      }
    }
  `;

  return graphqlRequest<{ allEpiPens: any[] }>(query, {});
};