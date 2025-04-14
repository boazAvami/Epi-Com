import { graphqlRequest } from './graphqlClient';
import { IUser } from '@shared/types';
import { RegisterData } from '@/shared/types/register-data.type';

/**
 * Fetch the currently logged in user's information
 * @returns Promise with the logged in user data
 */
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

/**
 * Update the currently logged in user's information
 * @param userData Partial user data to update
 * @returns Promise with the updated user
 */
export const UpdateUser = async (userData: Partial<RegisterData>) => {
    // Create variables object based on provided userData
    const variables: Record<string, any> = {};
    
    // Add only the fields that are present in userData
    if (userData.userName !== undefined) variables.userName = userData.userName;
    if (userData.email !== undefined) variables.email = userData.email;
    if (userData.firstName !== undefined) variables.firstName = userData.firstName;
    if (userData.lastName !== undefined) variables.lastName = userData.lastName;
    if (userData.phone_number !== undefined) variables.phone_number = userData.phone_number;
    if (userData.date_of_birth !== undefined) variables.date_of_birth = userData.date_of_birth;
    if (userData.profile_picture_uri !== undefined) variables.profile_picture_uri = userData.profile_picture_uri;
    if (userData.gender !== undefined) variables.gender = userData.gender;
    if (userData.allergies !== undefined) variables.allergies = userData.allergies;
    if (userData.emergencyContacts !== undefined) variables.emergencyContacts = userData.emergencyContacts;

    const mutation = `
        mutation UpdateUser(
            $userName: String,
            $email: String,
            $firstName: String,
            $lastName: String,
            $phone_number: String,
            $date_of_birth: String,
            $profile_picture_uri: String,
            $gender: String,
            $allergies: [String],
            $emergencyContacts: [EmergencyContactInput]
        ) {
            updateUser(
                userName: $userName,
                email: $email,
                firstName: $firstName,
                lastName: $lastName,
                phone_number: $phone_number,
                date_of_birth: $date_of_birth,
                profile_picture_uri: $profile_picture_uri,
                gender: $gender,
                allergies: $allergies,
                emergencyContacts: $emergencyContacts
            ) {
                id
                userName
                email
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

    return graphqlRequest<{ updateUser: IUser }>(mutation, variables);
};