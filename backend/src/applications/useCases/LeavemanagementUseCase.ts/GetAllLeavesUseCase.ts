import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IGetAllLeavesUseCase } from "../../interface/UseCaseInterface/LeaveManagement/IGetAllLeavesUseCase";

export class GetAllLeavesUseCase implements IGetAllLeavesUseCase{
    constructor(private leaveRepo: InterfaceLeaveManagement) { }

    async execute(): Promise<LeaveManagementEntity[]> {
        return this.leaveRepo.getAllLeaves();
    }
}
