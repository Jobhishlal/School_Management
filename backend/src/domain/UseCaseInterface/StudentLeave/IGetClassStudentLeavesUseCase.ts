import { StudentLeaveEntity } from "../../entities/StudentLeave/StudentLeaveEntity";

export interface IGetClassStudentLeavesUseCase {
    execute(classId: string): Promise<StudentLeaveEntity[]>;
}
