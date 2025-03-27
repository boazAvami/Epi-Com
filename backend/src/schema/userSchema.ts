import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type EmergencyContact {
    name: String!
    phone: String!
  }

  type User {
    id: ID!
    userName: String!
    email: String!
    firstName: String
    lastName: String
    phone_number: String
    date_of_birth: String
    date_joined: String
    profile_picture_uri: String
    allergies: [String]!
    is_connected: Boolean
    gender: String
    refreshToken: [String]
    emergencyContacts: [EmergencyContact]!
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
      userName: String!
      email: String!
      password: String!
      firstName: String
      lastName: String
      phone_number: String
      date_of_birth: String
      profile_picture_uri: String
      allergies: [String]!
      gender: String
      emergencyContacts: [EmergencyContactInput]!
    ): AuthPayload

    updateUser(
      userName: String
      email: String
      firstName: String
      lastName: String
      phone_number: String
      date_of_birth: String
      profile_picture_uri: String
      allergies: [String]
      gender: String
      emergencyContacts: [EmergencyContactInput]
    ): User!

    login(email: String!, password: String!): AuthPayload
    deleteUser(id: ID!): Boolean
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
  }
`;
