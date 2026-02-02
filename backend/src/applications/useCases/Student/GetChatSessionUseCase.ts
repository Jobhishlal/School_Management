import { IAISessionRepository } from "../../../domain/repositories/AI/IAISessionRepository";
import { AISession } from "../../../domain/entities/AISession";

import { IGetChatSessionUseCase } from "./interfaces/IGetChatSessionUseCase";

export class GetChatSessionUseCase implements IGetChatSessionUseCase {
    constructor(private sessionRepository: IAISessionRepository) { }

    async execute(sessionId: string): Promise<AISession | null> {
        return this.sessionRepository.findById(sessionId);
    }
}
