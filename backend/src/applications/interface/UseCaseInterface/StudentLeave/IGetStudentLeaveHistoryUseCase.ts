import { StudentLeaveEntity } from "../../entities/StudentLeave/StudentLeaveEntity";

export interface IGetStudentLeaveHistoryUseCase {
    execute(studentId: string): Promise<StudentLeaveEntity[]>;
}
