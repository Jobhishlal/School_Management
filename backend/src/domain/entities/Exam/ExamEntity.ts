import { Types } from "mongoose";

export type ExamType = "UNIT_TEST" | "MIDTERM" | "FINAL";
export type ExamStatus = "DRAFT" | "PUBLISHED";

export class ExamEntity {
  constructor(
    public readonly id: string,

    public readonly examId: string,
    public readonly title: string,
    public readonly type: ExamType,

    public readonly classId: Types.ObjectId,
    public readonly className: string,
    public readonly division: string,

    public readonly subject: string,

    public readonly teacherId: Types.ObjectId,
    public readonly teacherName: string,

    public readonly examDate: Date,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly maxMarks: number,

    public readonly description: string = "",
    public readonly status: ExamStatus = "DRAFT",
    public readonly pendingConcerns: number = 0,
    public readonly concerns: Array<{ studentName: string, concern: string, studentId: string }> = []
  ) { }
}
