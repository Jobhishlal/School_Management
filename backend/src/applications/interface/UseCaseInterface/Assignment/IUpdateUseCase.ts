import { AssignmentEntity } from "../../../../domain/entities/Assignment";
import { AssignmentDTO } from "../../../dto/AssignmentDTO ";


export interface IAssignmentupdate {
  execute(id: string, update: AssignmentDTO): Promise<AssignmentEntity>;
}
