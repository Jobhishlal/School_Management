import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIService } from "../../domain/repositories/AI/IAIService";

export class GeminiAIService implements IAIService {
    private model: any;

    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async getAnswer(question: string): Promise<string> {
        try {
            const prompt = `Student Question: ${question}\n\nProvide a clear, concise, and educational answer suitable for a student. Structured in paragraphs or bullet points where appropriate.`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini AI Error:", error);
            throw new Error("Failed to generate AI response");
        }
    }
}
