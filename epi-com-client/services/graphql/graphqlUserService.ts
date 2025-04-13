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

interface UpdateUserInput {
  userName?: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone_number?: string | null;
  gender?: string | null;
  date_of_birth?: Date | null;
  allergies?: string[];
  emergencyContacts?: Array<{
      name: string;
      phone: string;
  }>;
  profile_picture_uri?: string | null;
}

// New function to update user with proper typing
export const UpdateUser = async (userData: UpdateUserInput) => {
  const mutation = `
      mutation UpdateUser(
          $userName: String
          $email: String
          $firstName: String
          $lastName: String
          $phone_number: String
          $gender: String
          $date_of_birth: DateTime
          $allergies: [String]
          $emergencyContacts: [EmergencyContactInput]
          $profile_picture_uri: String
      ) {
          updateUser(
              userName: $userName
              email: $email
              firstName: $firstName
              lastName: $lastName
              phone_number: $phone_number
              gender: $gender
              date_of_birth: $date_of_birth
              allergies: $allergies
              emergencyContacts: $emergencyContacts
              profile_picture_uri: $profile_picture_uri
          ) {
              email
              userName
              firstName
              lastName
              phone_number
              date_of_birth
              profile_picture_uri
              gender
              allergies
              emergencyContacts {
                  name
                  phone
              }
              date_joined
          }
      }`;

  return graphqlRequest<{ updateUser: IUser }>(mutation, userData);
};
