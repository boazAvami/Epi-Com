import { gql } from 'apollo-server-express';

export const chatbotTypeDefs = gql`
  type ChatbotResponse {
    response: String!
    sessionId: Int
  }

  type Mutation {
    queryChatbot(userId: ID!, sessionId: Int!, query: String!): ChatbotResponse!
  }
`;
