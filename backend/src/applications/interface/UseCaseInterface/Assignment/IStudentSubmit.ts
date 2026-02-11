import { SubmitDTO } from "../../../dto/AssignmentDTO ";
import { AssignmentEntity } from "../../../../domain/entities/Assignment";

export interface IStudentSubmit{

     execute(data:SubmitDTO):Promise<AssignmentEntity|null>


}