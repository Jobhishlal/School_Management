import { ApplyStudentLeaveDTO } from "../../../applications/dto/StudentLeave/ApplyStudentLeaveDTO";
import { StudentLeaveEntity } from "../../entities/StudentLeave/StudentLeaveEntity";

export interface IApplyStudentLeaveUseCase {
    execute(data: ApplyStudentLeaveDTO): Promise<StudentLeaveEntity>;
}
