import { AIResponse } from "../AskAIDoubtUseCase";

export interface IAskAIDoubtUseCase {
    execute(studentId: string, question: string, sessionId?: string): Promise<AIResponse>;
}
