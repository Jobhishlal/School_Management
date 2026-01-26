import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIService } from "../../domain/repositories/AI/IAIService";

export class GeminiAIService implements IAIService {
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. AI features will not work.");
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using 'gemini-2.5-flash' as detected by test script
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async getAnswer(question: string): Promise<{ correctedQuestion: string, answer: string }> {
    console.log("GeminiAIService: Getting answer for question using SDK (gemini-2.5-flash)...");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    if (!question || question.trim().length < 5) {
      throw new Error("Question is too short");
    }

    try {
      const prompt = `
You are an intelligent study assistant for students.
Perform two tasks:
1. Correct any spelling mistakes in the user's question.
2. Answer the corrected question simply for a beginner.

Question: "${question}"

Respond ONLY in valid JSON format:
{
  "correctedQuestion": "The corrected question text",
  "answer": "The formatted answer content with: \n\n## Definition\nA simple definition.\n\n## Example\nAn example.\n\n## Analogy\nA real-world analogy."
}
            `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Cleanup if model returns markdown ticks around json
      text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

      console.log("GeminiAIService: Raw response length:", text.length);

      const jsonResponse = JSON.parse(text);

      return {
        correctedQuestion: jsonResponse.correctedQuestion || question,
        answer: jsonResponse.answer || text
      };
    } catch (error) {
      console.error("Gemini SDK Error:", error);
      // Fallback if JSON parsing fails or other error
      return {
        correctedQuestion: question,
        answer: "I'm sorry, I couldn't process that properly. Please try asking again."
      };
    }
  }
}

