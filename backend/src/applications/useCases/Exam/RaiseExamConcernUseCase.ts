
import { IExamMarkRepository } from "../../interface/RepositoryInterface/Exam/IExamMarkRepoInterface";

export class RaiseExamConcernUseCase {
    constructor(private examMarkRepo: IExamMarkRepository) { }

    async execute(examMarkId: string, concern: string): Promise<boolean> {
        if (!concern || concern.trim().length === 0) {
            throw new Error("Concern text cannot be empty");
        }



        return await this.examMarkRepo.updateConcern(examMarkId, concern);
    }
}
