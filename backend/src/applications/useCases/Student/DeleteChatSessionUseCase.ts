import { IAISessionRepository } from "../../../domain/repositories/AI/IAISessionRepository";

export class DeleteChatSessionUseCase {
    constructor(private sessionRepository: IAISessionRepository) { }

    async execute(sessionId: string): Promise<void> {
        // We could add validation here if needed, e.g. check if session belongs to user
        await this.sessionRepository.delete(sessionId);
    }
}
