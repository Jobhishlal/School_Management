
import { AssignmentEntity } from "../../../../domain/entities/Assignment";
export interface IAssignmentGetstudent{
    execute(studentId:string):Promise<AssignmentEntity[]>
}