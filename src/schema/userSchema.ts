import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type EmergencyContact {
    name: String!
    phone: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    phone: String!
    allergies: [String]
    emergencyContacts: [EmergencyContact]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      phone: String!
      allergies: [String]
      emergencyContacts: [EmergencyContactInput]
    ): AuthPayload
    updateUser(
      username: String
      email: String
      phone: String
      allergies: String
      emergencyContacts: [String]
    ): User!
    login(email: String!, password: String!): AuthPayload
    deleteUser(id: ID!): Boolean  # New deleteUser mutation
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
  }
`;
