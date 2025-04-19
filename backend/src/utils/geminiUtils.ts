import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiUtils {
    async allergiesQuery(conversation: string[]): Promise<string> {
        if (!Array.isArray(conversation) || conversation.length === 0) {
            throw new Error("Conversation must be a non-empty string array.");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = this.buildAllergyPrompt(conversation);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text || "Sorry, I can only assist with allergy-related topics.";
    }

    private buildAllergyPrompt(conversation: string[]): string {
        return `
You are a medical assistant AI that ONLY provides factual and medically accurate information about **allergies**.

If the user asks a question unrelated to allergies (e.g., general health, nutrition, mental health, or unrelated topics), respond with a short message: 
"Sorry, I can only help with allergy-related topics."

Always base your answers on established medical knowledge. Do not speculate or provide non-medical opinions.

Conversation so far:
${conversation.map((line, i) => `User${i + 1}: ${line}`).join('\n')}

Based on the above, respond factually and only if the topic is about allergies.
        `.trim();
    }
}

export default new GeminiUtils();
