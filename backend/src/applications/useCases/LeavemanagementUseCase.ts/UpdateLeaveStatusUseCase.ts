import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export class UpdateLeaveStatusUseCase {
    constructor(
        private leaveRepo: InterfaceLeaveManagement,
        private teacherRepo: ITeacherCreate
    ) { }

    async execute(
        leaveId: string,
        status: string,
        actionBy: string,
        adminRemark?: string
    ): Promise<LeaveManagementEntity | null> {
        const updatedLeave = await this.leaveRepo.updateStatus(
            leaveId,
            status,
            actionBy,
            adminRemark
        );

        if (updatedLeave && status === "APPROVED") {
            const teacher = await this.teacherRepo.findById(updatedLeave.teacherId);
            if (teacher && teacher.leaveBalance) {
                if (updatedLeave.leaveType === "SICK") {
                    teacher.leaveBalance.sickLeave -= updatedLeave.totalDays;
                } else if (updatedLeave.leaveType === "CASUAL") {
                    teacher.leaveBalance.casualLeave -= updatedLeave.totalDays;
                }

                await this.teacherRepo.update(teacher.id, {
                    leaveBalance: teacher.leaveBalance,
                });
            }
        }

        return updatedLeave;
    }
}
