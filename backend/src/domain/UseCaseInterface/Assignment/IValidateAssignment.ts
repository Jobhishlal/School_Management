
import { ValidationDTO } from "../../dto/AssignmentDTO "; // Note: The file name has a space at the end in the repo
import { AssignmentEntity } from "../../domain/entities/Assignment";

export interface IValidateAssignment {
    execute(data: ValidationDTO): Promise<AssignmentEntity | null>;
}
