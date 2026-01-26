import { AISession, AIChatMessage } from "../../entities/AISession";

export interface IAISessionRepository {
    create(session: AISession): Promise<AISession>;
    findById(id: string): Promise<AISession | null>;
    findByStudentId(studentId: string): Promise<AISession[]>;
    addMessage(sessionId: string, message: AIChatMessage): Promise<void>;
    updateTitle(sessionId: string, title: string): Promise<void>;
    delete(sessionId: string): Promise<void>;
}
