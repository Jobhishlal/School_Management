import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IGetTeacherUseCase } from "../../../domain/UseCaseInterface/LeaveManagement/IGetTeacherUseCase";

// Reusing IGetTeacherUseCase interface structure or defining new one?
// Since IGetTeacherUseCase likely has execute(id): Promise<LeaveManagementEntity[]>, we can define a new similar interface or just use a class.
// Let's define a new interface in line for simplicity or check if IGetTeacherUseCase is generic enough.
// IGetTeacherUseCase is named specific to Teacher. Let's make a new one or just export the class.

export interface IGetSubAdminLeavesUseCase {
    execute(subAdminId: string): Promise<LeaveManagementEntity[]>;
}

export class GetSubAdminLeavesUseCase implements IGetSubAdminLeavesUseCase {
    constructor(private readonly leaveRepo: InterfaceLeaveManagement) { }

    async execute(subAdminId: string): Promise<LeaveManagementEntity[]> {
        return await this.leaveRepo.getLeavesBySubAdminId(subAdminId);
    }
}
