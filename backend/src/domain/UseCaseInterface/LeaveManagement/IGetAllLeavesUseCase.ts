import { LeaveManagementEntity } from "../../entities/LeaveManagement/LeaveManagementEntity";


export interface IGetAllLeavesUseCase{
    execute():Promise<LeaveManagementEntity[]>
}