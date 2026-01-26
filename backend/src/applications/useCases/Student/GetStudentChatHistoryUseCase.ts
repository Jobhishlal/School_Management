import { IAISessionRepository } from "../../../domain/repositories/AI/IAISessionRepository";
import { AISession } from "../../../domain/entities/AISession";

export class GetStudentChatHistoryUseCase {
    constructor(private sessionRepository: IAISessionRepository) { }

    async execute(studentId: string): Promise<AISession[]> {
        return this.sessionRepository.findByStudentId(studentId);
    }
}
