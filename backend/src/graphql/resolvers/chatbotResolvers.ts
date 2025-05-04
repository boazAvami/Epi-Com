import { userModel } from "src/models/userModel";
import geminiUtils from "src/utils/geminiUtils";

const MAX_MESSAGES = 10;
const MAX_CHARACTERS_PER_MESSAGE = 500;

export const chatbotResolvers = {
  Mutation: {

    queryChatbot: async (_: any, { messages}: { messages: string[] }, { userId }: { userId?: string }) => {
      console.log(userId);
      try {
        // === Validation ===
        if (!Array.isArray(messages) || messages.length === 0) {
          throw new Error("Messages must be a non-empty array of strings.");
        }

        if (messages.length > MAX_MESSAGES) {
          throw new Error("You can only send up to 10 messages at a time.");
        }

        for (const msg of messages) {
          if (typeof msg !== "string") {
            throw new Error("All messages must be strings.");
          }

          if (msg.length > MAX_CHARACTERS_PER_MESSAGE) {
            throw new Error("Each message must be 500 characters or fewer.");
          }
        }

        let response: string;
        const user = await userModel.findById(userId);
        if (!user) {
          response = await geminiUtils.allergiesQuery(messages);
        } else {
          response = await geminiUtils.allergiesQuery(messages, user);
        }


        if (!response) {
          throw new Error("Sorry, something went wrong while processing your request.");
        }

        return { response };
      } catch (err) {
        console.error("Error in queryChatbot resolver:", err);
        throw err; 
      }
    },
  },
};
