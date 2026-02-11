
import { IValidateAssignment } from "../../interface/UseCaseInterface/Assignment/IValidateAssignment";
import { IAssignmentRepository } from "../../../domain/repositories/Assignment/IAssignmentRepository ";
import { ValidationDTO } from "../../dto/AssignmentDTO ";
import { AssignmentEntity } from "../../../domain/entities/Assignment";

export class ValidateAssignment implements IValidateAssignment {
    constructor(private readonly repo: IAssignmentRepository) { }

    async execute(data: ValidationDTO): Promise<AssignmentEntity | null> {
        return await this.repo.validateAssignment(data);
    }
}
