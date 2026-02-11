import { CreateLeaveDTO } from "../../../applications/dto/LeaveManagement/CreateLeaveManagementDTO"
import { LeaveManagementEntity } from "../../entities/LeaveManagement/LeaveManagementEntity"
export interface ICreateLeaveusecase {
    execute(teacherId:string,data:CreateLeaveDTO):Promise<LeaveManagementEntity>
}