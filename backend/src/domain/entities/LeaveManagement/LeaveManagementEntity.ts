import { Types } from "mongoose";

export class LeaveManagementEntity {
  constructor(
    public readonly id: string,

    public readonly teacherId: string,

    public leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID",

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
    public teacherName?: string
  ) { }
}
