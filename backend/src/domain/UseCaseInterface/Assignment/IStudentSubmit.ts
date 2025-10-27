import { SubmitDTO } from "../../../applications/dto/AssignmentDTO ";
import { AssignmentEntity } from "../../entities/Assignment";

export interface IStudentSubmit{

     execute(data:SubmitDTO):Promise<AssignmentEntity|null>


}