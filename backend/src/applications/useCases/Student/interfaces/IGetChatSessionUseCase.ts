import { AISession } from "../../../../domain/entities/AISession";

export interface IGetChatSessionUseCase {
    execute(sessionId: string): Promise<AISession | null>;
}
