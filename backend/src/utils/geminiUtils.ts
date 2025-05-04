import { GoogleGenerativeAI } from "@google/generative-ai";
import { IUser } from "@shared/types";

class GeminiUtils {
  async allergiesQuery(conversation: string[], user?: IUser): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = this.buildAllergyPrompt(conversation, user);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Sorry, I can only assist with allergy-related topics.";
  }

  private buildAllergyPrompt(conversation: string[], user: IUser): string {
    const allergiesText = user.allergies.length
      ? `Known allergies: ${user.allergies.join(", ")}.`
      : "No known allergies on file.";

    const emergencyContactsText = user.emergencyContacts?.length
      ? `Emergency Contacts:\n${user.emergencyContacts.map((c) => `- ${c.name}: ${c.phone}`).join("\n")}`
      : "No emergency contacts listed.";

    return `
You are a medical assistant AI that ONLY provides factual and medically accurate information about **allergies**.

Always base your answers on established medical knowledge. Do not speculate or provide non-medical opinions.

User Profile:
- Name: ${user.firstName ?? "Unknown"} ${user.lastName ?? ""}
- Gender: ${user.gender ?? "Unknown"}
- Date of Birth: ${user.date_of_birth?.toDateString() ?? "Unknown"}
- ${allergiesText}

If the user asks a question unrelated to allergies (e.g., general health, nutrition, mental health, or unrelated topics), respond with:
"Sorry, I can only help with allergy-related topics."

Conversation so far:
${conversation.map((line, i) => `User${i + 1}: ${line}`).join("\n")}

Based on the above, respond factually and only if the topic is about allergies.
    `.trim();
  }
}

export default new GeminiUtils();
