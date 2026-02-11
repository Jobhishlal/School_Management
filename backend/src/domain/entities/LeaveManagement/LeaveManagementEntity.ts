import { LeaveError } from "../../enums/LeaveError";

const REASON_REGEX = /^[a-zA-Z\s.,]+$/;

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

  public static validate(data: {
    leaveType: string;
    startDate: string | Date;
    endDate: string | Date;
    reason: string;
  }): void {
    if (!data.leaveType || !data.startDate || !data.endDate || !data.reason) {
      throw new Error(LeaveError.REQUIRED);
    }

    const validLeaveTypes = ["CASUAL", "SICK", "PAID", "UNPAID", "EXTRA"];
    if (!validLeaveTypes.includes(data.leaveType)) {
      throw new Error(LeaveError.INVALID_LEAVE_TYPE);
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error(LeaveError.INVALID_DATE);
    }

    if (startDate > endDate) {
      throw new Error(LeaveError.INVALID_DATE_RANGE);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new Error(LeaveError.PAST_DATE);
    }

    if (!data.reason.trim()) {
      throw new Error(LeaveError.REASON_REQUIRED);
    }

    if (!REASON_REGEX.test(data.reason)) {
      throw new Error(LeaveError.INVALID_REASON_FORMAT);
    }
  }
}
