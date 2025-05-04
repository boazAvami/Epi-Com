import { gql } from 'apollo-server-express';

export const chatbotTypeDefs = gql`
  type ChatbotResponse {
    response: String!
  }

  type Mutation {
    queryChatbot(messages: [String!]!): ChatbotResponse!
  }
`;
