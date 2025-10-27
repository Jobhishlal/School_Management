import { IStudentSubmit } from "../../../domain/UseCaseInterface/Assignment/IStudentSubmit";
import { IAssignmentRepository } from "../../../domain/repositories/Assignment/IAssignmentRepository ";
import { SubmitDTO } from "../../dto/AssignmentDTO ";
import { AssignmentEntity } from "../../../domain/entities/Assignment";

export class AssignmentSubmit implements IStudentSubmit {
    constructor(private readonly repo: IAssignmentRepository) {}

    async execute(data: SubmitDTO): Promise<AssignmentEntity | null> {

        const submissions = await this.repo.assignmentsubmit(
            data.assignmentId,
            data.studentId,
            data.fileUrl,
            data.fileName,
            data.studentDescription
        );

        if (!submissions || submissions.length === 0) {
            return null;
        }


        const updatedAssignment = await this.repo.findByIdEntity(data.assignmentId);
        return updatedAssignment;
    }
}
