
export const chatbotResolvers = {
  Mutation: {
    queryChatbot: async (_: any, { userId, sessionId, query }: { userId: string, sessionId?: number, query: string }) => {
      // In a real scenario, integrate with an AI service to get the response
      let  response: string;

      if (sessionId) {
        // If sessionId exists, you can potentially store the session or pass it to the AI service.
         response = `Chatbot response to your query (sessionId: ${sessionId}): ${query}`;  // For now, just echoing back
      } else {
        sessionId =  1234 // Generate sessionId 
        response = `Chatbot response to your query: ${query}`;  // For now, just echoing back
      }

      return {
        response,
        sessionId,
      };
    },
  },
};
