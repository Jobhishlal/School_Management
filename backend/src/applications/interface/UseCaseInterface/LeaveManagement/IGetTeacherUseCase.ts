import { LeaveManagementEntity } from "../../entities/LeaveManagement/LeaveManagementEntity";

export interface IGetTeacherUseCase {
    execute(teacherId:string):Promise<LeaveManagementEntity[]>
}