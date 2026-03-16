import { ApplyStudentLeaveDTO } from "../../../dto/StudentLeave/ApplyStudentLeaveDTO";
import { StudentLeaveEntity } from "../../../../domain/entities/StudentLeave/StudentLeaveEntity";

export interface IApplyStudentLeaveUseCase {
    execute(data: ApplyStudentLeaveDTO): Promise<StudentLeaveEntity>;
}
