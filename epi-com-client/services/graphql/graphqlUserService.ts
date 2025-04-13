import { graphqlRequest } from './graphqlClient';
import { IUser } from '@shared/types';

export const GetLoggedUser = async () => {
    const query = `
        query GetLoggedUser {
          me {
            email
            userName
            firstName,
            lastName,
            phone_number,
            date_of_birth,
            profile_picture_uri,
            gender,
            allergies,
            emergencyContacts {
                name,
                phone
            },
            date_joined      
          }
        }`;

    return graphqlRequest<{ me: IUser }>(query);
};
