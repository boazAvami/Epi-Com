import { GoogleGenerativeAI } from "@google/generative-ai";
import { IUser } from "@shared/types";

class GeminiUtils {
  async allergiesQuery(
    conversation: string[],
    language: string = "English", // Default language is English
    user?: IUser
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = this.buildAllergyPrompt(conversation, user, language);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Sorry, I could not generate a response. Please try again.";
  }

  private buildAllergyPrompt(conversation: string[], user: IUser, language: string): string {
    const allergiesText = user?.allergies?.length
      ? `Known allergies: ${user.allergies.join(", ")}.`
      : "No known allergies on file.";
  
    const emergencyContactsText = user?.emergencyContacts?.length
      ? `Emergency Contacts:\n${user.emergencyContacts.map((c) => `- ${c.name}: ${c.phone}`).join("\n")}`
      : "No emergency contacts listed.";
  
    return `
  You are a medical assistant AI that ONLY provides factual and medically accurate information about **allergies**.
  Always base your answers on established medical knowledge. Do not speculate or provide non-medical opinions.
  
  You are allowed to politely respond to greetings or common manners (e.g., "Hi", "Hello", "Thanks", "Bye") in a friendly way. But do not answer other non-allergy-related questions.
  
  User Profile:
  - Name: ${user?.firstName ?? "Unknown"} ${user?.lastName ?? ""}
  - Gender: ${user?.gender ?? "Unknown"}
  - Date of Birth: ${user?.date_of_birth?.toDateString() ?? "Unknown"}
  - ${allergiesText}
  
  If the user asks about unrelated health topics (e.g., nutrition, mental health, etc.), respond with:
  "Sorry, I can only help with allergy-related topics."
  
  Conversation so far:
  ${conversation.map((line, i) => `User${i + 1}: ${line}`).join("\n")}
  
  Please respond in **${language}**.
  Respond factually and only if the topic is about allergies or simple politeness/manners.
    `.trim();
  }
}  

export default new GeminiUtils();
