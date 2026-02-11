export interface IAIService {
    getAnswer(question: string): Promise<{ correctedQuestion: string, answer: string }>;
}
