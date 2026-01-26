import { IAISessionRepository } from "../../../domain/repositories/AI/IAISessionRepository";
import { AISession } from "../../../domain/entities/AISession";

export class GetChatSessionUseCase {
    constructor(private sessionRepository: IAISessionRepository) { }

    async execute(sessionId: string): Promise<AISession | null> {
        return this.sessionRepository.findById(sessionId);
    }
}
