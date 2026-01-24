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

  async getAnswer(question: string): Promise<string> {
    console.log("GeminiAIService: Getting answer for question using SDK (gemini-2.5-flash)...");

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    if (!question || question.trim().length < 5) {
      throw new Error("Question is too short");
    }

    try {
      const prompt = `
Explain the following topic for a beginner student.

Question:
${question}

Give:
- Simple definition
- Example
- Real-world analogy
            `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("GeminiAIService: Answer generated, length:", text.length);
      return text;
    } catch (error) {
      console.error("Gemini SDK Error:", error);
      throw new Error("Failed to generate AI response");
    }
  }
}
