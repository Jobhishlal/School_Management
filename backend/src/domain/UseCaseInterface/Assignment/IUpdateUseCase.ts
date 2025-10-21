import { AssignmentEntity } from "../../entities/Assignment";
import { AssignmentDTO } from "../../../applications/dto/AssignmentDTO ";


export interface IAssignmentupdate {
  execute(id: string, update: AssignmentDTO): Promise<AssignmentEntity>;
}
