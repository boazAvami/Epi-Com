import { graphqlRequest } from './graphqlClient';

export const getUserProfile = async () => {
    const query = `
    query GetUserProfile {
      me {
        userName
        email
      }
    }
  `;
    return graphqlRequest<{ me: { id: string; name: string; email: string } }>(query);
};

// // Example mutation to update profile
// export const updateProfile = async (name: string) => {
//     const mutation = `
//     mutation UpdateProfile($name: String!) {
//       updateProfile(name: $name) {
//         id
//         name
//         email
//       }
//     }
//   `;
//     return graphqlRequest(mutation, { name });
// };
