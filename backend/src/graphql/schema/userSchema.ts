import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  enum Gender {
    male
    female
    other
  }

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
    gender: Gender
    refreshToken: [String]
    emergencyContacts: [EmergencyContact]!
    language: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    user(userId: ID!): User
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
      gender: Gender
      emergencyContacts: [EmergencyContactInput]!
      language: String
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
      gender: Gender
      emergencyContacts: [EmergencyContactInput]
      language: String
    ): User!

    login(email: String!, password: String!): AuthPayload
    deleteUser(id: ID!): Boolean
  }

  input EmergencyContactInput {
    name: String!
    phone: String!
  }
`;
