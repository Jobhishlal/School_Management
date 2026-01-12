import { Types } from "mongoose";

export class LeaveManagementEntity {
  constructor(
    public readonly id: string,

    public readonly teacherId: string | undefined,
    public readonly subAdminId: string | undefined,
    public readonly applicantRole: "TEACHER" | "SUB_ADMIN",

    public leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID" | "EXTRA",

    public startDate: Date,
    public endDate: Date,
    public totalDays: number,

    public reason: string,

    public status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED",

    public appliedAt: Date,

    public actionBy?: string,
    public actionAt?: Date,
    public adminRemark?: string,
    public warningMessage?: string,
    public teacherName?: string,
    public subAdminName?: string
  ) { }
}
