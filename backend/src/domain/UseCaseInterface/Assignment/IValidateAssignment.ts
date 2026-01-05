
import { ValidationDTO } from "../../../applications/dto/AssignmentDTO ";
import { AssignmentEntity } from "../../entities/Assignment";

export interface IValidateAssignment {
    execute(data: ValidationDTO): Promise<AssignmentEntity | null>;
}
