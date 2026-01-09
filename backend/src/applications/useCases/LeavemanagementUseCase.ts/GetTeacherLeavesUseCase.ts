import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export class GetTeacherLeavesUseCase {
    constructor(private leaveRepo: InterfaceLeaveManagement) { }

    async execute(teacherId: string): Promise<LeaveManagementEntity[]> {
        return this.leaveRepo.getLeavesByTeacherId(teacherId);
    }
}
