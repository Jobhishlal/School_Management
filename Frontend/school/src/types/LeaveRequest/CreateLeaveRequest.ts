export interface CreateLeaveDTO {
  leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID";
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface LeaveRequestEntity {
  id: string;
  teacherId: string;
  teacherName?: string;
  leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID";
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  appliedAt: string;
  actionBy?: string;
  actionAt?: string;
  adminRemark?: string;
  warningMessage?: string;
}
