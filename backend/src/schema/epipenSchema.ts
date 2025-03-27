// epipenSchema.ts
import { gql } from 'apollo-server-express';

export const epiPenTypeDefs = gql`
  type Location {
    latitude: Float!
    longitude: Float!
  }

  type Contact {
    phone: String!
    name: String!
  }

  type EpiPen {
    _id: ID!
    userId: ID!
    location: Location!
    description: String
    expiryDate: String!
    contact: Contact!
    image: String
    serialNumber: String!
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
  }

  input ContactInput {
    phone: String!
    name: String!
  }

  input AddEpiPenInput {
    location: LocationInput!
    description: String
    expiryDate: String!
    contact: ContactInput!
    image: String
    serialNumber: String!
  }

  input UpdateEpiPenInput {
    _id: ID!
    location: LocationInput
    description: String
    expiryDate: String
    contact: ContactInput
    image: String
    serialNumber: String
  }

  input DeleteEpiPenInput {
    _id: ID!
  }

  input NearbyEpiPenInput {
    location: LocationInput!
    radius: Float!
  }

  type NearbyEpiPen {
    userId: ID!
    location: Location!
    contact: Contact
    distance: Float!
    description: String
  }

  type MessageResponse {
    message: String!
  }

  type Query {
    epiPenById(_id: ID!): EpiPen
    epiPensByUser(userId: ID!): [EpiPen]
    nearbyEpiPens(input: NearbyEpiPenInput!): [NearbyEpiPen]
  }

  type Mutation {
    addEpiPen(input: AddEpiPenInput!): MessageResponse
    updateEpiPen(input: UpdateEpiPenInput!): MessageResponse
    deleteEpiPen(input: DeleteEpiPenInput!): MessageResponse
  }
`;