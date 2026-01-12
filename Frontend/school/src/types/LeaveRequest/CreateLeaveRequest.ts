export interface CreateLeaveDTO {
  leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID" | "EXTRA";
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface LeaveRequestEntity {
  id: string;
  teacherId?: string;
  subAdminId?: string;
  applicantRole?: "TEACHER" | "SUB_ADMIN";
  teacherName?: string;
  subAdminName?: string;
  leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID" | "EXTRA";
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
