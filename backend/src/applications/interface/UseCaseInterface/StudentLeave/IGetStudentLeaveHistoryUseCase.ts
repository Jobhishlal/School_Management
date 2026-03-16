import { StudentLeaveEntity } from "../../../../domain/entities/StudentLeave/StudentLeaveEntity";

export interface IGetStudentLeaveHistoryUseCase {
    execute(studentId: string): Promise<StudentLeaveEntity[]>;
}
