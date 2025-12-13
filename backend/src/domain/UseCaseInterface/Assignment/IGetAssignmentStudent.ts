
import { AssignmentEntity } from "../../entities/Assignment";
export interface IAssignmentGetstudent{
    execute(studentId:string):Promise<AssignmentEntity[]>
}