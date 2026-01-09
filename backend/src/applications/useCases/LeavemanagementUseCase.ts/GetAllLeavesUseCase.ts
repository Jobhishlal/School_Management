import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export class GetAllLeavesUseCase {
    constructor(private leaveRepo: InterfaceLeaveManagement) { }

    async execute(): Promise<LeaveManagementEntity[]> {
        return this.leaveRepo.getAllLeaves();
    }
}
