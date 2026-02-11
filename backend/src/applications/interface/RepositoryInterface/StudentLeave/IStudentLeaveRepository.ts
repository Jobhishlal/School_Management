import { StudentLeaveEntity } from "../../entities/StudentLeave/StudentLeaveEntity";

export interface IStudentLeaveRepository {
    applyLeave(leave: StudentLeaveEntity): Promise<StudentLeaveEntity>;
    getLeavesByStudentId(studentId: string): Promise<StudentLeaveEntity[]>;
    getPendingLeavesByClassId(classId: string): Promise<StudentLeaveEntity[]>;
    updateLeaveStatus(leaveId: string, status: string, actionBy: string, message?: string): Promise<StudentLeaveEntity | null>;
    findById(id: string): Promise<StudentLeaveEntity | null>;
}
