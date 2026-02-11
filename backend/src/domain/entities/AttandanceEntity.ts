import { AttendanceErrors } from "../enums/Attendance/Attendance";
import { AttendanceErrorEnums } from "../../shared/constants/AttendanceErrorEnums";

export type AttendanceStatus = "Present" | "Absent" | "Leave";

export type AttendanceSession = "Morning" | "Afternoon";

export class AttendanceItemEntity {
  private _studentId: string;
  private _status: AttendanceStatus;
  private _remarks?: string;

  constructor(
    studentId: string,
    status: AttendanceStatus,
    remarks?: string
  ) {
    this._studentId = studentId;
    this._status = status;
    this._remarks = remarks;
  }

  get studentId(): string { return this._studentId; }
  set studentId(value: string) { this._studentId = value; }

  get status(): AttendanceStatus { return this._status; }
  set status(value: AttendanceStatus) { this._status = value; }

  get remarks(): string | undefined { return this._remarks; }
  set remarks(value: string | undefined) { this._remarks = value; }
}

export class AttendanceEntity {
  private _classId: string;
  private _teacherId: string;
  private _date: Date;
  private _session: AttendanceSession;
  private _attendanceItems: AttendanceItemEntity[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(
    classId: string,
    teacherId: string,
    date: Date,
    session: AttendanceSession,
    attendanceItems: AttendanceItemEntity[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._classId = classId;
    this._teacherId = teacherId;
    this._date = date;
    this._session = session;
    this._attendanceItems = attendanceItems;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get classId(): string { return this._classId; }
  set classId(value: string) { this._classId = value; }

  get teacherId(): string { return this._teacherId; }
  set teacherId(value: string) { this._teacherId = value; }

  get date(): Date { return this._date; }
  set date(value: Date) { this._date = value; }

  get session(): AttendanceSession { return this._session; }
  set session(value: AttendanceSession) { this._session = value; }

  get attendanceItems(): AttendanceItemEntity[] { return this._attendanceItems; }
  set attendanceItems(value: AttendanceItemEntity[]) { this._attendanceItems = value; }

  get createdAt(): Date | undefined { return this._createdAt; }
  set createdAt(value: Date | undefined) { this._createdAt = value; }

  get updatedAt(): Date | undefined { return this._updatedAt; }
  set updatedAt(value: Date | undefined) { this._updatedAt = value; }

  public static validate(data: {
    classId: string;
    teacherId: string;
    attendance: { studentId: string; status: string; remarks?: string }[];
    session: string;
  }): void {
    if (!data.classId || !data.teacherId || !data.attendance || !data.session) {
      throw new Error(AttendanceErrors.REQUIRED);
    }

    if (!Array.isArray(data.attendance) || data.attendance.length === 0) {
      throw new Error(AttendanceErrors.EMPTY_ATTENDANCE);
    }

    const uniqueStudents = new Set<string>();

    data.attendance.forEach(item => {
      if (!item.studentId) {
        throw new Error(`${AttendanceErrors.INVALID_ID}: studentId`);
      }

      if (!["Present", "Absent", "Leave"].includes(item.status)) {
        throw new Error(AttendanceErrors.INVALID_STATUS);
      }

      if (uniqueStudents.has(item.studentId)) {
        throw new Error(AttendanceErrors.DUPLICATE_STUDENT);
      }

      uniqueStudents.add(item.studentId);

      if (item.remarks && item.remarks.length > 200) {
        throw new Error(AttendanceErrors.REMARK_LENGTH);
      }
    });
  }

  public static validateFilter(startDate: string | Date, endDate: string | Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (!startDate) {
      throw new Error(AttendanceErrorEnums.START_DATE_REQUIRED);
    }

    if (!endDate) {
      throw new Error(AttendanceErrorEnums.END_DATE_REQUIRED);
    }

    if (end > today) {
      throw new Error(AttendanceErrorEnums.FUTURE_DATE_NOT_ALLOWED);
    }

    if (start > end) {
      throw new Error(AttendanceErrorEnums.INVALID_DATE_RANGE);
    }
  }
}
