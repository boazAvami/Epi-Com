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
   * @param language String representing the Response language
   * @returns Promise with the chatbot response
   */
  queryChatbot: async (messages: string[], language: string): Promise<string> => {
    // The mutation name was 'QueryChatbot' but you need to make sure it matches exactly
    // what your GraphQL server expects
    const mutation = `
      mutation QueryChatbot($messages: [String!]!, $language: String!) {
        queryChatbot(messages: $messages, language: $language) {
          response
        }
      }
    `;

    try {
      // Make sure both variables are passed correctly
      const variables = { 
        messages, 
        language 
      };
      
      const result = await graphqlRequest<{ queryChatbot: ChatbotResponse }>(
        mutation,
        variables
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
   * @param language String representing the Response language
   * @returns Promise with the chatbot response about allergies
   */
  queryAllergies: async (messages: string[], language = 'English'): Promise<string> => {
    // This method highlights that the backend is specifically handling allergy-related queries
    return chatbotService.queryChatbot(messages, language);
  }
};

export default chatbotService;