// epipenSchema.ts
import { gql } from 'apollo-server-express';

export const epiPenTypeDefs = gql`
  type Location {
    latitude: Float!
    longitude: Float!
  }

  enum EpiPenKind {
    JUNIOR
    ADULT
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
    kind: EpiPenKind!
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
    kind: EpiPenKind!
  }

  input UpdateEpiPenInput {
    _id: ID!
    location: LocationInput
    description: String
    expiryDate: String
    contact: ContactInput
    image: String
    serialNumber: String
    kind: EpiPenKind
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
    epiPenId: ID!
    location: Location!
    contact: Contact
    distance: Float!
    description: String
  }

  type MessageResponse {
    message: String!
    _id: ID
  }

  type Query {
    epiPenById(_id: ID!): EpiPen
    epiPensByUser(userId: ID!): [EpiPen]
    nearbyEpiPens(input: NearbyEpiPenInput!): [NearbyEpiPen]
    allEpiPens: [EpiPen]
  }

  type Mutation {
    addEpiPen(input: AddEpiPenInput!): MessageResponse
    updateEpiPen(input: UpdateEpiPenInput!): MessageResponse
    deleteEpiPen(input: DeleteEpiPenInput!): MessageResponse
  }
`;