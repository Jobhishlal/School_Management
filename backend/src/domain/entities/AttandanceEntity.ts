import { Types } from "mongoose";

export type AttendanceStatus = "Present" | "Absent" | "Leave";

export type AttendanceSession = "Morning" | "Afternoon";

export class AttendanceItemEntity {
  constructor(
    public readonly studentId: Types.ObjectId,
    public status: AttendanceStatus,
    public readonly remarks?: string
  ) {}
}

export class AttendanceEntity {
  constructor(
    public readonly classId: string,
    public readonly teacherId: string,
    public readonly date: Date,
    public readonly session: AttendanceSession,
    public readonly attendanceItems: AttendanceItemEntity[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate() {
    if (!this.classId) throw new Error("ClassId is required");
    if (!this.teacherId) throw new Error("TeacherId is required");
    if (!this.date) throw new Error("Date is required");
    if (!this.session) throw new Error("Session is required");

    if (!this.attendanceItems || this.attendanceItems.length === 0) {
      throw new Error("Attendance items cannot be empty");
    }
  }
}
