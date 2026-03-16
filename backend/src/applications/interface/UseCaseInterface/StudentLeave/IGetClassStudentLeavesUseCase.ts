import { StudentLeaveEntity } from "../../../../domain/entities/StudentLeave/StudentLeaveEntity";

export interface IGetClassStudentLeavesUseCase {
    execute(classId: string): Promise<StudentLeaveEntity[]>;
}
