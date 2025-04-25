import { graphqlRequest } from './graphqlClient';

/**
 * Interface for the chatbot response
 */
interface ChatbotResponse {
  response: string;
}

/**
 * Service for interacting with the chatbot GraphQL endpoints
 */
export const chatbotService = {
  /**
   * Sends a query to the chatbot and returns the response
   * @param messages Array of message strings representing the conversation
   * @returns Promise with the chatbot response
   */
  queryChatbot: async (messages: string[]): Promise<string> => {
    const mutation = `
      mutation QueryChatbot($messages: [String!]!) {
        queryChatbot(messages: $messages) {
          response
        }
      }
    `;

    try {
      const result = await graphqlRequest<{ queryChatbot: ChatbotResponse }>(
        mutation,
        { messages }
      );
      return result.queryChatbot.response;
    } catch (error) {
      console.error('Error in queryChatbot:', error);
      return 'Sorry, something went wrong while processing your request.';
    }
  },
  /**
   * Sends a query to the chatbot specifically about allergies
   * @param messages Array of message strings representing the conversation
   * @returns Promise with the chatbot response about allergies
   */
  queryAllergies: async (messages: string[]): Promise<string> => {
    // This method highlights that the backend is specifically handling allergy-related queries
    return chatbotService.queryChatbot(messages);
  }
};

export default chatbotService;