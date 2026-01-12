import { StudentLeaveEntity } from "../../entities/StudentLeave/StudentLeaveEntity";

export interface IProcessStudentLeaveUseCase {
    execute(leaveId: string, status: "APPROVED" | "REJECTED", actionBy: string, message?: string): Promise<StudentLeaveEntity | null>;
}
