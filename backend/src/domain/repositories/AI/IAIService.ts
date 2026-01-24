export interface IAIService {
    getAnswer(question: string): Promise<string>;
}
