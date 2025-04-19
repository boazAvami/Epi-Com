import geminiUtils from "src/utils/geminiUtils";

export const chatbotResolvers = {
  Mutation: {
    queryChatbot: async (_: any, { userId, messages }: { userId: string; messages: string[] }) => {
      try {
        const response: string = await geminiUtils.allergiesQuery(messages);

        if (!response) {
          // In case something failed inside Gemini
          return { response: "Sorry, somthing went wrong while processing your request." };
        }

        return { response };
      } catch (err) {
        console.error("Error in queryChatbot resolver:", err);
        return { response: "Sorry, something went wrong while processing your request." };
      }
    },
  },
};

