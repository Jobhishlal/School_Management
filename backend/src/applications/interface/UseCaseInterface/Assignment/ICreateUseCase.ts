import { AssignmentEntity } from "../../../../domain/entities/Assignment";
import { AssignmentDTO } from "../../../dto/AssignmentDTO ";

export interface ICreateAssignment{
    execute(dto:AssignmentDTO):Promise<AssignmentEntity|null>
}