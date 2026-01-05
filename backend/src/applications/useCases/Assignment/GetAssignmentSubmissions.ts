
import { IGetAssignmentSubmissions, SubmissionResult } from "../../../domain/UseCaseInterface/Assignment/IGetAssignmentSubmissions";
import { IAssignmentRepository } from "../../../domain/repositories/Assignment/IAssignmentRepository ";

export class GetAssignmentSubmissions implements IGetAssignmentSubmissions {
    constructor(private readonly repo: IAssignmentRepository) { }

    async execute(assignmentId: string): Promise<SubmissionResult[]> {
        return await this.repo.getAssignmentSubmissions(assignmentId);
    }
}
