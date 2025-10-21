import { AssignmentEntity } from "../../entities/Assignment";
import { AssignmentDTO } from "../../../applications/dto/AssignmentDTO ";

export interface ICreateAssignment{
    execute(dto:AssignmentDTO):Promise<AssignmentEntity>
}