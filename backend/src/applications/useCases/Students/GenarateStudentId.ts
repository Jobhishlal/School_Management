import { GenaratesStudent_id } from "../../../infrastructure/security/Student_idGen";
import { IStudentIdGenarate } from "../../interface/UseCaseInterface/StudentCreate/GenarateStudentId";

export class StudentIdGenarateService implements IStudentIdGenarate{
    execute():string{
        return GenaratesStudent_id()
    }
}