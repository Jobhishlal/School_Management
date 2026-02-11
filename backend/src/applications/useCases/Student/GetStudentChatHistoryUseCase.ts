import { IAISessionRepository } from "../../interface/RepositoryInterface/AI/IAISessionRepository";
import { AISession } from "../../../domain/entities/AISession";

import { IGetStudentChatHistoryUseCase } from "./interfaces/IGetStudentChatHistoryUseCase";

export class GetStudentChatHistoryUseCase implements IGetStudentChatHistoryUseCase {
    constructor(private sessionRepository: IAISessionRepository) { }

    async execute(studentId: string): Promise<AISession[]> {
        return this.sessionRepository.findByStudentId(studentId);
    }
}
