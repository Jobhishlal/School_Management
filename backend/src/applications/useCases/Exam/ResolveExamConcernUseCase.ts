
import { IExamMarkRepository } from "../../../domain/repositories/Exam/IExamMarkRepoInterface";

export class ResolveExamConcernUseCase {
    constructor(private examMarkRepo: IExamMarkRepository) { }

    async execute(
        examMarkId: string,
        status: "Resolved" | "Rejected",
        newMarks?: number,
        responseMessage?: string
    ): Promise<boolean> {
        return await this.examMarkRepo.resolveConcern(examMarkId, status, newMarks, responseMessage);
    }
}
