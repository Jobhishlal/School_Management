import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export interface IUpdateLeaveStatusUseCase {
  execute(
    leaveId: string,
    status: "APPROVED" | "REJECTED" | "CANCELLED",
    actionBy: string,
    adminRemark?: string
  ): Promise<LeaveManagementEntity | null>;
}
