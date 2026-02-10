export type StudentProgress =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_IMPROVEMENT"
  | "POOR";

export class ExamMarkEntity {
  private _id: string;
  private _examId: string;
  private _studentId: string;
  private _teacherId: string;
  private _marksObtained: number;
  private _progress: StudentProgress;
  private _remarks: string;
  private _concern: string | null;
  private _concernStatus: "Pending" | "Resolved" | "Rejected" | null;
  private _concernResponse: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    examId: string,
    studentId: string,
    teacherId: string,
    marksObtained: number,
    progress: StudentProgress,
    remarks: string,
    concern: string | null,
    concernStatus: "Pending" | "Resolved" | "Rejected" | null,
    concernResponse: string | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._examId = examId;
    this._studentId = studentId;
    this._teacherId = teacherId;
    this._marksObtained = marksObtained;
    this._progress = progress;
    this._remarks = remarks;
    this._concern = concern;
    this._concernStatus = concernStatus;
    this._concernResponse = concernResponse;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get examId(): string { return this._examId; }
  set examId(value: string) { this._examId = value; }

  get studentId(): string { return this._studentId; }
  set studentId(value: string) { this._studentId = value; }

  get teacherId(): string { return this._teacherId; }
  set teacherId(value: string) { this._teacherId = value; }

  get marksObtained(): number { return this._marksObtained; }
  set marksObtained(value: number) { this._marksObtained = value; }

  get progress(): StudentProgress { return this._progress; }
  set progress(value: StudentProgress) { this._progress = value; }

  get remarks(): string { return this._remarks; }
  set remarks(value: string) { this._remarks = value; }

  get concern(): string | null { return this._concern; }
  set concern(value: string | null) { this._concern = value; }

  get concernStatus(): "Pending" | "Resolved" | "Rejected" | null { return this._concernStatus; }
  set concernStatus(value: "Pending" | "Resolved" | "Rejected" | null) { this._concernStatus = value; }

  get concernResponse(): string | null { return this._concernResponse; }
  set concernResponse(value: string | null) { this._concernResponse = value; }

  get createdAt(): Date { return this._createdAt; }
  set createdAt(value: Date) { this._createdAt = value; }

  get updatedAt(): Date { return this._updatedAt; }
  set updatedAt(value: Date) { this._updatedAt = value; }

  public static calculateProgress(marks: number): StudentProgress {
    if (marks >= 90) return "EXCELLENT";
    if (marks >= 70) return "GOOD";
    if (marks >= 40) return "NEEDS_IMPROVEMENT";
    return "POOR";
  }
}
