
import { IGetAssignmentSubmissions, SubmissionResult } from "../../interface/UseCaseInterface/Assignment/IGetAssignmentSubmissions";
import { IAssignmentRepository } from "../../interface/RepositoryInterface/Assignment/IAssignmentRepository ";

export class GetAssignmentSubmissions implements IGetAssignmentSubmissions {
    constructor(private readonly repo: IAssignmentRepository) { }

    async execute(assignmentId: string): Promise<SubmissionResult[]> {
        return await this.repo.getAssignmentSubmissions(assignmentId);
    }
}
