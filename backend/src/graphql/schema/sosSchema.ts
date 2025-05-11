import { gql } from 'apollo-server-express';


export const sosTypeDefs = gql`
  type Location {
    latitude: Float!
    longitude: Float!
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
  }

  type SOSResponse {
    status: String!
    message: String!
    sosId: String
  }

  type Query {
    getResponders(userId: ID!, sosId: ID!): [User]!
  }

  type Mutation {
    sendSOS(userId: ID!, location: LocationInput!): SOSResponse!
    expandSOSRange(userId: ID!, sosId: ID!, location: LocationInput! newRadiusInMeters: Int!): SOSResponse!
    responseToSOS(userId: ID!, sosId: ID!, location: LocationInput!): SOSResponse!
    stopSOS(userId: ID!): SOSResponse!
  }
`;
