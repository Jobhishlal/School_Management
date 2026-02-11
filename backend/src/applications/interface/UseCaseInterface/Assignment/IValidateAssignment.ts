
import { ValidationDTO } from "../../../dto/AssignmentDTO ";
import { AssignmentEntity } from "../../../../domain/entities/Assignment";

export interface IValidateAssignment {
    execute(data: ValidationDTO): Promise<AssignmentEntity | null>;
}
